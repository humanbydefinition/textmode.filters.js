import { afterEach, describe, expect, it, vi } from 'vitest';

import { FiltersPlugin } from '../../src/index';
import { filterRuntime } from '../harness/filterRuntime';
import { framebuffer } from '../harness/framebuffer';

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('filter registration', () => {
	it('compiles custom sources before registration resolves and owns their disposal', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;
		const source = '#version 300 es\nvoid main() {}';

		await manager.register('custom', source, { u_amount: ['amount', 0.25] });
		expect(manager.has('custom')).toBe(true);
		expect(runtime.createShader).toHaveBeenCalledTimes(19);

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'custom', { amount: 0.75 });
		runtime.compositeTransform(framebuffer());
		expect(runtime.createShader).toHaveBeenCalledTimes(19);
		expect(runtime.passes[0]!.uniforms).toEqual(
			expect.objectContaining({ u_amount: 0.75, u_resolution: [80, 40] })
		);

		const firstShader = runtime.shaders.at(-1)!;
		await manager.register('custom', source);
		expect(firstShader.dispose).toHaveBeenCalledOnce();
		expect(manager.unregister('custom')).toBe(true);
		expect(manager.has('custom')).toBe(false);
		expect(manager.unregister('custom')).toBe(false);
	});

	it('rejects an all-whitespace registration id', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);

		await expect(manager.register('   ', 'source')).rejects.toThrow('Filter id cannot be empty.');
	});

	it('keeps the previous registration when replacement compilation fails', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);
		const source = '#version 300 es\nvoid main() {}';

		await manager.register('custom', source);
		const previousShader = runtime.shaders.at(-1)!;
		runtime.createShader.mockRejectedValueOnce(new Error('compile failed'));

		await expect(manager.register('custom', source)).rejects.toThrow('compile failed');
		expect(manager.has('custom')).toBe(true);
		expect(previousShader.dispose).not.toHaveBeenCalled();
	});

	it('accepts precompiled shaders without invoking createShader', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);
		const shader = { dispose: vi.fn() };

		await manager.register('custom', shader);

		expect(runtime.createShader).toHaveBeenCalledTimes(18);
		expect(manager.unregister('custom')).toBe(true);
		expect(shader.dispose).toHaveBeenCalledOnce();
	});

	it('treats built-ins as replaceable and unregisterable like custom filters', async () => {
		const runtime = filterRuntime();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		await runtime.preSetup();
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);
		const builtInShader = runtime.shaders[0]!;

		expect(manager.unregister('invert')).toBe(true);
		expect(manager.has('invert')).toBe(false);
		expect(builtInShader.dispose).toHaveBeenCalledOnce();

		await manager.register('invert', '#version 300 es\nvoid main() {}');
		expect(manager.has('invert')).toBe(true);
	});

	it('throws when registering after disposal', async () => {
		const runtime = filterRuntime();
		const cleanup = FiltersPlugin.install(runtime.textmodifier as never, runtime.context) as unknown as () => void;
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);
		cleanup();

		await expect(manager.register('custom', 'source')).rejects.toThrow('disposed');
		expect(manager.has('custom')).toBe(false);
	});
});
