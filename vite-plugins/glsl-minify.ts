import type { Plugin } from 'vite';
import { GlslMinify } from '@mapwhit/glsl-minify';
import fs from 'fs';

interface GLSLMinifyPluginOptions {
  preserveSymbols?: string[];
}

// Shader directories within this addon library
const shaderDirectories = [
  '/src/shaders/',
];

// Standard symbols to preserve (critical for WebGL functionality)
// These include uniforms exposed to users via the filter API, plus GLSL builtins
const defaultPreservedSymbols = [
  // Varying variables (input from vertex shader)
  'v_uv',

  // Fragment output variables
  'fragColor',

  // Built-in GLSL variables
  'gl_Position',
  'gl_FragCoord',
  'gl_FragColor',
  'main',

  // Built-in GLSL functions (must be preserved)
  'texture', 'texture2D', 'textureCube',
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'radians', 'degrees',
  'pow', 'exp', 'log', 'exp2', 'log2', 'sqrt', 'inversesqrt',
  'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max', 'clamp',
  'mix', 'step', 'smoothstep',
  'length', 'distance', 'dot', 'cross', 'normalize', 'faceforward', 'reflect', 'refract',
  'matrixCompMut', 'transpose', 'determinant',
  'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual', 'equal', 'notEqual', 'any', 'all', 'not',
  'dFdx', 'dFdy', 'fwidth',
];

/**
 * Creates a Vite plugin that minifies GLSL shaders.
 * 
 * This plugin loads shader files as text and minifies them before
 * they're included in the bundle, significantly reducing bundle size.
 */
export function glslMinifyPlugin(options: GLSLMinifyPluginOptions = {}): Plugin {
  const preserveSymbols = options.preserveSymbols ?? [];
  const allPreservedSymbols = [...defaultPreservedSymbols, ...preserveSymbols];

  // Helper function to check if a path is an addon shader
  const isAddonShader = (id: string) => shaderDirectories.some(dir => id.includes(dir));
  const isShaderFile = (id: string) => /\.(glsl|vert|frag)$/.test(id.split('?')[0]);

  return {
    name: 'textmode-filters-glsl-minify',
    enforce: 'pre',

    // Load shader files as raw text
    async load(id) {
      // Skip files with query params (like ?raw) - let Vite handle those
      if (id.includes('?')) {
        return null;
      }

      if (!isShaderFile(id) || !isAddonShader(id)) {
        return null;
      }

      // Read the shader file as raw text
      try {
        const code = fs.readFileSync(id, 'utf-8');
        
        // Minify the shader
        const minifier = new GlslMinify({
          nomangle: allPreservedSymbols,
          preserveDefines: false,
          preserveUniforms: true,
          preserveVariables: false,
          stripVersion: false,
          output: 'object',
          esModule: false
        });

        const result: any = await minifier.execute(code);
        const minifiedCode = typeof result?.sourceCode === 'string' ? result.sourceCode : code;
        
        // Export as ES module
        return `export default ${JSON.stringify(minifiedCode)};`;
      } catch (e) {
        console.error('[GLSL Minify] Failed to load/minify', id, e);
        // Try to at least load the file unminified
        try {
          const code = fs.readFileSync(id, 'utf-8');
          return `export default ${JSON.stringify(code)};`;
        } catch {
          return null;
        }
      }
    },
  };
}

/**
 * Creates the GLSL minification plugin for the textmode.filters.js addon.
 * @param additionalPreserveSymbols - Additional symbols to preserve during minification
 */
export function createGLSLPlugin(additionalPreserveSymbols: string[] = []): Plugin {
  return glslMinifyPlugin({ preserveSymbols: additionalPreserveSymbols });
}
