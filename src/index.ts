import type { TextmodePlugin } from 'textmode.js';

import brightnessFragmentShader from './shaders/brightness.frag?raw';
import contrastFragmentShader from './shaders/contrast.frag?raw';
import hueRotateFragmentShader from './shaders/hueRotate.frag?raw';
import glitchFragmentShader from './shaders/glitch.frag?raw';
import chromaticAberrationFragmentShader from './shaders/chromaticAberration.frag?raw';
import pixelateFragmentShader from './shaders/pixelate.frag?raw';
import scanlinesFragmentShader from './shaders/scanlines.frag?raw';

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
 * - `scanlines` - CRT scanline effect (count: number of lines, opacity: line darkness, vertical: 0 or 1 for orientation)
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
 * t.draw(() => {
 *     t.layers.base.filter('brightness', 1.2);
 *     t.layers.base.filter('contrast', { amount: 1.5 });
 * 
 *     t.background(0);
 *     // ... draw something ...
 * });
 * ```
 * 
 * @returns A textmode.js plugin instance.
 */
export const createFiltersPlugin = (): TextmodePlugin => ({
    name: 'textmode.filters',
    version: '1.0.0',

    async install(textmodifier) {
        textmodifier.filters.register('brightness', brightnessFragmentShader, { u_amount: ['amount', 1.0]})
        textmodifier.filters.register('contrast', contrastFragmentShader, { u_amount: ['amount', 1.0]});
        textmodifier.filters.register('hueRotate', hueRotateFragmentShader, { u_angle: ['angle', 0.0]});
        textmodifier.filters.register('glitch', glitchFragmentShader, { u_amount: ['amount', 0.0]});
        textmodifier.filters.register('chromaticAberration', chromaticAberrationFragmentShader, { u_amount: ['amount', 5.0], u_direction: ['direction', [1.0, 0.0]]});
        textmodifier.filters.register('pixelate', pixelateFragmentShader, { u_pixelSize: ['pixelSize', 4.0]});
        textmodifier.filters.register('scanlines', scanlinesFragmentShader, { u_count: ['count', 50.0], u_opacity: ['opacity', 0.5], u_vertical: ['vertical', 0.0] });
    },

    async uninstall(textmodifier) {
        textmodifier.filters.unregister('brightness');
        textmodifier.filters.unregister('contrast');
        textmodifier.filters.unregister('hueRotate');
        textmodifier.filters.unregister('glitch');
        textmodifier.filters.unregister('chromaticAberration');
        textmodifier.filters.unregister('pixelate');
        textmodifier.filters.unregister('scanlines');
    },
});

// UMD global export
if (typeof window !== 'undefined') {
    (window as any).createFiltersPlugin = createFiltersPlugin;
}