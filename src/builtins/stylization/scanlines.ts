import { defineBuiltinFilter } from '../definition';
import scanlinesSource from './scanlines.frag';

/**
 * Configuration options for the `'scanlines'` filter.
 *
 * A standalone scanline effect that adds horizontal lines to the image
 * to simulate a CRT display or old monitor. More customizable than
 * the scanlines in crtMattias.
 *
 * @example
 * {@includeCode ../../../examples/Stylization/scanlines/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions | ScanlinesOptions API reference}
 */
export interface ScanlinesOptions {
	/**
	 * Number of scanlines across the image height.
	 *
	 * Higher values create finer, more dense lines.
	 *
	 * Minimum value: `10.0`
	 *
	 * @default 300.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#count | ScanlinesOptions.count API reference}
	 */
	count?: number;

	/**
	 * Width of the lines relative to the spacing.
	 *
	 * - `0.0` = very thin lines (mostly transparent)
	 * - `0.5` = equal line and gap width
	 * - `1.0` = solid (no gaps)
	 *
	 * @default 0.5
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#linewidth | ScanlinesOptions.lineWidth API reference}
	 */
	lineWidth?: number;

	/**
	 * Opacity/darkness of the scanlines.
	 *
	 * - `0.0` = invisible lines
	 * - `0.75` = clearly visible (default)
	 * - `1.0` = maximum darkness (solid black lines)
	 *
	 * @default 0.75
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#intensity | ScanlinesOptions.intensity API reference}
	 */
	intensity?: number;

	/**
	 * Scrolling speed of the lines.
	 *
	 * - `0.0` = static lines
	 * - `1.0` = normal scrolling speed
	 * - Higher values = faster scrolling
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#speed | ScanlinesOptions.speed API reference}
	 */
	speed?: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the scrolling effect.
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ScanlinesOptions#time | ScanlinesOptions.time API reference}
	 */
	time?: number;
}

export const scanlinesFilter = defineBuiltinFilter<ScanlinesOptions>({
	id: 'scanlines',
	shader: scanlinesSource,
	primary: 'count',
	uniforms: {
		u_count: ['count', 300],
		u_intensity: ['intensity', 0.75],
		u_speed: ['speed', 1],
		u_time: ['time', 0],
	},
});
