import { afterEach, describe, expect, it, vi } from 'vitest';

const filterNames = [
	'brightness',
	'contrast',
	'hueRotate',
	'glitch',
	'chromaticAberration',
	'pixelate',
	'gridDistortion',
	'crtMattias',
	'scanlines',
	'vignette',
	'bloom',
	'filmGrain',
	'saturation',
	'posterize',
];

afterEach(() => {
	vi.resetModules();
	vi.unstubAllGlobals();
});

describe('FiltersPlugin', () => {
	it('registers and unregisters the complete built-in filter set', async () => {
		const register = vi.fn();
		const unregister = vi.fn();
		const { FiltersPlugin } = await import('../src/index');
		const textmodifier = { filters: { register, unregister } };
		if (!FiltersPlugin.install || !FiltersPlugin.uninstall) {
			throw new Error('FiltersPlugin must support installation and removal.');
		}

		await FiltersPlugin.install(textmodifier as never, {} as never);
		expect(register.mock.calls.map(([name]) => name)).toEqual(filterNames);

		const brightness = register.mock.calls.find(([name]) => name === 'brightness')?.[2];
		const gridDistortion = register.mock.calls.find(([name]) => name === 'gridDistortion')?.[2];
		expect(Object.values(brightness ?? {})).toContainEqual(['amount', 1.0]);
		expect(Object.values(gridDistortion ?? {})).toEqual(
			expect.arrayContaining([
				['gridCellDimensions', [80.0, 40.0]],
				['gridPixelDimensions', [640.0, 320.0]],
				['gridOffsetDimensions', [0.0, 0.0]],
				['widthFactors', Array(128).fill(0.5)],
				['heightFactors', Array(128).fill(0.5)],
				['widthVariationScale', 0.5],
				['heightVariationScale', 0.5],
			])
		);

		await FiltersPlugin.uninstall(textmodifier as never, {} as never);
		expect(unregister.mock.calls.map(([name]) => name)).toEqual(filterNames);
	});

	it('exports and exposes the plugin global', async () => {
		const browserWindow = {};
		vi.stubGlobal('window', browserWindow);

		const filtersModule = await import('../src/index');
		expect(Object.keys(filtersModule)).toEqual(['FiltersPlugin']);
		expect(browserWindow).toEqual({ FiltersPlugin: filtersModule.FiltersPlugin });
	});
});
