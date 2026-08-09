import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { textmodeGlsl } from '@textmode/build';
import { beforeEach, describe, expect, it } from 'vitest';

import { publicShaderSymbols } from '../../vite-plugins/glsl-public-symbols';

type FiltersPlugin = ReturnType<typeof textmodeGlsl>;
type TransformHook = (
	this: { addWatchFile?: (file: string) => void },
	code: string,
	id: string
) => unknown | Promise<unknown>;

async function createFiltersPlugin(): Promise<FiltersPlugin> {
	const plugin = textmodeGlsl({
		shaderRoots: ['src/shaders'],
		includeRoots: ['src/shaders'],
		publicSymbols: publicShaderSymbols,
		hostIdentifiers: {
			sourceRoots: ['src'],
		},
	});

	if (typeof plugin.configResolved !== 'function' || typeof plugin.buildStart !== 'function') {
		throw new Error('GLSL plugin did not expose its Vite lifecycle hooks.');
	}
	const configResolved = plugin.configResolved as (config: { root: string }) => void | Promise<void>;
	const buildStart = plugin.buildStart as (this: { addWatchFile: (file: string) => void }) => void | Promise<void>;
	await configResolved({ root: process.cwd() });
	await buildStart.call({ addWatchFile: () => undefined });
	return plugin;
}

function getTransform(plugin: FiltersPlugin): TransformHook {
	if (typeof plugin.transform !== 'function') {
		throw new Error('GLSL plugin did not expose a transform function.');
	}
	return plugin.transform as TransformHook;
}

async function transformedCode(plugin: FiltersPlugin, code: string, id: string): Promise<string> {
	const result = await getTransform(plugin).call({ addWatchFile: () => undefined }, code, id);
	if (!result || typeof result !== 'object' || !('code' in result)) {
		throw new Error(`GLSL plugin did not transform ${id}.`);
	}
	return String(result.code);
}

function parseDefaultExport(moduleCode: string): string {
	const match = moduleCode.match(/^export default ([\s\S]*);$/);
	if (!match) {
		throw new Error('GLSL plugin did not emit a default export.');
	}
	return JSON.parse(match[1]) as string;
}

describe('filters GLSL build contract', () => {
	let plugin: FiltersPlugin;

	beforeEach(async () => {
		plugin = await createFiltersPlugin();
	});

	it('preserves the add-on texture/filter ABI in every emitted shader', async () => {
		const shaderDirectory = resolve(process.cwd(), 'src/shaders');
		const shaderFiles = readdirSync(shaderDirectory)
			.filter((file) => file.endsWith('.frag'))
			.map((file) => resolve(shaderDirectory, file));

		expect(shaderFiles).toHaveLength(18);
		for (const shaderFile of shaderFiles) {
			const shader = parseDefaultExport(
				await transformedCode(plugin, readFileSync(shaderFile, 'utf8'), shaderFile)
			);
			expect(shader).toMatch(/\bin vec2 v_uv\b/);
			expect(shader).toMatch(/\bout vec4 fragColor\b/);
			expect(shader).toMatch(/\buniform sampler2D u_texture\b/);
			if (readFileSync(shaderFile, 'utf8').includes('uniform vec2 u_resolution')) {
				expect(shader).toMatch(/\buniform vec2 u_resolution\b/);
			}
		}
	});

	it('renames private uniforms together with their registration keys', async () => {
		const sourcePath = resolve(process.cwd(), 'src/builtins.ts');
		const source = readFileSync(sourcePath, 'utf8');
		const transformedHost = await transformedCode(plugin, source, sourcePath);
		const shaderPath = resolve(process.cwd(), 'src/shaders/brightness.frag');
		const shader = parseDefaultExport(await transformedCode(plugin, readFileSync(shaderPath, 'utf8'), shaderPath));
		const privateUniform = shader.match(/\buniform float (U[0-9A-Za-z]+)\b/)?.[1];

		expect(privateUniform).toBeTruthy();
		expect(shader).not.toContain('u_amount');
		expect(transformedHost).not.toContain('u_amount:');
		expect(transformedHost).toContain(`${privateUniform}:`);
	});
});
