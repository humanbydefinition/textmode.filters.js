# textmode.filters.js (WIP)

> [!NOTE]
> work-in-progress, the necessary textmode.js version is not yet released.

Layers filters plugin for [`textmode.js`](https://code.textmode.art/).

This add-on provides GPU-accelerated filters that can be applied to layers.

## Installation

```bash
npm install textmode.filters.js
```

Make sure `textmode.js` is also installed in your project. The add-on declares it as a peer dependency.

## Usage

```ts
import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
  width: 800,
  height: 600,
  plugins: [createFiltersPlugin()],
});

t.draw(() => {
  t.layers.base.filter('brightness', 1.2);
  t.layers.base.filter('contrast', { amount: 1.5 });

  t.background(0);
  // ... draw something ...
});
```

## Available Filters

| Filter | Parameter | Default | Description |
|--------|-----------|---------|-------------|
| `brightness` | `amount` | `1.0` | Adjust image brightness (1.0 = normal, >1 = brighter, <1 = darker) |
| `contrast` | `amount` | `1.0` | Adjust image contrast (1.0 = normal, >1 = more contrast, <1 = less) |
