import { defineBuiltinFilter } from '../definition';
import hueRotateSource from './hueRotate.frag';

/**
 * Configuration options for the `'hueRotate'` filter.
 *
 * Shifts all colors around the color wheel by a specified angle.
 * Useful for color grading or creating surreal color effects.
 *
 * @example
 * {@includeCode ../../../examples/ColorAdjustment/hueRotate/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/HueRotateOptions | HueRotateOptions API reference}
 */
export interface HueRotateOptions {
	/**
	 * Rotation angle in degrees.
	 *
	 * - `0` = no change
	 * - `180` = complementary colors
	 * - `360` = full rotation (same as 0)
	 *
	 * Values wrap around, so `370` is equivalent to `10`.
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/HueRotateOptions#angle | HueRotateOptions.angle API reference}
	 */
	angle?: number;
}

export const hueRotateFilter = defineBuiltinFilter<HueRotateOptions>({
	id: 'hueRotate',
	shader: hueRotateSource,
	primary: 'angle',
	uniforms: {
		u_angle: ['angle', 0],
	},
});
