import type { TextmodeLayer } from 'textmode.js';

import type { QueuedFilterRequest } from './types';

interface LayerState {
	phase: 'draw' | 'postDraw';
	drawQueue: QueuedFilterRequest[];
	postQueue: QueuedFilterRequest[];
}

/**
 * Pure frame and scope scheduling policy for filter queues.
 *
 * Owns frame tokens, layer phases, and the four queue scopes (layer draw, layer post-draw, global,
 * and final). It never sees shaders, framebuffers, WebGL, or the registry: its values are filter
 * names, unknown parameters, layer identity, phases, and frame tokens.
 */
export class FilterScheduler {
	private _frameToken = 0;
	private _frameOpen = false;
	private _finalDrawActive = false;
	private _globalQueue: QueuedFilterRequest[] = [];
	private _finalQueue: QueuedFilterRequest[] = [];
	private _layerStates = new WeakMap<TextmodeLayer, LayerState>();
	private _layers = new Set<TextmodeLayer>();

	public beginFrame(): void {
		this._frameToken += 1;
		for (const layer of this._layers) {
			const state = this._layerStates.get(layer);
			if (state) state.phase = 'draw';
		}
		this._frameOpen = true;
	}

	public endFrame(): void {
		this._frameOpen = false;
	}

	public queueLayer(layer: TextmodeLayer, name: string, params: unknown): void {
		const state = this._stateFor(layer);
		(state.phase === 'postDraw' ? state.postQueue : state.drawQueue).push({
			name,
			params,
			frameToken: this._queueFrameToken(),
		});
	}

	public queueComposite(name: string, params: unknown): void {
		(this._finalDrawActive ? this._finalQueue : this._globalQueue).push({
			name,
			params,
			frameToken: this._queueFrameToken(),
		});
	}

	public drainLayerDraw(layer: TextmodeLayer): QueuedFilterRequest[] {
		return this._drain(this._stateFor(layer).drawQueue);
	}

	public drainLayerPostDraw(layer: TextmodeLayer): QueuedFilterRequest[] {
		return this._drain(this._stateFor(layer).postQueue);
	}

	public setLayerPhase(layer: TextmodeLayer, phase: 'draw' | 'postDraw'): void {
		this._stateFor(layer).phase = phase;
	}

	public drainGlobal(): QueuedFilterRequest[] {
		return this._drain(this._globalQueue);
	}

	public beginFinalDraw(): void {
		this._finalDrawActive = true;
	}

	public endFinalDraw(): void {
		this._finalDrawActive = false;
	}

	public drainFinal(): QueuedFilterRequest[] {
		return this._drain(this._finalQueue);
	}

	public resetComposite(): void {
		this._globalQueue = [];
		this._finalQueue = [];
		this._finalDrawActive = false;
	}

	public disposeLayer(layer: TextmodeLayer): void {
		this._layerStates.delete(layer);
		this._layers.delete(layer);
	}

	public dispose(): void {
		this._globalQueue = [];
		this._finalQueue = [];
		this._layerStates = new WeakMap();
		this._layers.clear();
		this._frameOpen = false;
		this._finalDrawActive = false;
	}

	private _drain(queue: QueuedFilterRequest[]): QueuedFilterRequest[] {
		const token = this._frameToken;
		const drained: QueuedFilterRequest[] = [];
		const retained: QueuedFilterRequest[] = [];
		for (const entry of queue) {
			if (entry.frameToken === token) drained.push(entry);
			else if (entry.frameToken > token) retained.push(entry);
		}
		queue.length = 0;
		queue.push(...retained);
		return drained;
	}

	private _stateFor(layer: TextmodeLayer): LayerState {
		let state = this._layerStates.get(layer);
		if (!state) {
			state = { phase: 'draw', drawQueue: [], postQueue: [] };
			this._layerStates.set(layer, state);
			this._layers.add(layer);
		}
		return state;
	}

	private _queueFrameToken(): number {
		return this._frameOpen ? this._frameToken : this._frameToken + 1;
	}
}
