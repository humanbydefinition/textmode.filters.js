import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { textmodeGlsl } from '@textmode/build';

import { publicShaderSymbols } from '../../vite-plugins/glsl-public-symbols';

export type FiltersPlugin = ReturnType<typeof textmodeGlsl>;

export function discoverShaderFiles(directory: string, extension: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(directory)) {
		const entryPath = resolve(directory, entry);
		if (statSync(entryPath).isDirectory()) {
			files.push(...discoverShaderFiles(entryPath, extension));
		} else if (entry.endsWith(extension)) {
			files.push(entryPath);
		}
	}
	return files;
}

export async function createFiltersPlugin(): Promise<FiltersPlugin> {
	const plugin = textmodeGlsl({
		shaderRoots: ['src/builtins', 'src/shaders'],
		includeRoots: ['src/builtins', 'src/shaders'],
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

export async function transformedCode(plugin: FiltersPlugin, code: string, id: string): Promise<string> {
	const transform = plugin.transform as (this: unknown, code: string, id: string) => unknown | Promise<unknown>;
	const result = await transform.call({ addWatchFile: () => undefined }, code, id);
	if (!result || typeof result !== 'object' || !('code' in result)) {
		throw new Error(`GLSL plugin did not transform ${id}.`);
	}
	return String(result.code);
}

export function parseDefaultExport(moduleCode: string): string {
	const match = moduleCode.match(/^export default ([\s\S]*);$/);
	if (!match) {
		throw new Error('GLSL plugin did not emit a default export.');
	}
	return JSON.parse(match[1]) as string;
}
