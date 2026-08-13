import { defineBuiltinFilter } from '../definition';
import filmGrainSource from './filmGrain.frag';

/**
 * Configuration options for the `'filmGrain'` filter.
 *
 * Adds an animated film grain/noise texture overlay to simulate vintage
 * film stock or analog video. The multi-layered noise creates an organic,
 * moving grain pattern that's less visible in darker areas, mimicking
 * real film characteristics.
 *
 * @example
 * {@includeCode ../../../examples/Stylization/filmGrain/sketch.js}
 *
 * @category Stylization filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions | FilmGrainOptions API reference}
 */
export interface FilmGrainOptions {
	/**
	 * Strength of the grain effect.
	 *
	 * - `0.0` = no grain
	 * - `0.2` = subtle grain (default)
	 * - `0.5+` = heavy, noticeable grain
	 *
	 * @default 0.2
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions#intensity | FilmGrainOptions.intensity API reference}
	 */
	intensity?: number;

	/**
	 * Size of grain particles.
	 *
	 * - `1.0` = fine grain
	 * - `2.0` = medium grain (default)
	 * - `5.0+` = coarse, chunky grain
	 *
	 * @default 2.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions#size | FilmGrainOptions.size API reference}
	 */
	size?: number;

	/**
	 * Animation speed of the grain.
	 *
	 * - `0.0` = static grain (not recommended)
	 * - `1.0` = normal animation speed (default)
	 * - `2.0+` = fast, flickering grain
	 *
	 * @default 1.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions#speed | FilmGrainOptions.speed API reference}
	 */
	speed?: number;

	/**
	 * Animation time parameter.
	 *
	 * Increment this value each frame to animate the grain effect.
	 *
	 * @default 0.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/FilmGrainOptions#time | FilmGrainOptions.time API reference}
	 */
	time?: number;
}

export const filmGrainFilter = defineBuiltinFilter<FilmGrainOptions>({
	id: 'filmGrain',
	shader: filmGrainSource,
	primary: 'intensity',
	uniforms: {
		u_intensity: ['intensity', 0.2],
		u_size: ['size', 2],
		u_speed: ['speed', 1],
		u_time: ['time', 0],
	},
});
