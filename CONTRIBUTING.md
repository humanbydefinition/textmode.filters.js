# Contributing to `textmode.filters.js`

First off, thank you for considering contributing to `textmode.filters.js`! 🎉

This project thrives on community contributions, and we're excited to have you here. Whether you're fixing a bug, adding a new filter, or improving documentation, your help is greatly appreciated.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Adding a New Filter](#adding-a-new-filter)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/textmode.filters.js.git
   cd textmode.filters.js
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/humanbydefinition/textmode.filters.js.git
   ```

## Development Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
textmode.filters.js/
├── src/
│   ├── index.ts           # Main entry point & plugin registration
│   ├── vite-env.d.ts      # Vite type definitions
│   └── shaders/           # GLSL fragment shaders
│       ├── brightness.frag
│       └── contrast.frag
├── examples/
│   ├── esm/               # ES Module example
│   └── umd/               # UMD/Browser example
├── dist/                  # Built output (generated)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Adding a New Filter

Adding a new filter is straightforward! Here's a step-by-step guide:

### Step 1: Create the Shader

Create a new fragment shader file in `src/shaders/`:

```glsl
// src/shaders/yourfilter.frag

#version 300 es
precision highp float;

// Required uniforms (provided by textmode.js)
uniform sampler2D u_texture;    // The input texture to filter
uniform vec2 u_resolution;      // Canvas resolution in pixels

// Your custom uniforms (parameters)
uniform float u_amount;         // Example: filter intensity

// Varying from vertex shader
in vec2 v_uv;

// Output
out vec4 fragColor;

void main() {
    // Sample the input texture
    vec4 color = texture(u_texture, v_uv);
    
    // Apply your filter effect
    vec3 result = color.rgb; // Modify this with your filter logic!
    
    // Output the result (preserve alpha)
    fragColor = vec4(result, color.a);
}
```

### Step 2: Register the Filter

Update `src/index.ts` to import and register your filter:

```typescript
import type { TextmodePlugin } from 'textmode.js';

import brightnessFragmentShader from './shaders/brightness.frag?raw';
import contrastFragmentShader from './shaders/contrast.frag?raw';
import yourFilterFragmentShader from './shaders/yourfilter.frag?raw'; // Add this

export const createFiltersPlugin = (): TextmodePlugin => ({
    name: 'textmode.filters',
    version: '1.0.0',

    async install(textmodifier) {
        textmodifier.layers.filters.register('brightness', brightnessFragmentShader, { 
            u_amount: ['amount', 1.0]
        });
        textmodifier.layers.filters.register('contrast', contrastFragmentShader, { 
            u_amount: ['amount', 1.0]
        });
        
        // Register your filter
        // Format: register(name, shader, { uniform_name: [param_name, default_value] })
        textmodifier.layers.filters.register('yourfilter', yourFilterFragmentShader, { 
            u_amount: ['amount', 1.0],
            // Add more parameters as needed
        });
    },

    async uninstall(textmodifier) {
        textmodifier.layers.filters.unregister('brightness');
        textmodifier.layers.filters.unregister('contrast');
        textmodifier.layers.filters.unregister('yourfilter'); // Add this
    },
});
```

### Step 3: Document Your Filter

Update the [README.md](README.md) to include your filter:

1. Add your filter to the [Available filters](README.md#available-filters) table
2. Add yourself to the [Filter contributors](README.md#filter-contributors) section

### Step 4: Test Your Filter

1. Add an example in `examples/esm/sketch.js` or `examples/umd/sketch.js`
2. Run `npm run dev` to test locally
3. Make sure the filter works as expected

### Uniform Parameter Mapping

The third parameter to `register()` maps GLSL uniforms to user-facing parameters:

```typescript
{
    u_uniformName: ['parameterName', defaultValue]
}
```

- `u_uniformName` - The uniform variable name in your shader
- `parameterName` - The name users will use (e.g., `amount`, `radius`, `intensity`)
- `defaultValue` - The default value if the user doesn't specify one

Users can then use your filter like this:

```javascript
// Shorthand (single parameter uses the first defined parameter)
t.layers.base.filter('yourfilter', 0.5);

// Object syntax (for multiple parameters)
t.layers.base.filter('yourfilter', { amount: 0.5 });
```

## Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-filter-name
   ```

2. **Make your changes** following the guidelines above

3. **Commit your changes** with a clear message:
   ```bash
   git commit -m "feat: add yourfilter filter"
   ```
   
   We loosely follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

4. **Push to your fork**:
   ```bash
   git push origin feature/your-filter-name
   ```

5. **Open a Pull Request** on GitHub with:
   - A clear title and description
   - Screenshots/GIFs if it's a visual filter
   - Reference any related issues

6. **Wait for review** - We'll review your PR and may suggest changes

## Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let` when possible
- Use meaningful variable names

### GLSL Shaders

- Use GLSL ES 3.0 (`#version 300 es`)
- Always specify `precision highp float;`
- Prefix uniforms with `u_`
- Comment your shader logic
- Keep shaders performant (they run per-pixel!)

### General

- Keep code clean and readable
- Add comments for complex logic
- Follow existing code patterns

## Reporting Bugs

Found a bug? Please open an issue with:

1. **A clear title** describing the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs. actual behavior
4. **Environment info** (browser, OS, textmode.js version)
5. **Code sample** or minimal reproduction if possible

## Suggesting Features

Have an idea for a new filter or feature? We'd love to hear it!

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with the `enhancement` label
3. **Describe your idea** clearly:
   - What filter/feature would you like?
   - How would it be used?
   - Any reference implementations or examples?

---

## Filter Ideas Looking for Contributors

Here are some filters we'd love to see contributed:

- [ ] **Blur** - Gaussian or box blur
- [ ] **Sharpen** - Edge enhancement
- [ ] **Saturation** - Color saturation adjustment
- [ ] **Hue Rotate** - Shift colors around the color wheel
- [ ] **Invert** - Color inversion
- [ ] **Grayscale** - Convert to grayscale
- [ ] **Sepia** - Vintage sepia tone
- [ ] **Vignette** - Darkened edges effect
- [ ] **Pixelate** - Pixelation effect
- [ ] **Noise** - Add film grain/noise
- [ ] **Chromatic Aberration** - RGB channel separation
- [ ] **Glitch** - Digital glitch effects

Pick one and start contributing! 🚀

---

Thank you for contributing! 💜
