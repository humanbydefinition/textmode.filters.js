import type {
	TextmodeFramebuffer,
	TextmodeLayer,
	TextmodePluginContext,
	TextmodePluginGpuContext,
	TextmodeShader,
	TextmodeUniformValue,
	Textmodifier,
} from 'textmode.js';

import { BUILTIN_FILTERS, type FilterUniformDefinitions } from './builtins';
import type { FilterName } from './types';

/**
 * Uniform declarations for a custom filter, mapping GLSL names to public parameter names and defaults.
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/type-aliases/TextmodeFilterUniformDefinitions | TextmodeFilterUniformDefinitions API reference}
 */
export type TextmodeFilterUniformDefinitions = Record<
	string,
	readonly [paramName: string, defaultValue: TextmodeUniformValue]
>;

/**
 * A precompiled textmode shader, inline fragment source, or shader URL accepted by custom registration.
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/type-aliases/TextmodeFilterShader | TextmodeFilterShader API reference}
 */
export type TextmodeFilterShader = TextmodeShader | string;

interface FilterDescriptor {
	readonly uniforms: FilterUniformDefinitions;
	readonly source?: string;
	readonly shader?: TextmodeShader;
	cachedShader?: TextmodeShader;
}

interface QueuedFilter {
	readonly name: string;
	readonly params: unknown;
	readonly frameToken: number;
}

interface LayerState {
	phase: 'draw' | 'postDraw';
	drawQueue: QueuedFilter[];
	postQueue: QueuedFilter[];
	pool?: ScratchPool;
}

type ScratchPool = [TextmodeFramebuffer, TextmodeFramebuffer];
const managerByLayer = new WeakMap<TextmodeLayer, TextmodeFilterManager>();

/**
 * Owns filter registration, queues, lazy GPU resources, pass execution, and cleanup.
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/classes/TextmodeFilterManager | TextmodeFilterManager API reference}
 */
export class TextmodeFilterManager {
	private readonly _textmodifier: Textmodifier;
	private readonly _context: TextmodePluginContext;
	private readonly _gpu: TextmodePluginGpuContext;
	private readonly _filters = new Map<string, FilterDescriptor>();
	private readonly _layerStates = new WeakMap<TextmodeLayer, LayerState>();
	private readonly _layers = new Set<TextmodeLayer>();
	private readonly _pools = new Set<ScratchPool>();
	private _compositePool?: ScratchPool;
	private _globalQueue: QueuedFilter[] = [];
	private _finalQueue: QueuedFilter[] = [];
	private _isRunningFinalDraw = false;
	private _frameOpen = false;
	private _frameToken = 0;
	private _finalDrawCallback: () => void = () => {};
	private _disposed = false;

	/**
	 * Create the manager used by one installed plugin instance.
	 *
	 * @internal
	 */
	constructor(textmodifier: Textmodifier, context: TextmodePluginContext) {
		this._textmodifier = textmodifier;
		this._context = context;
		this._gpu = context.gpu;
		for (const [name, descriptor] of Object.entries(BUILTIN_FILTERS)) {
			this._filters.set(name, { source: descriptor.source, uniforms: descriptor.uniforms });
		}
		this._installAdapters();
	}

	/**
	 * Register or replace a custom filter. Inline sources compile lazily; URL/path sources are fetched now and compile lazily.
	 * Caller-provided shaders are owned by the manager and disposed on replacement, unregister, or plugin uninstall.
	 *
	 * @example
	 * ```ts
	 * await t.filters.register('duotone', fragmentSource, { u_amount: ['amount', 1] });
	 * ```
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/classes/TextmodeFilterManager#register | TextmodeFilterManager.register API reference}
	 */
	public async register(
		id: FilterName,
		shader: TextmodeFilterShader,
		uniforms: TextmodeFilterUniformDefinitions = {}
	): Promise<void> {
		this._assertLive();
		if (!id.trim()) throw new TypeError('Filter id cannot be empty.');
		const descriptor: FilterDescriptor =
			typeof shader === 'string'
				? { source: await resolveShaderSource(shader), uniforms }
				: { shader, cachedShader: shader, uniforms };
		this._replace(id, descriptor);
	}

	/**
	 * Unregister a filter and dispose its compiled shader.
	 *
	 * @example
	 * ```ts
	 * t.filters.unregister('duotone');
	 * ```
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/classes/TextmodeFilterManager#unregister | TextmodeFilterManager.unregister API reference}
	 */
	public unregister(id: FilterName): boolean {
		const descriptor = this._filters.get(id);
		if (!descriptor) return false;
		descriptor.cachedShader?.dispose();
		this._filters.delete(id);
		return true;
	}

