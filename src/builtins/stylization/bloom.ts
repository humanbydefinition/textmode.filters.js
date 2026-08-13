import { defineBuiltinFilter } from '../definition';
import bloomSource from './bloom.frag';

/**
 * Configuration options for the `'bloom'` filter.
 *
 * Creates a glow effect around bright areas of the image. Pixels above
 * the brightness threshold emit a soft glow that spreads outward.
 * Perfect for creating neon, glowing text, or dreamy effects.
 *
 * @example
 * {@includeCode ../../../examples/Stylization/bloom/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BloomOptions | BloomOptions API reference}
 */
export interface BloomOptions {
	/**
	 * Brightness level above which pixels will glow.
	 *
	 * - `0.0` = everything glows
	 * - `0.5` = mid-brightness and above glows (default)
	 * - `1.0` = only the brightest pixels glow
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BloomOptions#threshold | BloomOptions.threshold API reference}
	 */
	threshold?: number;

	/**
	 * Strength of the glow effect.
	 *
	 * - `0.0` = no visible glow
	 * - `1.0` = normal glow intensity (default)
	 * - `2.0+` = very bright, intense glow
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BloomOptions#intensity | BloomOptions.intensity API reference}
	 */
	intensity?: number;

	/**
	 * Size of the glow spread in pixels.
	 *
	 * Larger values create a wider, softer glow.
	 *
	 * - `1.0` = tight glow
	 * - `4.0` = moderate spread (default)
	 * - `10.0+` = wide, diffuse glow
	 *
	 * @default 4.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/BloomOptions#radius | BloomOptions.radius API reference}
	 */
	radius?: number;
}

export const bloomFilter = defineBuiltinFilter<BloomOptions>({
	id: 'bloom',
	shader: bloomSource,
	primary: 'threshold',
	uniforms: {
		u_threshold: ['threshold', 0.5],
		u_intensity: ['intensity', 1],
		u_radius: ['radius', 4],
	},
});
