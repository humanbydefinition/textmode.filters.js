import type { Textmodifier } from 'textmode.js';
import type { BuiltinFilterDescriptor } from '../builtins/definition';
import type { NormalizedFilterDescriptor, UniformBinding } from './types';
import type { TextmodeFilterShader, TextmodeFilterUniformDefinitions } from '../public/filter-types';

/**
 * Owns filter definitions, shader compilation, atomic replacement, lookup, and disposal.
 *
 * Bundled sources compile during {@link initializeBuiltins}; custom string sources compile before the
 * registration promise resolves. Precompiled shaders are accepted without recompilation and owned
 * (disposed on replacement, unregister, or registry disposal).
 */
export class FilterRegistry {
	private readonly _textmodifier: Textmodifier;
	private readonly _vertexSource: string;
	private readonly _descriptors = new Map<string, NormalizedFilterDescriptor>();
	private _disposed = false;

	constructor(textmodifier: Textmodifier, vertexSource: string, catalog: readonly BuiltinFilterDescriptor[]) {
		this._textmodifier = textmodifier;
		this._vertexSource = vertexSource;
		for (const descriptor of catalog) {
			this._descriptors.set(descriptor.id, {
				id: descriptor.id,
				source: descriptor.source,
				uniforms: descriptor.uniforms,
				...(descriptor.primary ? { primary: descriptor.primary } : {}),
			});
		}
	}

	public has(id: string): boolean {
		return this._descriptors.has(id);
	}

	public get(id: string): NormalizedFilterDescriptor | undefined {
		return this._descriptors.get(id);
	}

	public async register(
		id: string,
		shader: TextmodeFilterShader,
		uniforms: TextmodeFilterUniformDefinitions
	): Promise<void> {
		const compiled =
			typeof shader === 'string' ? await this._textmodifier.createShader(this._vertexSource, shader) : shader;
		if (this._disposed) {
			if (typeof shader === 'string') compiled.dispose();
			this._assertLive();
		}
		const bindings = normalizeUniformDefinitions(uniforms);
		this._replace(id, {
			id,
			shader: compiled,
			uniforms: bindings,
			...(bindings[0] ? { primary: bindings[0][1] } : {}),
		});
	}

	public unregister(id: string): boolean {
		const descriptor = this._descriptors.get(id);
		if (!descriptor) return false;
		descriptor.shader?.dispose();
		this._descriptors.delete(id);
		return true;
	}

	public async initializeBuiltins(): Promise<void> {
		const compiled: Array<{
			descriptor: NormalizedFilterDescriptor;
			shader: NonNullable<NormalizedFilterDescriptor['shader']>;
		}> = [];
		try {
			for (const [id, descriptor] of this._descriptors) {
				if (!descriptor.source || descriptor.shader) continue;
				const shader = await this._textmodifier.createShader(this._vertexSource, descriptor.source);
				if (this._disposed) {
					shader.dispose();
					this._assertLive();
				}
				if (this._descriptors.get(id) !== descriptor) {
					shader.dispose();
					continue;
				}
				descriptor.shader = shader;
				compiled.push({ descriptor, shader });
			}
		} catch (error) {
			for (const entry of compiled.reverse()) {
				if (entry.descriptor.shader !== entry.shader) continue;
				entry.descriptor.shader = undefined;
				if (!this._disposed) entry.shader.dispose();
			}
			throw error;
		}
	}

	public dispose(): void {
		for (const descriptor of this._descriptors.values()) descriptor.shader?.dispose();
		this._descriptors.clear();
		this._disposed = true;
	}

	private _replace(id: string, descriptor: NormalizedFilterDescriptor): void {
		this._descriptors.get(id)?.shader?.dispose();
		this._descriptors.set(id, descriptor);
	}

	private _assertLive(): void {
		if (this._disposed) throw new Error('TextmodeFilterManager has been disposed.');
	}
}

function normalizeUniformDefinitions(definitions: TextmodeFilterUniformDefinitions): readonly UniformBinding[] {
	return Object.entries(definitions).map(([uniform, [parameter, defaultValue]]): UniformBinding => [
		uniform,
		parameter,
		defaultValue,
	]);
}
