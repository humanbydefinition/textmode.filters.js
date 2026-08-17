import { describe, expect, it } from 'vitest';

import { BUILTIN_CATALOG } from '../../src/builtins/catalog';
import type { BuiltInFilterName, BuiltInFilterParameterMap } from '../../src/builtins/catalog';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

// Compile-time contract: the catalog keys are exactly the parameter map keys.
type _ExactCatalogKeys = Equal<keyof typeof BUILTIN_CATALOG, BuiltInFilterName>;
type _ParameterCount = keyof BuiltInFilterParameterMap extends keyof typeof BUILTIN_CATALOG ? true : never;
const _exactKeys: _ExactCatalogKeys extends true ? true : never = true;
const _parameterCount: _ParameterCount = true;
void _exactKeys;
void _parameterCount;

describe('built-in catalog contract', () => {
	it('ships exactly the documented 18 built-in filters', () => {
		const ids = Object.keys(BUILTIN_CATALOG);
		expect(ids).toHaveLength(18);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('keys the catalog by each descriptor id and freezes the entries', () => {
		for (const [id, descriptor] of Object.entries(BUILTIN_CATALOG)) {
			expect(descriptor.id).toBe(id);
			expect(descriptor.source.length).toBeGreaterThan(0);
		}
		expect(Object.isFrozen(BUILTIN_CATALOG)).toBe(true);
	});

	it('declares an explicit primary shorthand that is one of the filter parameters', () => {
		for (const [id, descriptor] of Object.entries(BUILTIN_CATALOG)) {
			const parameters = descriptor.uniforms.map((binding) => binding[1]);
			if (descriptor.uniforms.length === 0) {
				expect(descriptor.primary, `${id} should have no primary`).toBeUndefined();
			} else {
				expect(descriptor.primary, `${id} requires an explicit primary`).toBeDefined();
				expect(parameters).toContain(descriptor.primary);
			}
		}
	});

	it('keeps defaults freshly owned and never shares mutable array literals', () => {
		const defaults = new Set<unknown>();
		for (const descriptor of Object.values(BUILTIN_CATALOG)) {
			for (const binding of descriptor.uniforms) {
				if (Array.isArray(binding[2])) {
					expect(defaults.has(binding[2]), `${descriptor.id} reuses a shared array default`).toBe(false);
					defaults.add(binding[2]);
				}
			}
		}
	});
});
