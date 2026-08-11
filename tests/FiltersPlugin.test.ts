import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TextmodeFramebuffer, TextmodePluginContext } from 'textmode.js';

import { FiltersPlugin, TextmodeFilterManager } from '../src/index';

const filterNames = [
	'invert',
	'grayscale',
	'sepia',
	'threshold',
	'brightness',
	'contrast',
	'saturation',
	'hueRotate',
	'posterize',
	'chromaticAberration',
	'pixelate',
	'gridDistortion',
	'glitch',
	'crtMattias',
	'scanlines',
	'vignette',
	'bloom',
	'filmGrain',
];

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

function framebuffer(width = 80, height = 40): TextmodeFramebuffer {
	return {
		width,
		height,
		attachmentCount: 1,
		textures: [{}],
		resize: vi.fn(function (this: { width: number; height: number }, nextWidth: number, nextHeight: number) {
			this.width = nextWidth;
			this.height = nextHeight;
		}),
		dispose: vi.fn(),
	} as unknown as TextmodeFramebuffer;
}

function harness() {
	const base = {};
	const layers = { base, all: [] };
	const textmodifier = { layers };
	const extensions = new Map<string, PropertyDescriptor>();
	let layerCreated: ((layer: object) => void) | undefined;
	let layerDisposed: ((layer: object) => void) | undefined;
	let layerTransform: ((value: any) => TextmodeFramebuffer | void) | undefined;
	let compositeTransform: ((value: any) => TextmodeFramebuffer | void) | undefined;
	let preDraw: (() => void) | undefined;
	let postDraw: (() => void) | undefined;
	const shaders: Array<{ dispose: ReturnType<typeof vi.fn> }> = [];
	const buffers: TextmodeFramebuffer[] = [];
	const passes: Array<{ source: TextmodeFramebuffer; target: TextmodeFramebuffer; shader: unknown }> = [];
	const context = {
		gpu: {
			createFramebuffer: ({ width, height }: { width: number; height: number }) => {
				const result = framebuffer(width, height);
				buffers.push(result);
				return result;
			},
			createFullscreenShader: vi.fn(() => {
				const shader = { dispose: vi.fn() };
				shaders.push(shader);
				return shader;
			}),
			renderFullscreen: vi.fn((options: any) => passes.push(options)),
		},
		defineExtension: (target: string, name: string, descriptor: PropertyDescriptor) => {
			extensions.set(`${target}:${name}`, descriptor);
			return () => extensions.delete(`${target}:${name}`);
		},
		registerLayerCreatedHook: (callback: any) => {
			layerCreated = callback;
			callback(base);
			return vi.fn();
		},
		registerLayerDisposedHook: (callback: any) => {
			layerDisposed = callback;
			return vi.fn();
		},
		registerLayerOutputTransform: (callback: any) => {
			layerTransform = callback;
			return vi.fn();
		},
		registerCompositeOutputTransform: (callback: any) => {
			compositeTransform = callback;
			return vi.fn();
		},
		registerPreDrawHook: (callback: any) => {
			preDraw = callback;
			return vi.fn();
		},
		registerPostDrawHook: (callback: any) => {
			postDraw = callback;
			return vi.fn();
		},
	} as unknown as TextmodePluginContext;

	return {
		base,
		textmodifier,
		context,
		extensions,
		buffers,
		passes,
		shaders,
		get layerCreated() {
			return layerCreated!;
		},
		get layerDisposed() {
			return layerDisposed!;
		},
		get layerTransform() {
			return layerTransform!;
		},
		get compositeTransform() {
			return compositeTransform!;
		},
		get preDraw() {
			return preDraw!;
		},
		get postDraw() {
			return postDraw!;
		},
	};
}

describe('FiltersPlugin', () => {
	it('installs all 18 descriptors synchronously without compiling or allocating', () => {
		const runtime = harness();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);

		expect(manager).toBeInstanceOf(TextmodeFilterManager);
		expect(filterNames.filter((name) => manager.has(name))).toEqual(filterNames);
		expect(runtime.context.gpu.createFullscreenShader).not.toHaveBeenCalled();
		expect(runtime.buffers).toHaveLength(0);
		expect(FiltersPlugin.version).toBe('2.0.0');
	});

	it('runs an N-filter layer chain in N passes with lazy per-layer scratch buffers', () => {
		const runtime = harness();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
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
		expect(runtime.context.gpu.createFullscreenShader).toHaveBeenCalledTimes(2);
	});

	it('keeps global and finalDraw queues ordered and independent from layer pools', () => {
		const runtime = harness();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
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

	it('routes draw and postDraw filters through the two layer phases', () => {
		const runtime = harness();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
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

	it('preserves between-frame queues for the next frame and drops queues from an interrupted frame', () => {
		const runtime = harness();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
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

	it('reuses and resizes one scratch pair per layer', () => {
		const runtime = harness();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
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

	it('registers custom sources lazily and owns replacement and unregister disposal', async () => {
		const runtime = harness();
		FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		const manager = runtime.extensions.get('textmodifier:filters')!.get!.call(runtime.textmodifier);
		const filter = runtime.extensions.get('textmodifier:filter')!.value! as Function;
		const source = '#version 300 es\nvoid main() {}';

		await manager.register('custom', source, { u_amount: ['amount', 0.25] });
		expect(manager.has('custom')).toBe(true);
		expect(runtime.context.gpu.createFullscreenShader).not.toHaveBeenCalled();

		runtime.preDraw();
		filter.call(runtime.textmodifier, 'custom', { amount: 0.75 });
		runtime.compositeTransform(framebuffer());
		expect(runtime.context.gpu.createFullscreenShader).toHaveBeenCalledOnce();
		expect((runtime.context.gpu.renderFullscreen as any).mock.calls[0][0].uniforms).toEqual({ u_amount: 0.75 });

		const firstShader = runtime.shaders[0]!;
		await manager.register('custom', source);
		expect(firstShader.dispose).toHaveBeenCalledOnce();
		expect(manager.unregister('custom')).toBe(true);
		expect(manager.has('custom')).toBe(false);
		expect(manager.unregister('custom')).toBe(false);
	});

	it('keeps simultaneous plugin instances independent', () => {
		const first = harness();
		const second = harness();
		FiltersPlugin.install(first.textmodifier as never, first.context);
		FiltersPlugin.install(second.textmodifier as never, second.context);
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

	it('disposes layer scratch resources on removal and all remaining resources on uninstall', async () => {
		const runtime = harness();
		await FiltersPlugin.install(runtime.textmodifier as never, runtime.context);
		const filter = runtime.extensions.get('layer:filter')!.value! as Function;
		filter.call(runtime.base, 'invert');
		runtime.layerTransform({ layer: runtime.base, phase: 'resolved', output: framebuffer() });

		runtime.layerDisposed(runtime.base);
		expect(runtime.buffers.every((buffer) => vi.mocked(buffer.dispose).mock.calls.length === 1)).toBe(true);
		await FiltersPlugin.uninstall!(runtime.textmodifier as never, runtime.context);
		expect(runtime.shaders.every((shader) => shader.dispose.mock.calls.length === 1)).toBe(true);
	});

	it('exports and exposes the plugin global', async () => {
		const browserWindow = {};
		vi.stubGlobal('window', browserWindow);
		vi.resetModules();
		const filtersModule = await import('../src/index');
		expect(filtersModule.FiltersPlugin).toBeDefined();
		expect(filtersModule.TextmodeFilterManager).toBeDefined();
		expect(browserWindow).toEqual({ FiltersPlugin: filtersModule.FiltersPlugin });
	});
});
