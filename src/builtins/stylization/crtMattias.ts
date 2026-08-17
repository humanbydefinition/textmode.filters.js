import { defineBuiltinFilter } from '../definition';
import crtMattiasSource from './crtMattias.frag';

/**
 * Configuration options for the `'crtMattias'` filter.
 *
 * CRT monitor emulation effect with screen curvature, animated scanlines,
 * blur, vignette, and film grain noise. Based on Mattias Gustavsson's
 * classic CRT shader.
 *
 * @example
 * {@includeCode ../../../examples/Stylization/crtMattias/sketch.js}
 *
 * @see {@link https://github.com/libretro/glsl-shaders/blob/master/crt/shaders/crt-mattias.glsl | Original shader by Mattias Gustavsson}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/CrtMattiasOptions | CrtMattiasOptions API reference}
 */
export interface CrtMattiasOptions {
	/**
	 * Amount of screen curvature/barrel distortion.
	 *
	 * - `0.0` = flat screen
	 * - `0.5` = moderate curvature (default)
	 * - `1.0` = maximum curvature
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/CrtMattiasOptions#curvature | CrtMattiasOptions.curvature API reference}
	 */
	curvature?: number;

	/**
	 * Speed of the scrolling scanline effect.
	 *
	 * Higher values make the scanline crawl faster.
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/CrtMattiasOptions#scanspeed | CrtMattiasOptions.scanSpeed API reference}
	 */
	scanSpeed?: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the effect.
	 * Typically use elapsed time in seconds or frame count.
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/CrtMattiasOptions#time | CrtMattiasOptions.time API reference}
	 */
	time?: number;
}

export const crtMattiasFilter = defineBuiltinFilter<CrtMattiasOptions>({
	id: 'crtMattias',
	shader: crtMattiasSource,
	primary: 'curvature',
	uniforms: {
		u_curvature: ['curvature', 0.5],
		u_scanSpeed: ['scanSpeed', 1],
		u_time: ['time', 0],
	},
});
