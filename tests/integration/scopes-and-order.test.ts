import { afterEach, describe, expect, it, vi } from 'vitest';

import { FiltersPlugin } from '../../src/index';
import { filterRuntime } from '../harness/filterRuntime';
import { framebuffer } from '../harness/framebuffer';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('queue scopes and ordering', () => {
	it('keeps global and finalDraw queues ordered and independent from layer pools', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;
		const finalDraw = runtime.extensions.get('textmodifier:finalDraw')!.value! as Function;
		const input = framebuffer(640, 360);

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'grayscale');
		finalDraw.call(runtime.textmodifier, () => filter.call(runtime.textmodifier, 'invert'));
		const output = runtime.compositeTransform(input);

		expect(runtime.passes).toHaveLength(2);
		expect(runtime.passes[0]!.source).toBe(input);
		expect(runtime.passes[1]!.source).toBe(runtime.passes[0]!.target);
		expect(output).toBe(runtime.passes[1]!.target);
	});

	it('routes draw and postDraw filters through the two layer phases', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;
		const input = framebuffer();

		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		const resolved = runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: input })!;
		filter.call(runtime.base, 'sepia', { amount: 0.4 });
		const finalized = runtime.layerTransform({ layer: runtime.base, phase: 'finalized', output: resolved })!;

		expect(runtime.passes.map((pass) => pass.source)).toEqual([input, resolved]);
		expect(finalized).toBe(runtime.passes[1]!.target);
	});

	it('preserves between-frame queues for the next frame and drops queues from an interrupted frame', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;

		filter.call(runtime.base, 'invert');
		runtime.preDraw();
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer() });
		expect(runtime.passes).toHaveLength(1);

		filter.call(runtime.base, 'sepia');
		runtime.preDraw();
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer() });
		expect(runtime.passes).toHaveLength(1);
	});

	it('drops unknown filters with a warning and renders no passes for an entirely unknown queue', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'missing');
		const output = runtime.compositeTransform(framebuffer());

		expect(warn).toHaveBeenCalledWith('[textmode.filters.js] Unknown filter: "missing". Skipping.');
		expect(runtime.passes).toHaveLength(0);
		expect(runtime.buffers).toHaveLength(0);
		expect(output.width).toBe(80);
	});

	it('mixes known and unknown layer filters while preserving order', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;
		const input = framebuffer();
		vi.spyOn(console, 'warn').mockImplementation(() => {});

		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		filter.call(runtime.base, 'missing');
		filter.call(runtime.base, 'sepia', 0.5);
		const output = runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: input })!;

		expect(runtime.passes).toHaveLength(2);
		expect(runtime.passes[0]!.source).toBe(input);
		expect(runtime.passes[1]!.source).toBe(runtime.passes[0]!.target);
		expect(output).toBe(runtime.passes[1]!.target);
	});

	it('throws when queueing after disposal', async () => {
		const runtime = filterRuntime();
		const cleanup = FiltersPlugin.install(runtime.textmodifier as never, runtime.context) as unknown as () => void;
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;
		cleanup();

		expect(() => filter.call(runtime.textmodifier, 'invert')).toThrow('disposed');
	});
});
