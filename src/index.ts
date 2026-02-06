/**
 * @packageDocumentation
 * 
 * GPU-accelerated image filters plugin for textmode.js.
 * 
 * This plugin provides customizable visual effects that run entirely on the GPU
 * via WebGL2 fragment shaders for maximum performance.
 * 
 * ## Available filters
 * 
 * ### Color adjustment
 * - {@link BrightnessOptions | brightness} - Adjust image brightness
 * - {@link ContrastOptions | contrast} - Adjust image contrast  
 * - {@link SaturationOptions | saturation} - Adjust color intensity
 * - {@link HueRotateOptions | hueRotate} - Rotate colors around the color wheel
 * - {@link PosterizeOptions | posterize} - Reduce color levels
 * 
 * ### Distortion
 * - {@link ChromaticAberrationOptions | chromaticAberration} - RGB channel separation
 * - {@link PixelateOptions | pixelate} - Pixelation/mosaic effect
 * - {@link GridDistortionOptions | gridDistortion} - Custom grid warping
 * 
 * ### Stylization  
 * - {@link GlitchOptions | glitch} - Digital glitch effect
 * - {@link CrtMattiasOptions | crtMattias} - CRT monitor emulation
 * - {@link ScanlinesOptions | scanlines} - Customizable scanlines
 * - {@link VignetteOptions | vignette} - Darkened edges effect
 * - {@link BloomOptions | bloom} - Glow around bright areas
 * - {@link FilmGrainOptions | filmGrain} - Animated film grain overlay
 * 
 * @module textmode.filters.js
 */

import type { TextmodePlugin } from 'textmode.js/plugins';

// Re-export all filter option types for consumers
export type {
	BrightnessOptions,
	ContrastOptions,
	SaturationOptions,
	HueRotateOptions,
	PosterizeOptions,
	ChromaticAberrationOptions,
	PixelateOptions,
	GridDistortionOptions,
	GlitchOptions,
	CrtMattiasOptions,
	ScanlinesOptions,
	VignetteOptions,
	BloomOptions,
	FilmGrainOptions,
} from './types';

import brightnessFragmentShader from './shaders/brightness.frag';
import contrastFragmentShader from './shaders/contrast.frag';
import hueRotateFragmentShader from './shaders/hueRotate.frag';
import glitchFragmentShader from './shaders/glitch.frag';
import chromaticAberrationFragmentShader from './shaders/chromaticAberration.frag';
import pixelateFragmentShader from './shaders/pixelate.frag';
import gridDistortionFragmentShader from './shaders/gridDistortion.frag';
import crtMattiasFragmentShader from './shaders/crtMattias.frag';
import scanlinesFragmentShader from './shaders/scanlines.frag';
import vignetteFragmentShader from './shaders/vignette.frag';
import bloomFragmentShader from './shaders/bloom.frag';
import filmGrainFragmentShader from './shaders/filmGrain.frag';
import saturationFragmentShader from './shaders/saturation.frag';
import posterizeFragmentShader from './shaders/posterize.frag';

// Default factors array for grid distortion (128 elements)
const defaultFactors = new Array(128).fill(0.5);

/**
 * GPU-accelerated image filters plugin for textmode.js.
 *
 * Add this plugin to your textmode.js instance to enable additional customizable
 * visual effects that run entirely on the GPU via WebGL2 fragment shaders.
 *
 * @example
 * ```javascript
 * import { textmode } from 'textmode.js';
 * import { FiltersPlugin } from 'textmode.filters.js';
 *
 * const t = textmode.create({
 *     plugins: [FiltersPlugin]
 * });
 *
 * let frame = 0;
 * t.draw(() => {
 *     // Simple filter with shorthand value
 *     t.layers.base.filter('brightness', 1.2);
 *
 *     // Filter with options object
 *     t.layers.base.filter('bloom', {
 *         threshold: 0.5,
 *         intensity: 1.5,
 *         radius: 8
 *     });
 *
 *     // Animated filter
 *     t.layers.base.filter('filmGrain', {
 *         intensity: 0.2,
 *         time: frame * 0.016
 *     });
 *
 *     t.background(0);
 *     frame++;
 * });
 * ```
 */
