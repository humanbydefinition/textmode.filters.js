import { defineBuiltinFilter } from '../definition';
import saturationSource from './saturation.frag';

/**
 * Configuration options for the `'saturation'` filter.
 *
 * Adjusts color intensity without affecting luminance.
 * Perfect for creating vivid, oversaturated looks or desaturating to grayscale.
 *
 * @example
 * {@includeCode ../../../examples/ColorAdjustment/saturation/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/SaturationOptions | SaturationOptions API reference}
 */
export interface SaturationOptions {
	/**
	 * Saturation multiplier.
	 *
	 * - `0.0` = grayscale (no color)
	 * - `1.0` = normal saturation (no change)
	 * - `> 1.0` = vivid/oversaturated colors
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/SaturationOptions#amount | SaturationOptions.amount API reference}
	 */
	amount?: number;
}

export const saturationFilter = defineBuiltinFilter<SaturationOptions>({
	id: 'saturation',
	shader: saturationSource,
	primary: 'amount',
	uniforms: {
		u_amount: ['amount', 1],
	},
});
