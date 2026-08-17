import { defineBuiltinFilter } from '../definition';
import brightnessSource from './brightness.frag';

/**
 * Configuration options for the `'brightness'` filter.
 *
 * Adjusts image brightness by multiplying pixel values.
 *
 * @example
 * {@includeCode ../../../examples/ColorAdjustment/brightness/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BrightnessOptions | BrightnessOptions API reference}
 */
export interface BrightnessOptions {
	/**
	 * Brightness multiplier.
	 *
	 * - `1.0` = normal brightness (no change)
	 * - `> 1.0` = brighter
	 * - `< 1.0` = darker
	 * - `0.0` = completely black
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BrightnessOptions#amount | BrightnessOptions.amount API reference}
	 */
	amount?: number;
}

export const brightnessFilter = defineBuiltinFilter<BrightnessOptions>({
	id: 'brightness',
	shader: brightnessSource,
	primary: 'amount',
	uniforms: {
		u_amount: ['amount', 1],
	},
});
