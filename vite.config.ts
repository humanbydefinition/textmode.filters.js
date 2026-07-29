import { defineTextmodeLibrary } from '@textmode/vite-config';

import { createGLSLPlugin } from './vite-plugins/glsl-minify';

export default defineTextmodeLibrary({
	globalName: 'textmodeFilters',
	plugins: [createGLSLPlugin()],
});