	/**
	 * Return whether a filter name is currently registered.
	 *
	 * @example
	 * ```ts
	 * if (t.filters.has('duotone')) t.filter('duotone');
	 * ```
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/classes/TextmodeFilterManager#has | TextmodeFilterManager.has API reference}
	 */
	public has(id: FilterName): boolean {
		return this._filters.has(id);
	}

	/**
	 * Release every filter-owned shader, queue, and scratch framebuffer.
	 *
	 * @internal
	 */
	public dispose(): void {
		if (this._disposed) return;
		for (const descriptor of this._filters.values()) descriptor.cachedShader?.dispose();
		for (const pool of [...this._pools]) this._disposePool(pool);
		for (const layer of this._layers) managerByLayer.delete(layer);
		this._filters.clear();
		this._layers.clear();
		this._globalQueue = [];
		this._finalQueue = [];
		this._disposed = true;
	}

	private _installAdapters(): void {
		this._context.defineExtension('textmodifier', 'filter', {
			value: (_name: string, _params?: unknown) => this._queueComposite(_name, _params),
		});
		this._context.defineExtension('textmodifier', 'filters', { get: () => this });
		this._context.defineExtension('textmodifier', 'finalDraw', {
			value: (callback: () => void) => {
				this._finalDrawCallback = callback;
			},
		});
		this._context.defineExtension('layerManager', 'filters', { get: () => this });
		this._context.defineExtension('layer', 'filter', {
			value(this: TextmodeLayer, name: string, params?: unknown) {
				managerByLayer.get(this)?._queueLayer(this, name, params);
			},
		});

		this._context.registerLayerCreatedHook((layer) => this._associateLayer(layer));
		this._context.registerLayerDisposedHook((layer) => this._disposeLayer(layer));
		this._context.registerLayerOutputTransform(({ layer, phase, output }) => {
			const state = this._stateFor(layer);
			if (phase === 'resolved') {
				const transformed = this._applyQueue(output, state.drawQueue, state, false);
				state.phase = 'postDraw';
				return transformed;
			}
			try {
				return this._applyQueue(output, state.postQueue, state, false);
			} finally {
				state.phase = 'draw';
			}
		});
		this._context.registerCompositeOutputTransform((output) => this._transformComposite(output));
		this._context.registerPreDrawHook(() => this._beginFrame());
		this._context.registerPostDrawHook(() => {
			this._frameOpen = false;
		});
	}

	private _beginFrame(): void {
		this._frameToken += 1;
		this._globalQueue = this._globalQueue.filter((entry) => entry.frameToken >= this._frameToken);
		this._finalQueue = this._finalQueue.filter((entry) => entry.frameToken >= this._frameToken);
		for (const layer of this._layers) {
			const state = this._layerStates.get(layer);
			if (!state) continue;
			state.phase = 'draw';
			state.drawQueue = state.drawQueue.filter((entry) => entry.frameToken >= this._frameToken);
			state.postQueue = state.postQueue.filter((entry) => entry.frameToken >= this._frameToken);
		}
		this._frameOpen = true;
	}

	private _queueLayer(layer: TextmodeLayer, name: string, params: unknown): void {
		this._assertLive();
		const state = this._stateFor(layer);
		(state.phase === 'postDraw' ? state.postQueue : state.drawQueue).push({
			name,
			params,
			frameToken: this._queueFrameToken(),
		});
	}

	private _queueComposite(name: string, params: unknown): void {
		this._assertLive();
		(this._isRunningFinalDraw ? this._finalQueue : this._globalQueue).push({
			name,
			params,
			frameToken: this._queueFrameToken(),
		});
	}

	private _transformComposite(output: TextmodeFramebuffer): TextmodeFramebuffer {
		let current = output;
		try {
			current = this._applyQueue(current, this._globalQueue, undefined, true);
			this._isRunningFinalDraw = true;
			this._finalDrawCallback.call(this._textmodifier);
			this._isRunningFinalDraw = false;
			return this._applyQueue(current, this._finalQueue, undefined, true);
		} finally {
			this._globalQueue = [];
			this._finalQueue = [];
			this._isRunningFinalDraw = false;
		}
	}

