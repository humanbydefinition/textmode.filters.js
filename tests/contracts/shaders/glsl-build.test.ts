import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

import {
	createFiltersPlugin,
	discoverShaderFiles,
	parseDefaultExport,
	transformedCode,
} from '../../harness/shaderTransform';

describe('filters GLSL build contract', () => {
	let plugin: ReturnType<typeof createFiltersPlugin> extends Promise<infer T> ? T : never;

	beforeEach(async () => {
		plugin = await createFiltersPlugin();
	});

	it('preserves the rectangle geometry attributes consumed by textmode.js', async () => {
		const shaderPath = resolve(process.cwd(), 'src/shaders/filter.vert');
		const shader = parseDefaultExport(await transformedCode(plugin, readFileSync(shaderPath, 'utf8'), shaderPath));

		expect(shader).toMatch(/\bin vec2 a_position\b/);
		expect(shader).toMatch(/\bin vec2 a_texCoord\b/);
		expect(shader).toMatch(/\bv_uv\s*=\s*a_texCoord\b/);
	});

	it('preserves the add-on texture/filter ABI in every emitted fragment shader', async () => {
		const shaderFiles = discoverShaderFiles(resolve(process.cwd(), 'src/builtins'), '.frag');

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
		const sourcePath = resolve(process.cwd(), 'src/builtins/color-adjustment/brightness.ts');
		const source = readFileSync(sourcePath, 'utf8');
		const transformedHost = await transformedCode(plugin, source, sourcePath);
		const shaderPath = resolve(process.cwd(), 'src/builtins/color-adjustment/brightness.frag');
		const shader = parseDefaultExport(await transformedCode(plugin, readFileSync(shaderPath, 'utf8'), shaderPath));
		const privateUniform = shader.match(/\buniform float (U[0-9A-Za-z]+)\b/)?.[1];

		expect(privateUniform).toBeTruthy();
		expect(shader).not.toContain('u_amount');
		expect(transformedHost).not.toContain('u_amount:');
		expect(transformedHost).toContain(`${privateUniform}:`);
	});
});
