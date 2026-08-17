import { resolve } from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

import { BUILTIN_CATALOG } from '../../../src/builtins/catalog';
import {
	createFiltersPlugin,
	discoverShaderFiles,
	parseDefaultExport,
	transformedCode,
} from '../../harness/shaderTransform';
import { readFileSync } from 'node:fs';

const HOST_UNIFORMS = new Set(['u_texture', 'u_resolution']);

function collectUniformNames(shader: string): Set<string> {
	const names = new Set<string>();
	const pattern =
		/\buniform\s+(?:(?:lowp|mediump|highp)\s+)?[A-Za-z0-9_]+(?:\s*\[[^\]]*\])?\s+([A-Za-z_][A-Za-z0-9_]*)/g;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(shader)) !== null) {
		names.add(match[1]!);
	}
	return names;
}

describe('built-in descriptor to GLSL uniform contract', () => {
	let plugin: ReturnType<typeof createFiltersPlugin> extends Promise<infer T> ? T : never;
	const shaderById = new Map<string, string>();

	beforeEach(async () => {
		plugin = await createFiltersPlugin();
		shaderById.clear();
		for (const file of discoverShaderFiles(resolve(process.cwd(), 'src/builtins'), '.frag')) {
			const id = file.slice(file.lastIndexOf('/') + 1, -'.frag'.length);
			shaderById.set(id, parseDefaultExport(await transformedCode(plugin, readFileSync(file, 'utf8'), file)));
		}
	});

	it('declares every descriptor uniform in the emitted shader', () => {
		for (const [id, descriptor] of Object.entries(BUILTIN_CATALOG)) {
			const shader = shaderById.get(id);
			expect(shader, `missing transformed shader for ${id}`).toBeDefined();
			const declared = collectUniformNames(shader!);
			for (const binding of descriptor.uniforms) {
				expect(declared, `${id} descriptor uniform ${binding[0]} missing from GLSL`).toContain(binding[0]);
			}
		}
	});

	it('represents every non-host shader uniform with a descriptor binding', () => {
		for (const [id, descriptor] of Object.entries(BUILTIN_CATALOG)) {
			const shader = shaderById.get(id)!;
			const bound = new Set(descriptor.uniforms.map((binding) => binding[0]));
			for (const name of collectUniformNames(shader)) {
				if (HOST_UNIFORMS.has(name)) continue;
				expect(bound, `${id} shader uniform ${name} has no descriptor binding`).toContain(name);
			}
		}
	});
});
