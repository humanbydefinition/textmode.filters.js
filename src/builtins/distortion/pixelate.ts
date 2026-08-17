import { defineBuiltinFilter } from '../definition';
import pixelateSource from './pixelate.frag';

/**
 * Configuration options for the `'pixelate'` filter.
 *
 * Reduces image resolution to create a mosaic/pixelated effect
 * reminiscent of retro video games or censored content.
 *
 * @example
 * {@includeCode ../../../examples/Distortion/pixelate/sketch.js}
 *
 * @category Distortion filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/PixelateOptions | PixelateOptions API reference}
 */
export interface PixelateOptions {
	/**
	 * Size of each pixel block in pixels.
	 *
	 * Larger values create bigger, more visible pixels.
	 *
	 * Minimum value: `1.0`
	 *
	 * @default 4.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/PixelateOptions#pixelsize | PixelateOptions.pixelSize API reference}
	 */
	pixelSize?: number;
}

export const pixelateFilter = defineBuiltinFilter<PixelateOptions>({
	id: 'pixelate',
	shader: pixelateSource,
	primary: 'pixelSize',
	uniforms: {
		u_pixelSize: ['pixelSize', 4],
	},
});
