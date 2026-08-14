import { vi } from 'vitest';
import type { TextmodeFramebuffer, TextmodePluginContext } from 'textmode.js';

import { framebuffer } from './framebuffer';

export interface FilterRuntime {
	readonly base: object;
	readonly textmodifier: ReturnType<typeof createTextmodifier>['textmodifier'];
	readonly context: TextmodePluginContext;
	readonly createFramebuffer: ReturnType<typeof createTextmodifier>['createFramebuffer'];
	readonly createShader: ReturnType<typeof createTextmodifier>['createShader'];
	readonly extensions: Map<string, PropertyDescriptor>;
	readonly buffers: TextmodeFramebuffer[];
	readonly passes: Array<{
		source: TextmodeFramebuffer;
		target: TextmodeFramebuffer;
		shader: unknown;
		uniforms: Record<string, unknown>;
	}>;
	readonly shaders: Array<{ dispose: ReturnType<typeof vi.fn> }>;
	readonly operations: string[];
	readonly layerDisposed: (layer: object) => void;
	readonly layerTransform: (value: any) => TextmodeFramebuffer;
	readonly compositeTransform: (value: any) => TextmodeFramebuffer;
	readonly preDraw: () => void;
	readonly postDraw: () => void;
	readonly preSetup: () => Promise<void> | void;
}

function createTextmodifier() {
	const base = {};
	const layers = { base, all: [] };
	const buffers: TextmodeFramebuffer[] = [];
	const operations: string[] = [];
	let activeTarget: TextmodeFramebuffer | undefined;
	let activeShader: unknown;
	let activeUniforms: Record<string, unknown> = {};
	const passes: FilterRuntime['passes'] = [];
	const createFramebuffer = vi.fn(({ width, height }: { width: number; height: number }) => {
		const result = framebuffer(width, height);
		vi.mocked(result.begin).mockImplementation(() => {
			operations.push('begin');
			activeTarget = result;
		});
		vi.mocked(result.end).mockImplementation(() => {
			operations.push('end');
			activeTarget = undefined;
		});
		buffers.push(result);
		return result;
	});
	const shaders: Array<{ dispose: ReturnType<typeof vi.fn> }> = [];
	const createShader = vi.fn(async (_vertexSource: string, _fragmentSource: string) => {
		const shader = { dispose: vi.fn() };
		shaders.push(shader);
		return shader;
	});
	const textmodifier = {
		layers,
		createFramebuffer,
		createShader,
		push: vi.fn(() => operations.push('push')),
		pop: vi.fn(() => operations.push('pop')),
		shader: vi.fn((shader: unknown) => {
			operations.push('shader');
			activeShader = shader;
		}),
		setUniforms: vi.fn((uniforms: Record<string, unknown>) => {
			operations.push('setUniforms');
			activeUniforms = uniforms;
		}),
		rect: vi.fn(() => {
			operations.push('rect');
			const texture = activeUniforms.u_texture as { owner?: TextmodeFramebuffer } | undefined;
			passes.push({
				source: texture!.owner!,
				target: activeTarget!,
				shader: activeShader,
				uniforms: activeUniforms,
			});
		}),
	};
	return { textmodifier, createFramebuffer, createShader, buffers, passes, operations, shaders, layers, base };
}

function createContext(extensions: Map<string, PropertyDescriptor>) {
	let layerDisposed: ((layer: object) => void) | undefined;
	let layerTransform: ((value: any) => TextmodeFramebuffer | void) | undefined;
	let compositeTransform: ((value: any) => TextmodeFramebuffer | void) | undefined;
	let preDraw: (() => void) | undefined;
	let postDraw: (() => void) | undefined;
	let preSetup: (() => Promise<void> | void) | undefined;
	const context = {
		defineExtension: (target: string, name: string, descriptor: PropertyDescriptor) => {
			extensions.set(`${target}:${name}`, descriptor);
			return () => extensions.delete(`${target}:${name}`);
		},
		on: (hook: string, callback: any) => {
			if (hook === 'layerDisposed') layerDisposed = callback;
			else if (hook === 'layerOutput') layerTransform = callback;
			else if (hook === 'compositeOutput') compositeTransform = callback;
			else if (hook === 'preDraw') preDraw = callback;
			else if (hook === 'postDraw') postDraw = callback;
			else if (hook === 'preSetup') preSetup = callback;
			return vi.fn();
		},
	} as unknown as TextmodePluginContext;

	const access = {
		get layerDisposed() {
			return layerDisposed!;
		},
		get layerTransform() {
			return layerTransform! as (value: any) => TextmodeFramebuffer;
		},
		get compositeTransform() {
			return compositeTransform! as (value: any) => TextmodeFramebuffer;
		},
		get preDraw() {
			return preDraw!;
		},
		get postDraw() {
			return postDraw!;
		},
		get preSetup() {
			return preSetup!;
		},
	};
	return { context, access };
}

export function filterRuntime(): FilterRuntime {
	const { textmodifier, createFramebuffer, createShader, buffers, passes, operations, shaders, base } =
		createTextmodifier();
	const extensions = new Map<string, PropertyDescriptor>();
	const { context, access } = createContext(extensions);

	return {
		base,
		textmodifier,
		context,
		createFramebuffer,
		createShader,
		extensions,
		buffers,
		passes,
		shaders,
		operations,
		get layerDisposed() {
			return access.layerDisposed;
		},
		get layerTransform() {
			return access.layerTransform;
		},
		get compositeTransform() {
			return access.compositeTransform;
		},
		get preDraw() {
			return access.preDraw;
		},
		get postDraw() {
			return access.postDraw;
		},
		get preSetup() {
			return access.preSetup;
		},
	};
}
