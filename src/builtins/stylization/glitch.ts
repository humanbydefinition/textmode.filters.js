import { defineBuiltinFilter } from '../definition';
import glitchSource from './glitch.frag';

/**
 * Configuration options for the `'glitch'` filter.
 *
 * Digital glitch effect with RGB channel separation, scanlines, and noise.
 * Creates a corrupted/broken digital signal aesthetic.
 *
 * @example
 * {@includeCode ../../../examples/Stylization/glitch/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GlitchOptions | GlitchOptions API reference}
 */
export interface GlitchOptions {
	/**
	 * Glitch intensity.
	 *
	 * - `0.0` = no glitch effect
	 * - `0.5` = subtle glitching
	 * - `1.0+` = intense, chaotic glitching
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/GlitchOptions#amount | GlitchOptions.amount API reference}
	 */
	amount?: number;
}

export const glitchFilter = defineBuiltinFilter<GlitchOptions>({
	id: 'glitch',
	shader: glitchSource,
	primary: 'amount',
	uniforms: {
		u_amount: ['amount', 0],
	},
});