export const FiltersPlugin: TextmodePlugin = {
	name: 'textmode.filters',
	version: '1.1.1',

	async install(textmodifier) {
		textmodifier.filters.register('brightness', brightnessFragmentShader, { u_amount: ['amount', 1.0] });
		textmodifier.filters.register('contrast', contrastFragmentShader, { u_amount: ['amount', 1.0] });
		textmodifier.filters.register('hueRotate', hueRotateFragmentShader, { u_angle: ['angle', 0.0] });
		textmodifier.filters.register('glitch', glitchFragmentShader, { u_amount: ['amount', 0.0] });
		textmodifier.filters.register('chromaticAberration', chromaticAberrationFragmentShader, {
			u_amount: ['amount', 5.0],
			u_direction: ['direction', [1.0, 0.0]],
		});
		textmodifier.filters.register('pixelate', pixelateFragmentShader, { u_pixelSize: ['pixelSize', 4.0] });

		textmodifier.filters.register('gridDistortion', gridDistortionFragmentShader, {
			u_gridCellDimensions: ['gridCellDimensions', [80.0, 40.0]],
			u_gridPixelDimensions: ['gridPixelDimensions', [640.0, 320.0]],
			u_gridOffsetDimensions: ['gridOffsetDimensions', [0.0, 0.0]],
			u_widthFactors: ['widthFactors', defaultFactors],
			u_heightFactors: ['heightFactors', defaultFactors],
			u_widthVariationScale: ['widthVariationScale', 0.5],
			u_heightVariationScale: ['heightVariationScale', 0.5],
		});

		textmodifier.filters.register('crtMattias', crtMattiasFragmentShader, {
			u_curvature: ['curvature', 0.5],
			u_scanSpeed: ['scanSpeed', 1.0],
			u_time: ['time', 0.0],
		});

		textmodifier.filters.register('scanlines', scanlinesFragmentShader, {
			u_count: ['count', 300.0],
			u_lineWidth: ['lineWidth', 0.5],
			u_intensity: ['intensity', 0.75],
			u_speed: ['speed', 1.0],
			u_time: ['time', 0.0],
		});

		textmodifier.filters.register('vignette', vignetteFragmentShader, {
			u_amount: ['amount', 0.5],
			u_softness: ['softness', 0.5],
			u_roundness: ['roundness', 0.5],
		});

		textmodifier.filters.register('bloom', bloomFragmentShader, {
			u_threshold: ['threshold', 0.5],
			u_intensity: ['intensity', 1.0],
			u_radius: ['radius', 4.0],
		});

		textmodifier.filters.register('filmGrain', filmGrainFragmentShader, {
			u_intensity: ['intensity', 0.2],
			u_size: ['size', 2.0],
			u_speed: ['speed', 1.0],
			u_time: ['time', 0.0],
		});

		textmodifier.filters.register('saturation', saturationFragmentShader, {
			u_amount: ['amount', 1.0],
		});

		textmodifier.filters.register('posterize', posterizeFragmentShader, {
			u_levels: ['levels', 4.0],
		});
	},

	async uninstall(textmodifier) {
		textmodifier.filters.unregister('brightness');
		textmodifier.filters.unregister('contrast');
		textmodifier.filters.unregister('hueRotate');
		textmodifier.filters.unregister('glitch');
		textmodifier.filters.unregister('chromaticAberration');
		textmodifier.filters.unregister('pixelate');
		textmodifier.filters.unregister('gridDistortion');
		textmodifier.filters.unregister('crtMattias');
		textmodifier.filters.unregister('scanlines');
		textmodifier.filters.unregister('vignette');
		textmodifier.filters.unregister('bloom');
		textmodifier.filters.unregister('filmGrain');
		textmodifier.filters.unregister('saturation');
		textmodifier.filters.unregister('posterize');
	},
};

/**
 * Creates the `textmode.filters.js` plugin for textmode.js.
 *
 * @deprecated Use {@link FiltersPlugin} directly instead.
 * This function is provided for backwards compatibility only.
 *
 * @example
 * ```javascript
 * // Old way (deprecated)
 * import { createFiltersPlugin } from 'textmode.filters.js';
 * const t = textmode.create({ plugins: [createFiltersPlugin()] });
 *
 * // New way (recommended)
 * import { FiltersPlugin } from 'textmode.filters.js';
 * const t = textmode.create({ plugins: [FiltersPlugin] });
 * ```
 *
 * @returns A textmode.js plugin instance.
 */
export const createFiltersPlugin = (): TextmodePlugin => FiltersPlugin;

// UMD global export
if (typeof window !== 'undefined') {
	(window as any).FiltersPlugin = FiltersPlugin;
	// Keep backwards compatibility
	(window as any).createFiltersPlugin = createFiltersPlugin;
}
