import type { TextmodePlugin } from 'textmode.js';
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
export declare const createFiltersPlugin: () => TextmodePlugin;
