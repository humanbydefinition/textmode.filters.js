import type { TextmodePlugin } from 'textmode.js/plugins';

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

/**
 * Creates the `textmode.filters.js` plugin for textmode.js.
 *
 * Included filters:
 * - `brightness` - Adjust image brightness (amount: 1.0 = normal, >1 = brighter, <1 = darker)
 * - `contrast` - Adjust image contrast (amount: 1.0 = normal, >1 = more contrast, <1 = less)
 * - `hueRotate` - Rotate colors around the hue wheel (angle: 0-360 degrees)
 * - `glitch` - Digital glitch effect (amount: 0.0 = none, higher values = more intense)
 * - `chromaticAberration` - RGB channel separation effect (amount: offset in pixels, direction: vec2 for offset direction)
 * - `pixelate` - Pixelation effect (pixelSize: size of pixels in pixels)
 * - `gridDistortion` - Distort a monospaced grid with custom patterns (widthFactors/heightFactors: arrays of values 0-1)
 * - `crtMattias` - CRT monitor emulation with curvature, scanlines, blur, and noise (by Mattias)
 * - `scanlines` - Customizable scanlines effect (count, lineWidth, intensity, speed)
 * - `vignette` - Darkened edges/corners effect (amount, softness, roundness)
 * - `bloom` - Glow effect around bright areas (threshold, intensity, radius)
 * - `filmGrain` - Animated film grain/noise overlay (intensity, size, speed)
 * - `saturation` - Adjust color intensity (amount: 0 = grayscale, 1 = normal, >1 = vivid)
 * - `posterize` - Reduce color levels (levels: number of color bands, default 4.0)
 *
 * @example
 * ```javascript
 * import { textmode } from 'textmode.js';
 * import { createFiltersPlugin } from 'textmode.filters.js';
 *
 * const t = textmode.create({
 *     plugins: [createFiltersPlugin()]
 * });
 *
 * let frame = 0;
 * t.draw(() => {
 *     t.layers.base.filter('brightness', 1.2);
 *
 *     // Grid distortion with custom sine wave pattern
 *     const widthFactors = [];
 *     const heightFactors = [];
 *     for (let i = 0; i < 80; i++) {
 *         widthFactors.push((Math.sin(i * 0.1 + frame * 0.05) + 1) / 2);
 *     }
 *     for (let j = 0; j < 40; j++) {
 *         heightFactors.push((Math.sin(j * 0.15 + frame * 0.03) + 1) / 2);
 *     }
 *     t.layers.base.filter('gridDistortion', {
 *       gridCellDimensions: [80, 40],
 *       gridPixelDimensions: [t.grid.cols * t.grid.cellWidth, t.grid.rows * t.grid.cellHeight],
 *       gridOffsetDimensions: [t.grid.offsetX, t.grid.offsetY],
 *       widthFactors,
 *       heightFactors,
 *       widthVariationScale: 0.5,
 *       heightVariationScale: 0.5
 *     });
 *
 *     t.background(0);
 *     frame++;
 * });
 * ```
 *
 * @returns A textmode.js plugin instance.
 */
export const createFiltersPlugin = (): TextmodePlugin => ({
	name: 'textmode.filters',
	version: '1.0.0',

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

		// Grid distortion with default empty arrays (128 elements)
		const defaultFactors = new Array(128).fill(0.5);
		textmodifier.filters.register('gridDistortion', gridDistortionFragmentShader, {
			u_gridCellDimensions: ['gridCellDimensions', [80.0, 40.0]],
			u_gridPixelDimensions: ['gridPixelDimensions', [640.0, 320.0]],
			u_gridOffsetDimensions: ['gridOffsetDimensions', [0.0, 0.0]],
			u_widthFactors: ['widthFactors', defaultFactors],
			u_heightFactors: ['heightFactors', defaultFactors],
			u_widthVariationScale: ['widthVariationScale', 0.5],
			u_heightVariationScale: ['heightVariationScale', 0.5],
		});

		// CRT Mattias filter
		textmodifier.filters.register('crtMattias', crtMattiasFragmentShader, {
			u_curvature: ['curvature', 0.5],
			u_scanSpeed: ['scanSpeed', 1.0],
			u_time: ['time', 0.0],
		});

		// Scanlines filter
		textmodifier.filters.register('scanlines', scanlinesFragmentShader, {
			u_count: ['count', 300.0],
			u_lineWidth: ['lineWidth', 0.5],
			u_intensity: ['intensity', 0.75],
			u_speed: ['speed', 1.0],
			u_time: ['time', 0.0],
		});

		// Vignette filter
		textmodifier.filters.register('vignette', vignetteFragmentShader, {
			u_amount: ['amount', 0.5],
			u_softness: ['softness', 0.5],
			u_roundness: ['roundness', 0.5],
		});

		// Bloom filter
		textmodifier.filters.register('bloom', bloomFragmentShader, {
			u_threshold: ['threshold', 0.5],
			u_intensity: ['intensity', 1.0],
			u_radius: ['radius', 4.0],
		});

		// Film grain filter
		textmodifier.filters.register('filmGrain', filmGrainFragmentShader, {
			u_intensity: ['intensity', 0.2],
			u_size: ['size', 2.0],
			u_speed: ['speed', 1.0],
			u_time: ['time', 0.0],
		});

		// Saturation filter
		textmodifier.filters.register('saturation', saturationFragmentShader, {
			u_amount: ['amount', 1.0],
		});

		// Posterize filter
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
});

// UMD global export
if (typeof window !== 'undefined') {
	(window as any).createFiltersPlugin = createFiltersPlugin;
}
