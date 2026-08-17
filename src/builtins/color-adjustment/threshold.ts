import { defineBuiltinFilter } from '../definition';
import thresholdSource from './threshold.frag';

/**
 * Options for the built-in threshold effect.
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ThresholdOptions | ThresholdOptions API reference}
 */
export interface ThresholdOptions {
	/**
	 * Luminance cutoff used to choose black or white output.
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ThresholdOptions#property-threshold | ThresholdOptions.threshold API reference}
	 */
	threshold?: number;
}

export const thresholdFilter = defineBuiltinFilter<ThresholdOptions>({
	id: 'threshold',
	shader: thresholdSource,
	primary: 'threshold',
	uniforms: {
		u_threshold: ['threshold', 0.5],
	},
});
