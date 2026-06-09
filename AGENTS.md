# Repository Guidelines

## Project Structure & Module Organization

This package is a TypeScript/Vite plugin that registers WebGL2 fragment shader filters for `textmode.js`.

- `src/index.ts` is the public plugin entry point and filter registration hub.
- `src/types.ts` contains exported filter option types.
- `src/shaders/*.frag` contains GLSL fragment shaders, one file per filter.
- `examples/` contains browser sketches for manual validation; use one directory per filter, such as `examples/brightness/sketch.js`.
- `vite-plugins/` and `typedoc-plugins/` contain local build and documentation helpers.
- `dist/` and `api/` are generated outputs and should not be edited directly.

## Build, Test, and Development Commands

- `npm install` installs dependencies and Husky hooks.
- `npm run dev` starts Vite on port `5179` and opens `/examples/index.html`.
- `npm run build` builds the ESM/UMD bundles and declaration files.
- `npm run check` runs formatting checks, ESLint, Markdown lint, TypeScript checks, and a production build.
- `npm run format` applies Prettier to the repository.
- `npm run build:docs` generates TypeDoc documentation.

There is no dedicated unit test script. Treat `npm run check` plus manual browser validation in `examples/` as the required verification path.

## Coding Style & Naming Conventions

Use TypeScript strict-mode patterns, prefer `const`, and keep public option types exported from `src/types.ts`. Prettier is authoritative: tabs, semicolons, single quotes, trailing commas where valid, and `printWidth` 120.

Filter names are camelCase in TypeScript and examples, matching registration keys such as `hueRotate` and `filmGrain`. Shader files should use matching names, for example `src/shaders/hueRotate.frag`. GLSL uniforms must be prefixed with `u_`, use `#version 300 es`, and declare `precision highp float;`.

## Testing Guidelines

For a new or changed filter, add or update an example under `examples/<filterName>/sketch.js`. Validate visually with `npm run dev`, then run `npm run check` before submitting. Keep shader defaults, TypeScript option types, README documentation, and examples in sync.

## Commit & Pull Request Guidelines

Commits are checked with Commitlint and should use Conventional Commit types: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:`, or `revert:`. Keep headers under 100 characters.

Pull requests should include a clear summary, linked issues when relevant, and screenshots or GIFs for visual filter changes. Note the validation performed, especially `npm run check` and browser/example coverage.
