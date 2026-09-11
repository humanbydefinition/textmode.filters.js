import path from 'path';

import { defineTextmodeProject, textmodeGlsl } from '@textmode/build';

import { publicShaderSymbols } from './vite-plugins/glsl-public-symbols';

export default defineTextmodeProject({
	plugins: [
		textmodeGlsl({
			shaderRoots: ['src/builtins', 'src/shaders'],
			includeRoots: ['src/builtins', 'src/shaders'],
			publicSymbols: publicShaderSymbols,
			hostIdentifiers: { sourceRoots: ['src'] },
		}),
	],
	projects: [
		{
			extends: true,
			test: {
				name: 'unit',
				include: ['tests/unit/**/*.test.ts'],
			},
		},
		{
			extends: true,
			test: {
				name: 'integration',
				include: ['tests/{integration,contracts,tooling}/**/*.test.ts'],
			},
		},
	],
	alias: {
		'textmode.filters.js': path.resolve(import.meta.dirname, 'src/index.ts'),
	},
});
