import { afterEach, describe, expect, it, vi } from 'vitest';

import { BUILTIN_CATALOG } from '../../src/builtins/catalog';
import { FiltersPlugin, TextmodeFilterManager } from '../../src/index';
import { filterRuntime } from '../harness/filterRuntime';
import { framebuffer } from '../harness/framebuffer';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('plugin lifecycle', () => {
	it('installs all built-in descriptors synchronously and compiles them during preSetup', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);

		expect(manager).toBeInstanceOf(TextmodeFilterManager);
		expect(Object.values(BUILTIN_CATALOG).every((descriptor) => manager.has(descriptor.id))).toBe(true);
		expect(runtime.createShader).not.toHaveBeenCalled();
		expect(runtime.buffers).toHaveLength(0);

		await runtime.preSetup();

		expect(runtime.createShader).toHaveBeenCalledTimes(Object.values(BUILTIN_CATALOG).length);
		expect(new Set(runtime.createShader.mock.calls.map(([vertex]) => vertex)).size).toBe(1);
	});

	it('keeps simultaneous plugin instances independent', async () => {
		const first = filterRuntime();
		const second = filterRuntime();
		FiltersPlugin.install(first.textmodifier as never, first.context);
		FiltersPlugin.install(second.textmodifier as never, second.context);
		await first.preSetup();
		await second.preSetup();
		const firstFilter = first.extensions.get('textmodifier:filter')!.value! as Function;

		first.preDraw();
		second.preDraw();
		firstFilter.call(first.textmodifier, 'invert');
		first.compositeTransform(framebuffer());
		second.compositeTransform(framebuffer());

		expect(first.passes).toHaveLength(1);
		expect(second.passes).toHaveLength(0);
		expect(first.buffers).toHaveLength(2);
		expect(second.buffers).toHaveLength(0);
	});

	it('reinstalling disposes the previous manager for the same textmodifier', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);

		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		const replaced = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);

		expect(replaced).not.toBe(manager);
		expect(() => manager.register('late', 'source')).rejects.toThrow('disposed');
	});

	it('releases all owned shaders, pools, and queues on uninstall and stays idempotent', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;

		runtime.preDraw();
		filter.call(runtime.base, 'invert');
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer() });

		runtime.layerDisposed(runtime.base);
		expect(runtime.buffers.every((buffer) => vi.mocked(buffer.dispose).mock.calls.length === 1)).toBe(true);

		await FiltersPlugin.uninstall!(runtime.textmodifier as never, runtime.context);
		await FiltersPlugin.uninstall!(runtime.textmodifier as never, runtime.context);
		expect(runtime.shaders.every((shader) => shader.dispose.mock.calls.length === 1)).toBe(true);
		expect(runtime.buffers.every((buffer) => vi.mocked(buffer.dispose).mock.calls.length === 1)).toBe(true);
	});

	it('exposes the plugin global on window when present', async () => {
		const browserWindow = {};
		vi.stubGlobal('window', browserWindow);
		vi.resetModules();
		const filtersModule = await import('../../src/index');
		expect(filtersModule.FiltersPlugin).toBeDefined();
		expect(filtersModule.TextmodeFilterManager).toBeDefined();
		expect(browserWindow).toEqual({ FiltersPlugin: filtersModule.FiltersPlugin });
	});
});
