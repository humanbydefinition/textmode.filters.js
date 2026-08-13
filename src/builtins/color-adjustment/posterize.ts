import { defineBuiltinFilter } from '../definition';
import posterizeSource from './posterize.frag';

/**
 * Configuration options for the `'posterize'` filter.
 *
 * Reduces the color palette to a limited number of bands per channel,
 * creating a retro quantized/poster-like look.
 *
 * @example
 * {@includeCode ../../../examples/ColorAdjustment/posterize/sketch.js}
 *
 * @category Color adjustment filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/PosterizeOptions | PosterizeOptions API reference}
 */
export interface PosterizeOptions {
	/**
	 * Number of color levels per channel.
	 *
	 * Lower values create more dramatic banding effects.
	 * Higher values approach the original image quality.
	 *
	 * - `2` = extreme posterization (very few colors)
	 * - `4` = strong posterization (default)
	 * - `8+` = subtle posterization
	 *
	 * @default 4.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/PosterizeOptions#levels | PosterizeOptions.levels API reference}
	 */
	levels?: number;
}

export const posterizeFilter = defineBuiltinFilter<PosterizeOptions>({
	id: 'posterize',
	shader: posterizeSource,
	primary: 'levels',
	uniforms: {
		u_levels: ['levels', 4],
	},
});
