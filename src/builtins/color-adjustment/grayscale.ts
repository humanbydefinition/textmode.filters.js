import { defineBuiltinFilter } from '../definition';
import grayscaleSource from './grayscale.frag';

/**
 * Options for the built-in grayscale effect.
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GrayscaleOptions | GrayscaleOptions API reference}
 */
export interface GrayscaleOptions {
	/**
	 * Grayscale blend amount, from `0` (original color) to `1` (fully grayscale).
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GrayscaleOptions#property-amount | GrayscaleOptions.amount API reference}
	 */
	amount?: number;
}

export const grayscaleFilter = defineBuiltinFilter<GrayscaleOptions>({
	id: 'grayscale',
	shader: grayscaleSource,
	primary: 'amount',
	uniforms: {
		u_amount: ['amount', 1],
	},
});
