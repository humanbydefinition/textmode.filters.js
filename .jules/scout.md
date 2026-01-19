## 2024-03-24 - Global Side Effect in Source Code
**Finding:** `src/index.ts` contains a manual global assignment `window.createFiltersPlugin = createFiltersPlugin` to support UMD usage.
**Implication:** This code is included in the ESM build as well, causing the library to pollute the global scope when imported as a module in modern applications.
**Guidance:** Future improvements should refactor this to only occur in the UMD build, likely by using a separate entry point or a build-time conditional, while respecting the existing public API.
