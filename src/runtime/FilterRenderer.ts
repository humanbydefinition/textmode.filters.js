import type {
	TextmodeFramebuffer,
	TextmodeLayer,
	TextmodeShader,
	TextmodeUniformValue,
	Textmodifier,
} from 'textmode.js';

import filterVertexSource from '../shaders/filter.vert';
import type { ResolvedFilterPass } from './types';

type ScratchPool = [TextmodeFramebuffer, TextmodeFramebuffer];

/**
 * GPU pass and resource module: uniform resolution, scratch framebuffer pools, ping-pong target
 * selection, and exception-safe pass execution. Owns the shared filter vertex source and all
 * scratch framebuffers allocated for layers and the composite pipeline.
 */
export class FilterRenderer {
	private readonly _textmodifier: Textmodifier;
	private readonly _vertexSource: string;
	private _layerPools = new WeakMap<TextmodeLayer, ScratchPool>();
	private readonly _pools = new Set<ScratchPool>();
	private _compositePool?: ScratchPool;

	constructor(textmodifier: Textmodifier) {
		this._textmodifier = textmodifier;
		this._vertexSource = filterVertexSource;
	}

	public get vertexSource(): string {
		return this._vertexSource;
	}

	public applyLayer(
		layer: TextmodeLayer,
		input: TextmodeFramebuffer,
		passes: readonly ResolvedFilterPass[]
	): TextmodeFramebuffer {
		let pool = this._layerPools.get(layer);
		if (!pool) {
			pool = this._createPool(input.width, input.height);
			this._layerPools.set(layer, pool);
		}
		return this._apply(input, passes, pool);
	}

	public applyComposite(input: TextmodeFramebuffer, passes: readonly ResolvedFilterPass[]): TextmodeFramebuffer {
		this._compositePool ??= this._createPool(input.width, input.height);
		return this._apply(input, passes, this._compositePool);
	}

	public disposeLayer(layer: TextmodeLayer): void {
		const pool = this._layerPools.get(layer);
		if (pool) this._disposePool(pool);
		this._layerPools.delete(layer);
	}

	public dispose(): void {
		for (const pool of [...this._pools]) this._disposePool(pool);
		this._layerPools = new WeakMap();
		this._compositePool = undefined;
	}

	private _apply(
		input: TextmodeFramebuffer,
		passes: readonly ResolvedFilterPass[],
		pool: ScratchPool
	): TextmodeFramebuffer {
		if (passes.length === 0) return input;
		this._resizePool(pool, input.width, input.height);

		let current = input;
		for (const pass of passes) {
			const target = pool[0] === current ? pool[1] : pool[1] === current ? pool[0] : pool[0];
			this._renderPass(current, target, pass.shader, this._resolveUniforms(pass));
			current = target;
		}
		return current;
	}

	private _renderPass(
		source: TextmodeFramebuffer,
		target: TextmodeFramebuffer,
		shader: TextmodeShader,
		uniforms: Record<string, TextmodeUniformValue>
	): void {
		this._textmodifier.push();
		let targetBegun = false;
		try {
			target.begin();
			targetBegun = true;
			this._textmodifier.shader(shader);
			this._textmodifier.setUniforms({
				u_texture: source.textures[0]!,
				u_resolution: [target.width, target.height],
				...uniforms,
			});
			this._textmodifier.rect(target.width, target.height);
		} finally {
			try {
				if (targetBegun) target.end();
			} finally {
				this._textmodifier.pop();
			}
		}
	}

	private _resolveUniforms(pass: ResolvedFilterPass): Record<string, TextmodeUniformValue> {
		const result: Record<string, TextmodeUniformValue> = {};
		for (const [uniform, parameter, defaultValue] of pass.uniforms) {
			let value = defaultValue;
			if (typeof pass.params === 'number' && parameter === pass.primary) value = pass.params;
			else if (pass.params && typeof pass.params === 'object' && parameter in pass.params) {
				const candidate = (pass.params as Record<string, unknown>)[parameter];
				if (isUniformValue(candidate)) value = candidate;
			}
			result[uniform] = value;
		}
		return result;
	}

	private _createPool(width: number, height: number): ScratchPool {
		const pool: ScratchPool = [
			this._textmodifier.createFramebuffer({ width, height, attachments: 1, depth: false }),
			this._textmodifier.createFramebuffer({ width, height, attachments: 1, depth: false }),
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
