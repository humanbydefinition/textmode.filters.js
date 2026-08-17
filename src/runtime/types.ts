import type { TextmodeShader } from 'textmode.js';
import type { BuiltinFilterDescriptor } from '../builtins/definition';

export type UniformBinding = BuiltinFilterDescriptor['uniforms'][number];

export interface NormalizedFilterDescriptor {
	readonly id: string;
	readonly source?: string;
	shader?: TextmodeShader;
	readonly uniforms: readonly UniformBinding[];
	readonly primary?: string;
}

export interface QueuedFilterRequest {
	readonly name: string;
	readonly params: unknown;
	readonly frameToken: number;
}

export interface ResolvedFilterPass {
	readonly name: string;
	readonly shader: TextmodeShader;
	readonly uniforms: readonly UniformBinding[];
	readonly primary?: string;
	readonly params: unknown;
}
