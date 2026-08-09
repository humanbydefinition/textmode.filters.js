import { describe, expect, it } from 'vitest';
import type { Textmodifier } from 'textmode.js';
import '../src/augmentations';

declare const textmodifier: Textmodifier;

if (false) {
	textmodifier.filter('grayscale', 0.5);
	textmodifier.filter('grayscale', { amount: 0.5 });
	textmodifier.filter('threshold', { threshold: 0.4 });
	textmodifier.filter('myCustomFilter', { arbitrary: true });
	// @ts-expect-error known built-ins reject unrelated option properties
	textmodifier.filter('grayscale', { threshold: 0.5 });
	// @ts-expect-error parameterless invert rejects numeric shorthand
	textmodifier.filter('invert', 1);
}

describe('filter type augmentation fixture', () => {
	it('compiles known shorthand, option objects, and open custom names', () => {
		expect(true).toBe(true);
	});
});
