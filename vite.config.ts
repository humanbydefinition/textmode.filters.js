import { defineTextmodeLibrary, textmodeGlsl } from '@textmode/build';

import { publicShaderSymbols } from './vite-plugins/glsl-public-symbols';

export default defineTextmodeLibrary({
	globalName: 'textmodeFilters',
	plugins: [
		textmodeGlsl({
			shaderRoots: ['src/shaders'],
			includeRoots: ['src/shaders'],
			publicSymbols: publicShaderSymbols,
			hostIdentifiers: {
				sourceRoots: ['src'],
			},
		}),
	],
});
