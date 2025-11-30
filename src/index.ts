import type { TextmodePlugin } from 'textmode.js';

import brightnessFragmentShader from './shaders/brightness.frag?raw';
import contrastFragmentShader from './shaders/contrast.frag?raw';
import hueRotateFragmentShader from './shaders/hueRotate.frag?raw';
import glitchFragmentShader from './shaders/glitch.frag?raw';

/**
 * Creates the `textmode.filters.js` plugin for textmode.js.
 * 
 * Included filters:
 * - `brightness` - Adjust image brightness (amount: 1.0 = normal, >1 = brighter, <1 = darker)
 * - `contrast` - Adjust image contrast (amount: 1.0 = normal, >1 = more contrast, <1 = less)
 * - `hueRotate` - Rotate colors around the hue wheel (angle: 0-360 degrees)
 * - `glitch` - Digital glitch effect (amount: 0.0 = none, higher values = more intense)
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
        textmodifier.layers.filters.register('brightness', brightnessFragmentShader, { u_amount: ['amount', 1.0]})
        textmodifier.layers.filters.register('contrast', contrastFragmentShader, { u_amount: ['amount', 1.0]});
        textmodifier.layers.filters.register('hueRotate', hueRotateFragmentShader, { u_angle: ['angle', 0.0]});
        textmodifier.layers.filters.register('glitch', glitchFragmentShader, { u_amount: ['amount', 0.0]});
    },

    async uninstall(textmodifier) {
        textmodifier.layers.filters.unregister('brightness');
        textmodifier.layers.filters.unregister('contrast');
        textmodifier.layers.filters.unregister('hueRotate');
        textmodifier.layers.filters.unregister('glitch');
    },
});

// UMD global export
if (typeof window !== 'undefined') {
    (window as any).createFiltersPlugin = createFiltersPlugin;
}

export type { TextmodeFilterStrategy } from 'textmode.js';