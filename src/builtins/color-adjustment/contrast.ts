import { defineBuiltinFilter } from '../definition';
import contrastSource from './contrast.frag';

/**
 * Configuration options for the `'contrast'` filter.
 *
 * Adjusts image contrast by scaling pixel values around mid-gray.
 *
 * @example
 * {@includeCode ../../../examples/ColorAdjustment/contrast/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ContrastOptions | ContrastOptions API reference}
 */
export interface ContrastOptions {
	/**
	 * Contrast multiplier.
	 *
	 * - `1.0` = normal contrast (no change)
	 * - `> 1.0` = more contrast (darker darks, brighter brights)
	 * - `< 1.0` = less contrast (more gray/washed out)
	 * - `0.0` = solid gray
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ContrastOptions#amount | ContrastOptions.amount API reference}
	 */
	amount?: number;
}

export const contrastFilter = defineBuiltinFilter<ContrastOptions>({
	id: 'contrast',
	shader: contrastSource,
	primary: 'amount',
	uniforms: {
		u_amount: ['amount', 1],
	},
});
