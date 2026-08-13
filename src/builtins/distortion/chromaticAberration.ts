import { defineBuiltinFilter } from '../definition';
import chromaticAberrationSource from './chromaticAberration.frag';

/**
 * Configuration options for the `'chromaticAberration'` filter.
 *
 * RGB color channel separation effect that simulates lens distortion
 * found in cheap cameras or creates stylized glitch aesthetics.
 *
 * @example
 * {@includeCode ../../../examples/Distortion/chromaticAberration/sketch.js}
 *
 * @category Distortion filters
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ChromaticAberrationOptions | ChromaticAberrationOptions API reference}
 */
export interface ChromaticAberrationOptions {
	/**
	 * Offset amount in pixels.
	 *
	 * Controls how far the red and blue channels are separated from green.
	 *
	 * @default 5.0
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ChromaticAberrationOptions#amount | ChromaticAberrationOptions.amount API reference}
	 */
	amount?: number;

	/**
	 * Direction of the color separation as `[x, y]`.
	 *
	 * - `[1, 0]` = horizontal separation
	 * - `[0, 1]` = vertical separation
	 * - `[1, 1]` = diagonal separation
	 *
	 * The vector is normalized internally, so `[2, 0]` is the same as `[1, 0]`.
	 *
	 * @default [1.0, 0.0]
	 *
	 * @see {@link https://code.textmode.art/api/textmode.filters.js/interfaces/ChromaticAberrationOptions#direction | ChromaticAberrationOptions.direction API reference}
	 */
	direction?: [number, number];
}

export const chromaticAberrationFilter = defineBuiltinFilter<ChromaticAberrationOptions>({
	id: 'chromaticAberration',
	shader: chromaticAberrationSource,
	primary: 'amount',
	uniforms: {
		u_amount: ['amount', 5],
		u_direction: ['direction', [1, 0]],
	},
});
