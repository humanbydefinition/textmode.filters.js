import { afterEach, describe, expect, it, vi } from 'vitest';

import { FiltersPlugin } from '../../src/index';
import { filterRuntime } from '../harness/filterRuntime';
import { framebuffer } from '../harness/framebuffer';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('rendering and scratch pools', () => {
	it('runs an N-filter layer chain in N passes with lazy per-layer scratch buffers', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;
		const input = framebuffer();

		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		filter.call(runtime.base, 'missing');
		filter.call(runtime.base, 'sepia', 0.5);
		const output = runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: input });

		expect(runtime.passes).toHaveLength(2);
		expect(runtime.buffers).toHaveLength(2);
		expect(runtime.passes[0]!.source).toBe(input);
		expect(runtime.passes[1]!.source).toBe(runtime.passes[0]!.target);
		expect(output).toBe(runtime.passes[1]!.target);
		expect(runtime.createShader).toHaveBeenCalledTimes(18);
		expect(runtime.operations).toEqual([
			'push',
			'begin',
			'shader',
			'setUniforms',
			'rect',
			'end',
			'pop',
			'push',
			'begin',
			'shader',
			'setUniforms',
			'rect',
			'end',
			'pop',
		]);
		expect(runtime.createFramebuffer).toHaveBeenCalledWith({
			width: 80,
			height: 40,
			attachments: 1,
			depth: false,
		});
	});

	it('reuses and resizes one scratch pair per layer', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;

		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer(80, 40) });
		runtime.layerTransform({ layer: runtime.base, phase: 'finalized', output: runtime.passes[0]!.target });
		runtime.postDraw();

		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer(120, 60) });

		expect(runtime.buffers).toHaveLength(2);
		for (const buffer of runtime.buffers) {
			expect(buffer.resize).toHaveBeenCalledWith(120, 60);
		}
	});

	it('keeps layer and composite scratch pools separate', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const layerFilter = runtime.extensions.get('layer:filter')!.value! as Function;
		const compositeFilter = runtime.extensions.get('textmodifier:filter')!.value! as Function;

		runtime.preDraw();
		layerFilter.call(runtime.base, 'invert');
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer(80, 40) });
		compositeFilter.call(runtime.textmodifier, 'invert');
		runtime.compositeTransform(framebuffer(80, 40));

		expect(runtime.buffers).toHaveLength(4);
	});

	it('does not allocate a composite pool when its queue is empty', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();

		runtime.preDraw();
		const output = runtime.compositeTransform(framebuffer());

		expect(runtime.buffers).toHaveLength(0);
		expect(output.width).toBe(80);
	});

	it('resolves the primary numeric shorthand into the leading uniform binding', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;

		await manager.register('custom', '#version 300 es\nvoid main() {}', {
			u_amount: ['amount', 1],
			u_offset: ['offset', 0],
		});

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'custom', 1.5);
		runtime.compositeTransform(framebuffer());

		expect(runtime.passes[0]!.uniforms).toEqual(expect.objectContaining({ u_amount: 1.5, u_offset: 0 }));
	});

	it('falls back to object parameters and then defaults for each binding', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;

		await manager.register('custom', '#version 300 es\nvoid main() {}', {
			u_amount: ['amount', 0.5],
			u_softness: ['softness', 0.5],
		});

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'custom', { amount: 0.9 });
		runtime.compositeTransform(framebuffer());

		expect(runtime.passes[0]!.uniforms).toEqual(expect.objectContaining({ u_amount: 0.9, u_softness: 0.5 }));
	});
});