	private _applyQueue(
		input: TextmodeFramebuffer,
		queue: QueuedFilter[],
		state: LayerState | undefined,
		composite: boolean
	): TextmodeFramebuffer {
		const entries = queue.filter((entry) => entry.frameToken === this._frameToken);
		const future = queue.filter((entry) => entry.frameToken > this._frameToken);
		queue.splice(0, queue.length, ...future);
		if (entries.length === 0) return input;
		const known = entries.filter((entry) => {
			if (this._filters.has(entry.name)) return true;
			console.warn(`[textmode.filters.js] Unknown filter: "${entry.name}". Skipping.`);
			return false;
		});
		if (known.length === 0) return input;

		const pool = composite
			? (this._compositePool ??= this._createPool(input.width, input.height))
			: (state!.pool ??= this._createPool(input.width, input.height));
		this._resizePool(pool, input.width, input.height);

		let current = input;
		for (const entry of known) {
			const target = pool[0] === current ? pool[1] : pool[1] === current ? pool[0] : pool[0];
			const descriptor = this._filters.get(entry.name)!;
			const shader = this._shaderFor(descriptor);
			this._gpu.renderFullscreen({
				source: current,
				target,
				shader,
				uniforms: this._uniformsFor(descriptor.uniforms, entry.params),
			});
			current = target;
		}
		return current;
	}

	private _shaderFor(descriptor: FilterDescriptor): TextmodeShader {
		if (descriptor.cachedShader) return descriptor.cachedShader;
		descriptor.cachedShader = descriptor.shader ?? this._gpu.createFullscreenShader(descriptor.source!);
		return descriptor.cachedShader;
	}

	private _uniformsFor(definitions: FilterUniformDefinitions, params: unknown): Record<string, TextmodeUniformValue> {
		const result: Record<string, TextmodeUniformValue> = {};
		const entries = Object.entries(definitions);
		const primary = entries[0]?.[1][0];
		for (const [uniform, [parameter, fallback]] of entries) {
			let value = fallback;
			if (typeof params === 'number' && parameter === primary) value = params;
			else if (params && typeof params === 'object' && parameter in params) {
				const candidate = (params as Record<string, unknown>)[parameter];
				if (isUniformValue(candidate)) value = candidate;
			}
			result[uniform] = value;
		}
		return result;
	}

	private _associateLayer(layer: TextmodeLayer): void {
		managerByLayer.set(layer, this);
		this._layers.add(layer);
		this._stateFor(layer);
	}

	private _stateFor(layer: TextmodeLayer): LayerState {
		let state = this._layerStates.get(layer);
		if (!state) {
			state = { phase: 'draw', drawQueue: [], postQueue: [] };
			this._layerStates.set(layer, state);
			this._layers.add(layer);
		}
		return state;
	}

	private _disposeLayer(layer: TextmodeLayer): void {
		const state = this._layerStates.get(layer);
		if (state?.pool) this._disposePool(state.pool);
		this._layerStates.delete(layer);
		managerByLayer.delete(layer);
		this._layers.delete(layer);
	}

	private _createPool(width: number, height: number): ScratchPool {
		const pool: ScratchPool = [
			this._gpu.createFramebuffer({ width, height }),
			this._gpu.createFramebuffer({ width, height }),
		];
		this._pools.add(pool);
		return pool;
	}

	private _resizePool(pool: ScratchPool, width: number, height: number): void {
		if (pool[0].width === width && pool[0].height === height) return;
		pool[0].resize(width, height);
		pool[1].resize(width, height);
	}

	private _disposePool(pool: ScratchPool): void {
		pool[0].dispose();
		pool[1].dispose();
		this._pools.delete(pool);
		if (this._compositePool === pool) this._compositePool = undefined;
	}

	private _replace(id: string, descriptor: FilterDescriptor): void {
		this._filters.get(id)?.cachedShader?.dispose();
		this._filters.set(id, descriptor);
	}

	private _assertLive(): void {
		if (this._disposed) throw new Error('TextmodeFilterManager has been disposed.');
	}

	private _queueFrameToken(): number {
		return this._frameOpen ? this._frameToken : this._frameToken + 1;
	}
}

function isUniformValue(value: unknown): value is TextmodeUniformValue {
	return (
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		Array.isArray(value) ||
		value instanceof Float32Array ||
		value instanceof Int32Array ||
		(typeof value === 'object' && value !== null)
	);
}

async function resolveShaderSource(sourceOrPath: string): Promise<string> {
	const source = sourceOrPath.trim();
	if (source.includes('\n') || source.startsWith('#version') || source.includes('void main')) return sourceOrPath;
	const response = await fetch(sourceOrPath);
	if (!response.ok) throw new Error(`Failed to load filter shader "${sourceOrPath}": ${response.statusText}`);
	return response.text();
}
