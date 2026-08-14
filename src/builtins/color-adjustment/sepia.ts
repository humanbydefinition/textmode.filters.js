import { defineBuiltinFilter } from '../definition';
import sepiaSource from './sepia.frag';

/**
 * Options for the built-in sepia effect.
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/SepiaOptions | SepiaOptions API reference}
 */
export interface SepiaOptions {
	/**
	 * Sepia blend amount, from `0` (original color) to `1` (full sepia).
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/SepiaOptions#property-amount | SepiaOptions.amount API reference}
	 */
	amount?: number;
}

export const sepiaFilter = defineBuiltinFilter<SepiaOptions>({
	id: 'sepia',
	shader: sepiaSource,
	primary: 'amount',
	uniforms: {
		u_amount: ['amount', 1],
	},
});
