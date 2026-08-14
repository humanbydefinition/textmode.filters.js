import type { TextmodeUniformValue } from 'textmode.js';

/**
 * One normalized uniform binding for a built-in filter.
 */
export type BuiltinUniformBinding = readonly [uniform: string, parameter: string, defaultValue: TextmodeUniformValue];

/**
 * Runtime descriptor for one built-in filter, produced by {@link defineBuiltinFilter}.
 */
export interface BuiltinFilterDescriptor {
	readonly id: string;
	readonly source: string;
	readonly uniforms: readonly BuiltinUniformBinding[];
	readonly primary?: string;
}

/**
 * Define one built-in filter by co-locating its option type, fragment shader, and uniform mappings.
 *
 * The helper only builds an internal descriptor. It never compiles shaders, registers filters, or
 * touches plugin lifecycle.
 */
export function defineBuiltinFilter<TOptions extends object>(definition: {
	readonly id: string;
	readonly shader: string;
	readonly uniforms: Readonly<
		Record<string, readonly [parameter: keyof TOptions, defaultValue: TextmodeUniformValue]>
	>;
	readonly primary?: keyof TOptions;
}): BuiltinFilterDescriptor {
	const uniforms: BuiltinUniformBinding[] = Object.entries(definition.uniforms).map(
		([uniform, [parameter, defaultValue]]) => [uniform, parameter as string, defaultValue]
	);
	const primary = (definition.primary ?? uniforms[0]?.[1]) as string | undefined;
	if (uniforms.length > 0 && primary === undefined) {
		throw new TypeError(`Builtin filter "${definition.id}" requires an explicit primary parameter.`);
	}
	const descriptor: BuiltinFilterDescriptor = {
		id: definition.id,
		source: definition.shader,
		uniforms,
		...(primary !== undefined ? { primary } : {}),
	};
	return Object.freeze(descriptor);
}
