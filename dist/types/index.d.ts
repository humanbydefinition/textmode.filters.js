import type { TextmodePlugin } from 'textmode.js';
/**
 * Creates a textmode.js plugin that provides additional filter effects.
 *
 * Included filters:
 * - `brightness` - Adjust image brightness (amount: 1.0 = normal, >1 = brighter, <1 = darker)
 * - `contrast` - Adjust image contrast (amount: 1.0 = normal, >1 = more contrast, <1 = less)
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
 * });
 * ```
 *
 * @returns A textmode.js plugin instance.
 */
export declare const createFiltersPlugin: () => TextmodePlugin;
export type { TextmodeFilterStrategy } from 'textmode.js';
