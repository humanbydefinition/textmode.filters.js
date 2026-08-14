import { describe, expect, it } from 'vitest';
import type { TextmodeLayer } from 'textmode.js';

import { FilterScheduler } from '../../src/runtime/FilterScheduler';

function layer(): TextmodeLayer {
	return {} as TextmodeLayer;
}

describe('FilterScheduler', () => {
	it('queues between-frame calls into the next frame token', () => {
		const scheduler = new FilterScheduler();
		const current = layer();

		scheduler.queueLayer(current, 'invert', undefined);

		scheduler.beginFrame();
		const drained = scheduler.drainLayerDraw(current);
		expect(drained).toHaveLength(1);
		expect(drained[0]!.name).toBe('invert');
	});

	it('drops entries from an interrupted frame and keeps later entries', () => {
		const scheduler = new FilterScheduler();
		const current = layer();

		scheduler.beginFrame();
		scheduler.queueLayer(current, 'first', undefined);
		scheduler.endFrame();

		scheduler.beginFrame();
		expect(scheduler.drainLayerDraw(current)).toHaveLength(0);
		scheduler.queueLayer(current, 'second', undefined);
		expect(scheduler.drainLayerDraw(current).map((entry) => entry.name)).toEqual(['second']);
	});

	it('routes layer filters by phase and resets the phase after finalized output', () => {
		const scheduler = new FilterScheduler();
		const current = layer();

		scheduler.beginFrame();
		scheduler.queueLayer(current, 'drawFilter', undefined);
		expect(scheduler.drainLayerDraw(current).map((entry) => entry.name)).toEqual(['drawFilter']);
		scheduler.setLayerPhase(current, 'postDraw');

		scheduler.queueLayer(current, 'postFilter', undefined);
		expect(scheduler.drainLayerPostDraw(current).map((entry) => entry.name)).toEqual(['postFilter']);
		scheduler.setLayerPhase(current, 'draw');

		scheduler.queueLayer(current, 'nextDraw', undefined);
		expect(scheduler.drainLayerDraw(current).map((entry) => entry.name)).toEqual(['nextDraw']);
	});

	it('keeps multiple layers fully independent', () => {
		const scheduler = new FilterScheduler();
		const first = layer();
		const second = layer();

		scheduler.beginFrame();
		scheduler.queueLayer(first, 'invert', undefined);
		scheduler.queueLayer(second, 'sepia', undefined);

		expect(scheduler.drainLayerDraw(first).map((entry) => entry.name)).toEqual(['invert']);
		expect(scheduler.drainLayerDraw(second).map((entry) => entry.name)).toEqual(['sepia']);
	});

	it('routes composite filters to the final queue only while final draw is active', () => {
		const scheduler = new FilterScheduler();

		scheduler.beginFrame();
		scheduler.queueComposite('global', undefined);
		expect(scheduler.drainGlobal().map((entry) => entry.name)).toEqual(['global']);

		scheduler.beginFinalDraw();
		scheduler.queueComposite('duringFinal', undefined);
		scheduler.endFinalDraw();
		expect(scheduler.drainGlobal()).toHaveLength(0);
		expect(scheduler.drainFinal().map((entry) => entry.name)).toEqual(['duringFinal']);
	});

	it('retains insertion order when draining', () => {
		const scheduler = new FilterScheduler();
		const current = layer();

		scheduler.beginFrame();
		scheduler.queueLayer(current, 'a', undefined);
		scheduler.queueLayer(current, 'b', undefined);
		scheduler.queueLayer(current, 'c', undefined);

		expect(scheduler.drainLayerDraw(current).map((entry) => entry.name)).toEqual(['a', 'b', 'c']);
	});

	it('releases layer state on disposal', () => {
		const scheduler = new FilterScheduler();
		const current = layer();

		scheduler.beginFrame();
		scheduler.queueLayer(current, 'invert', undefined);
		scheduler.disposeLayer(current);

		scheduler.beginFrame();
		scheduler.queueLayer(current, 'sepia', undefined);
		expect(scheduler.drainLayerDraw(current).map((entry) => entry.name)).toEqual(['sepia']);
	});

	it('clears all queues and frame state on dispose', () => {
		const scheduler = new FilterScheduler();
		const current = layer();

		scheduler.beginFrame();
		scheduler.queueLayer(current, 'invert', undefined);
		scheduler.queueComposite('sepia', undefined);
		scheduler.dispose();

		scheduler.beginFrame();
		expect(scheduler.drainLayerDraw(current)).toHaveLength(0);
		expect(scheduler.drainGlobal()).toHaveLength(0);
	});
});
