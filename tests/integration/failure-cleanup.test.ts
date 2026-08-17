import { afterEach, describe, expect, it, vi } from 'vitest';

import { FiltersPlugin } from '../../src/index';
import { filterRuntime } from '../harness/filterRuntime';
import { framebuffer } from '../harness/framebuffer';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('failure and cleanup', () => {
	it('disposes partially compiled built-ins when preSetup fails', async () => {
		const runtime = filterRuntime();
		const shader = { dispose: vi.fn() };
		runtime.shaders.push(shader);
		runtime.createShader.mockResolvedValueOnce(shader).mockRejectedValueOnce(new Error('compile failed'));
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);

		await expect(runtime.preSetup()).rejects.toThrow('compile failed');
		expect(shader.dispose).toHaveBeenCalledOnce();
	});

	it('disposes a shader that finishes compiling after uninstall', async () => {
		const runtime = filterRuntime();
		const shader = { dispose: vi.fn() };
		let finishCompilation!: (value: typeof shader) => void;
		runtime.createShader.mockImplementationOnce(
			() => new Promise<typeof shader>((resolve) => (finishCompilation = resolve))
		);
		const cleanup = FiltersPlugin.install(runtime.textmodifier as never, runtime.context) as unknown as () => void;
		const setup = runtime.preSetup();

		cleanup();
		finishCompilation(shader);

		await expect(setup).rejects.toThrow('disposed');
		expect(shader.dispose).toHaveBeenCalledOnce();
	});

	it('ends the target and restores drawing state when a pass throws', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;
		vi.mocked(runtime.textmodifier.rect).mockImplementationOnce(() => {
			runtime.operations.push('rect');
			throw new Error('draw failed');
		});

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'invert');

		expect(() => runtime.compositeTransform(framebuffer())).toThrow('draw failed');
		expect(runtime.operations.slice(-2)).toEqual(['end', 'pop']);
		expect(runtime.buffers[0]!.end).toHaveBeenCalledOnce();
	});

	it('keeps the next composite pass independent when a draw throws mid-frame', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'invert');
		vi.mocked(runtime.textmodifier.rect).mockImplementationOnce(() => {
			throw new Error('draw failed');
		});
		expect(() => runtime.compositeTransform(framebuffer())).toThrow('draw failed');
		runtime.postDraw();

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'invert');
		runtime.compositeTransform(framebuffer());
		expect(runtime.passes).toHaveLength(1);
	});

	it('resets the layer phase even when the finalized transform throws', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;

		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer() });

		vi.mocked(runtime.textmodifier.rect).mockImplementationOnce(() => {
			throw new Error('draw failed');
		});
		filter.call(runtime.base, 'sepia');
		expect(() =>
			runtime.layerTransform({ layer: runtime.base, phase: 'finalized', output: framebuffer() })
		).toThrow('draw failed');

		runtime.postDraw();
		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		const output = runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer() });
		expect(output.width).toBe(80);
	});

	it('releases a layer pool on removal without touching other layers', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;
		const other = {};

		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer() });
		filter.call(other, 'invert');
		runtime.layerTransform({ layer: other, phase: 'resolved', output: framebuffer() });

		runtime.layerDisposed(runtime.base);
		expect(runtime.buffers[0]!.dispose).toHaveBeenCalledOnce();
		expect(runtime.buffers[1]!.dispose).toHaveBeenCalledOnce();
		expect(runtime.buffers[2]!.dispose).not.toHaveBeenCalled();
		expect(runtime.buffers[3]!.dispose).not.toHaveBeenCalled();
	});
});
