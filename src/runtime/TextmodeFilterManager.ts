import type {
	TextmodeFramebuffer,
	TextmodeLayer,
	TextmodeLayerOutputPhase,
	TextmodeShader,
	Textmodifier,
} from 'textmode.js';

import { BUILTIN_CATALOG } from '../builtins/catalog';
import type { FilterName, TextmodeFilterShader, TextmodeFilterUniformDefinitions } from '../public/filter-types';
import { FilterRegistry } from './FilterRegistry';
import { FilterRenderer } from './FilterRenderer';
import { FilterScheduler } from './FilterScheduler';
import type { NormalizedFilterDescriptor, ResolvedFilterPass } from './types';

/**
 * Owns filter registration, queues, GPU resources, pass execution, and cleanup.
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/classes/TextmodeFilterManager | TextmodeFilterManager API reference}
 */
export class TextmodeFilterManager {
	private readonly _textmodifier: Textmodifier;
	private readonly _registry: FilterRegistry;
	private readonly _scheduler: FilterScheduler;
	private readonly _renderer: FilterRenderer;
	private _finalDrawCallback: () => void = () => {};
	private _disposed = false;

	/**
	 * Create the manager used by one installed plugin instance.
	 *
	 * @internal
	 */
	constructor(textmodifier: Textmodifier) {
		this._textmodifier = textmodifier;
		this._renderer = new FilterRenderer(textmodifier);
		this._registry = new FilterRegistry(textmodifier, this._renderer.vertexSource, Object.values(BUILTIN_CATALOG));
		this._scheduler = new FilterScheduler();
	}

	/**
	 * Register or replace a custom filter. String sources and URLs compile before the returned promise resolves.
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
		await this._registry.register(id, shader, uniforms);
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
		return this._registry.unregister(id);
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
		return this._registry.has(id);
	}

	/**
	 * Compile every bundled built-in source. Used by the host `preSetup` hook.
	 *
	 * @internal
	 */
	public initializeBuiltins(): Promise<void> {
		this._assertLive();
		return this._registry.initializeBuiltins();
	}

	/**
	 * Queue a layer filter request. Used by the host layer extension.
	 *
	 * @internal
	 */
	public queueLayer(layer: TextmodeLayer, name: string, params: unknown): void {
		this._assertLive();
		this._scheduler.queueLayer(layer, name, params);
	}

	/**
	 * Queue a textmodifier filter request. Used by the host textmodifier extension.
	 *
	 * @internal
	 */
	public queueComposite(name: string, params: unknown): void {
		this._assertLive();
		this._scheduler.queueComposite(name, params);
	}

	/**
	 * Open the current frame. Used by the host `preDraw` hook.
	 *
	 * @internal
	 */
	public beginFrame(): void {
		this._scheduler.beginFrame();
	}

	/**
	 * Close the current frame. Used by the host `postDraw` hook.
	 *
	 * @internal
	 */
	public endFrame(): void {
		this._scheduler.endFrame();
	}

	/**
	 * Configure the final-draw callback. Used by the host textmodifier extension.
	 *
	 * @internal
	 */
	public setFinalDrawCallback(callback: () => void): void {
		this._finalDrawCallback = callback;
	}

	/**
	 * Transform a layer's resolved or finalized output through its queued filters.
	 *
	 * @internal
	 */
	public transformLayer(
		layer: TextmodeLayer,
		phase: TextmodeLayerOutputPhase,
		output: TextmodeFramebuffer
	): TextmodeFramebuffer {
		if (phase === 'resolved') {
			const transformed = this._applyKnown(output, this._scheduler.drainLayerDraw(layer), layer, false);
			this._scheduler.setLayerPhase(layer, 'postDraw');
			return transformed;
		}
		try {
			return this._applyKnown(output, this._scheduler.drainLayerPostDraw(layer), layer, false);
		} finally {
			this._scheduler.setLayerPhase(layer, 'draw');
		}
	}

	/**
	 * Transform the composited scene through the global and final queues.
	 *
	 * @internal
	 */
	public transformComposite(output: TextmodeFramebuffer): TextmodeFramebuffer {
		let current = output;
		try {
			current = this._applyKnown(current, this._scheduler.drainGlobal(), undefined, true);
			this._scheduler.beginFinalDraw();
			try {
				this._finalDrawCallback.call(this._textmodifier);
			} finally {
				this._scheduler.endFinalDraw();
			}
			return this._applyKnown(current, this._scheduler.drainFinal(), undefined, true);
		} finally {
			this._scheduler.resetComposite();
		}
	}

	/**
	 * Release a layer's scratch resources when the host disposes it.
	 *
	 * @internal
	 */
	public disposeLayer(layer: TextmodeLayer): void {
		this._renderer.disposeLayer(layer);
		this._scheduler.disposeLayer(layer);
	}

	/**
	 * Release every filter-owned shader, queue, and scratch framebuffer.
	 *
	 * @internal
	 */
	public dispose(): void {
		if (this._disposed) return;
		this._registry.dispose();
		this._renderer.dispose();
		this._scheduler.dispose();
		this._disposed = true;
	}

	private _applyKnown(
		input: TextmodeFramebuffer,
		entries: readonly { readonly name: string; readonly params: unknown }[],
		layer: TextmodeLayer | undefined,
		composite: boolean
	): TextmodeFramebuffer {
		if (entries.length === 0) return input;
		const known: ResolvedFilterPass[] = [];
		for (const entry of entries) {
			const descriptor = this._registry.get(entry.name);
			if (!descriptor) {
				console.warn(`[textmode.filters.js] Unknown filter: "${entry.name}". Skipping.`);
				continue;
			}
			known.push(this._resolvePass(entry.name, descriptor, entry.params));
		}
		if (known.length === 0) return input;
		return composite
			? this._renderer.applyComposite(input, known)
			: this._renderer.applyLayer(layer!, input, known);
	}

	private _resolvePass(name: string, descriptor: NormalizedFilterDescriptor, params: unknown): ResolvedFilterPass {
		return {
			name,
			shader: this._shaderFor(descriptor),
			uniforms: descriptor.uniforms,
			params,
			...(descriptor.primary ? { primary: descriptor.primary } : {}),
		};
	}

	private _shaderFor(descriptor: NormalizedFilterDescriptor): TextmodeShader {
		if (descriptor.shader) return descriptor.shader;
		throw new Error('Filter shaders are not initialized. Wait for textmode setup to finish before drawing.');
	}

	private _assertLive(): void {
		if (this._disposed) throw new Error('TextmodeFilterManager has been disposed.');
	}
}
