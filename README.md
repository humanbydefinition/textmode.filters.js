<div align="center">

# 🎨 textmode.filters.js

**GPU-accelerated image filters plugin for [textmode.js](https://code.textmode.art/)**

[![npm version](https://img.shields.io/npm/v/textmode.filters.js.svg?style=flat-square)](https://www.npmjs.com/package/textmode.filters.js)
[![license](https://img.shields.io/npm/l/textmode.filters.js.svg?style=flat-square)](https://github.com/humanbydefinition/textmode.filters.js/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/humanbydefinition/textmode.filters.js/blob/main/CONTRIBUTING.md)

[Installation](#installation) •
[Usage](#usage) •
[Filters](#filters) •
[Contributing](#contributing)

</div>

---

## ✨ Features

- 🚀 **GPU-accelerated** - All filters run on the GPU via WebGL2 fragment shaders
- 🎛️ **Customizable parameters** - Fine-tune each filter to your needs
- 📦 **Lightweight** - Minimal footprint, no external dependencies
- 🤝 **Open to contributions** - Easy to add your own custom filters!

## Installation

```bash
npm install textmode.filters.js
```

> **Note:** Make sure `textmode.js` is also installed in your project. This add-on declares it as a peer dependency.

You can also use it via CDN:

```html
<!-- ESM -->
<script type="module" src="https://unpkg.com/textmode.js/dist/textmode.esm.js"></script>
<script type="module" src="https://unpkg.com/textmode.filters.js/dist/textmode.filters.esm.js"></script>

<!-- UMD -->
<script src="https://unpkg.com/textmode.js/dist/textmode.umd.js"></script> 
<script src="https://unpkg.com/textmode.filters.js/dist/textmode.filters.umd.js"></script>
```

## Usage

### ESM

```javascript
import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
  width: 800,
  height: 600,
  plugins: [createFiltersPlugin()],
});

t.draw(() => {
  // Apply filters to layers
  t.layers.base.filter('brightness', 1.2);
  t.layers.base.filter('contrast', { amount: 1.5 });

  t.background(0);
  // ... draw something ...
});
```

### UMD

```html
<script src="https://unpkg.com/textmode.js/dist/textmode.umd.js"></script>
<script src="https://unpkg.com/textmode.filters.js/dist/textmode.filters.umd.js"></script>
<script>
  const t = textmode.create({
    plugins: [createFiltersPlugin()],
  });

  t.draw(() => {
    t.layers.base.filter('brightness', 1.3);
  });
</script>
```

## Filters

### `brightness`

Adjust image brightness *(1.0 = normal, >1 = brighter, <1 = darker)*

**Parameters:**
- `amount` - Brightness multiplier  
  Default: `1.0` | Range: `0.0` - `∞`

**Author:** [@humanbydefinition](https://github.com/humanbydefinition)

---

### `contrast`

Adjust image contrast *(1.0 = normal, >1 = more contrast, <1 = less)*

**Parameters:**
- `amount` - Contrast multiplier  
  Default: `1.0` | Range: `0.0` - `∞`

**Author:** [@humanbydefinition](https://github.com/humanbydefinition)

---

### `hueRotate`

Shift colors around the color wheel

**Parameters:**
- `angle` - Rotation angle in degrees  
  Default: `0.0` | Range: `0.0` - `360.0`

**Author:** [@humanbydefinition](https://github.com/humanbydefinition)

---

### `glitch`

Digital glitch effect with RGB channel separation, scanlines, and noise

**Parameters:**
- `amount` - Glitch intensity  
  Default: `0.0` | Range: `0.0` - `∞`

**Author:** [@humanbydefinition](https://github.com/humanbydefinition)

---

### `chromaticAberration`

RGB color channel separation effect that simulates lens distortion

**Parameters:**
- `amount` - Offset amount in pixels  
  Default: `5.0` | Range: `0.0` - `∞`
- `direction` - Direction of the color separation as `[x, y]`  
  Default: `[1.0, 0.0]` (horizontal)

**Author:** [@humanbydefinition](https://github.com/humanbydefinition)

---

### `pixelate`

Reduce image resolution to create a mosaic/pixelated effect

**Parameters:**
- `pixelSize` - Size of each pixel block in pixels  
  Default: `4.0` | Range: `1.0` - `∞`

**Author:** [@humanbydefinition](https://github.com/humanbydefinition)

---

### `gridDistortion`

Distort a monospaced character grid by varying the width and height of individual cells. Create wave effects, perspective distortions, or other grid warping effects by providing custom factor arrays.

**Parameters:**
- `gridSize` - Grid dimensions as `[columns, rows]`  
  Default: `[80, 40]` | Maximum: `[128, 128]`
- `widthFactors` - Array of distortion values (0-1) for each column  
  Must contain at least as many elements as columns (max 128)
- `heightFactors` - Array of distortion values (0-1) for each row  
  Must contain at least as many elements as rows (max 128)
- `widthVariationScale` - Intensity multiplier for width distortion  
  Default: `0.5` | Range: `0.0` - `∞`
- `heightVariationScale` - Intensity multiplier for height distortion  
  Default: `0.5` | Range: `0.0` - `∞`

**Author:** [@humanbydefinition](https://github.com/humanbydefinition)

---

### Usage examples

```javascript
// Using a single value (shorthand)
t.layers.base.filter('brightness', 1.5);
t.layers.base.filter('hueRotate', 180);

// Using an options object
t.layers.base.filter('contrast', { amount: 0.8 });
t.layers.base.filter('glitch', { amount: 2.0 });

// Chaining multiple filters in sequence
t.layers.base.filter('brightness', 1.2);
t.layers.base.filter('contrast', 1.3);
t.layers.base.filter('hueRotate', 90);

// Chromatic aberration with custom direction
t.layers.base.filter('chromaticAberration', { amount: 10, direction: [1, 1] });

// Pixelate effect
t.layers.base.filter('pixelate', 8);
```

## Adding custom filters

Want to create your own filter? Check out the [Contributing Guide](CONTRIBUTING.md) for detailed instructions on how to add new filters to this library!

The basic structure of a filter shader:

```glsl
#version 300 es
precision highp float;

uniform sampler2D u_texture;    // Input texture
uniform vec2 u_resolution;      // Canvas resolution
uniform float u_yourParam;      // Your custom parameter

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    
    // Your filter logic here
    vec3 result = color.rgb; // Modify this!
    
    fragColor = vec4(result, color.a);
}
```

## Contributing

Contributions are welcome and greatly appreciated! 🎉

Whether you want to:
- 🐛 Report a bug
- 💡 Suggest a new filter
- 🔧 Submit a pull request
- 📖 Improve documentation

Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

## Related projects

- **[textmode.js](https://github.com/humanbydefinition/textmode.js)** - The main textmode.js library
- **[code.textmode.art](https://code.textmode.art/)** - Documentation & examples
- **[editor.textmode.art](https://editor.textmode.art/)** - textmode.js web editor

---

<div align="center">

<br />

**[↑ Back to Top](#-textmodefiltersjs)**

</div>
