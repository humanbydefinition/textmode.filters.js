import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = resolve(process.cwd(), 'src');

interface ImportEdge {
	readonly from: string;
	readonly to: string;
	readonly typeOnly: boolean;
	readonly specifier: string;
}

function sourceFiles(directory: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(directory)) {
		const entryPath = resolve(directory, entry);
		if (statSync(entryPath).isDirectory()) {
			files.push(...sourceFiles(entryPath));
		} else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
			files.push(entryPath);
		}
	}
	return files;
}

function relativeToRoot(file: string): string {
	return relative(ROOT, file).split(sep).join('/');
}

function areaOf(file: string): string {
	const first = relativeToRoot(file).split('/')[0];
	return first === 'builtins' || first === 'runtime' || first === 'public' || first === 'plugin' ? first : 'root';
}

function importsFrom(code: string, file: string): ImportEdge[] {
	const edges: ImportEdge[] = [];
	const pattern = /(?:^|\n)(import|export)([^'"]*?)from\s*['"]([^'"]+)['"]/g;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(code)) !== null) {
		const specifier = match[3]!;
		if (!specifier.startsWith('.')) continue;
		const typeOnly = /(?:^|[^$\w])(?:type\b)/.test(match[2]!);
		edges.push({ from: file, to: resolve(dirname(file), specifier), typeOnly, specifier });
	}
	return edges;
}

function collectEdges(): ImportEdge[] {
	const edges: ImportEdge[] = [];
	for (const file of sourceFiles(ROOT)) {
		edges.push(...importsFrom(readFileSync(file, 'utf8'), file));
	}
	return edges;
}

describe('source import boundaries', () => {
	const edges = collectEdges();
	const srcEdges = edges.filter((edge) => edge.to.startsWith(ROOT));

	it('never imports the package root from an internal module', () => {
		for (const edge of edges) {
			expect(relativeToRoot(edge.to), `${edge.from} imports the package root`).not.toBe('index.ts');
		}
	});

	it('keeps built-ins free of runtime, plugin, and public dependencies', () => {
		for (const edge of srcEdges) {
			if (areaOf(edge.from) !== 'builtins') continue;
			const toArea = areaOf(edge.to);
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('runtime');
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('plugin');
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('public');
		}
	});

	it('keeps runtime modules free of plugin, package-root, and value-level public dependencies', () => {
		for (const edge of srcEdges) {
			if (areaOf(edge.from) !== 'runtime') continue;
			const toArea = areaOf(edge.to);
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('plugin');
			if (toArea === 'public') {
				expect(edge.typeOnly, `${edge.from} value-imports public ${edge.specifier}`).toBe(true);
			}
		}
	});

	it('keeps public modules limited to built-in types and the manager type', () => {
		for (const edge of srcEdges) {
			if (areaOf(edge.from) !== 'public') continue;
			const toArea = areaOf(edge.to);
			if (toArea === 'builtins') continue;
			if (
				toArea === 'runtime' &&
				edge.typeOnly &&
				relativeToRoot(edge.to).replace(/\.ts$/, '').endsWith('runtime/TextmodeFilterManager')
			) {
				continue;
			}
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('plugin');
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('runtime');
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('root');
		}
	});

	it('keeps plugin modules limited to runtime and host dependencies', () => {
		for (const edge of srcEdges) {
			if (areaOf(edge.from) !== 'plugin') continue;
			const toArea = areaOf(edge.to);
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('public');
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('builtins');
			expect(toArea, `${edge.from} imports ${edge.specifier}`).not.toBe('root');
		}
	});

	it('keeps production source free of tests and tooling', () => {
		for (const edge of edges) {
			const to = relativeToRoot(edge.to);
			expect(to, `${edge.from} imports ${edge.specifier}`).not.toMatch(/^(?:\.\.\/)*(?:tests|vite-plugins)\b/);
		}
	});

	it('has no circular source imports', () => {
		const byFile = new Map<string, string[]>();
		for (const edge of srcEdges) {
			if (extname(edge.to) === '.frag' || extname(edge.to) === '.vert') continue;
			const list = byFile.get(edge.from) ?? [];
			list.push(edge.to);
			byFile.set(edge.from, list);
		}

		const visiting = new Set<string>();
		const visited = new Set<string>();
		const path: string[] = [];

		const visit = (file: string): void => {
			if (visiting.has(file)) {
				const start = path.indexOf(file);
				throw new Error(`Circular import: ${path.slice(start).map(relativeToRoot).join(' -> ')}`);
			}
			if (visited.has(file)) return;
			visiting.add(file);
			path.push(file);
			for (const target of byFile.get(file) ?? []) {
				visit(target);
			}
			path.pop();
			visiting.delete(file);
			visited.add(file);
		};

		for (const file of sourceFiles(ROOT)) {
			visit(file);
		}
		expect(srcEdges.length).toBeGreaterThan(0);
	});
});
