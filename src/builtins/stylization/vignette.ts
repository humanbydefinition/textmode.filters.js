import { defineBuiltinFilter } from '../definition';
import vignetteSource from './vignette.frag';

/**
 * Configuration options for the `'vignette'` filter.
 *
 * Darkens the edges and corners of the image, drawing focus to the center.
 * Useful for creating a cinematic look or highlighting central content.
 *
 * @example
 * {@includeCode ../../../examples/Stylization/vignette/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/VignetteOptions | VignetteOptions API reference}
 */
export interface VignetteOptions {
	/**
	 * Intensity of the darkening effect.
	 *
	 * - `0.0` = no vignette
	 * - `0.5` = moderate vignette (default)
	 * - `1.0` = very dark edges
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/VignetteOptions#amount | VignetteOptions.amount API reference}
	 */
	amount?: number;

	/**
	 * Falloff gradient softness.
	 *
	 * - `0.0` = hard edge (sharp transition)
	 * - `0.5` = moderate gradient (default)
	 * - `1.0` = very soft, gradual falloff
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/VignetteOptions#softness | VignetteOptions.softness API reference}
	 */
	softness?: number;

	/**
	 * Shape of the vignette.
	 *
	 * - `0.0` = rectangular (follows screen edges)
	 * - `0.5` = rounded rectangle (default)
	 * - `1.0` = circular/elliptical
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/VignetteOptions#roundness | VignetteOptions.roundness API reference}
	 */
	roundness?: number;
}

export const vignetteFilter = defineBuiltinFilter<VignetteOptions>({
	id: 'vignette',
	shader: vignetteSource,
	primary: 'amount',
	uniforms: {
		u_amount: ['amount', 0.5],
		u_softness: ['softness', 0.5],
		u_roundness: ['roundness', 0.5],
	},
});
