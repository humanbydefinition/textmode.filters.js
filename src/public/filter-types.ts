import type { TextmodeShader, TextmodeUniformValue } from 'textmode.js';
import type { BuiltInFilterName } from '../builtins/catalog';

/**
 * Uniform declarations for a custom filter, mapping GLSL names to public parameter names and defaults.
 *
 * @category Custom filters
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
 * @category Custom filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/type-aliases/TextmodeFilterShader | TextmodeFilterShader API reference}
 */
export type TextmodeFilterShader = TextmodeShader | string;

/**
 * Built-in names retain completion while arbitrary custom names remain valid.
 *
 * @category Custom filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/type-aliases/FilterName | FilterName API reference}
 */
export type FilterName = BuiltInFilterName | (string & {});
