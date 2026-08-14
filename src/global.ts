import type { TextmodePlugin } from 'textmode.js';
import { FiltersPlugin } from './plugin/FiltersPlugin';

declare global {
	interface Window {
		FiltersPlugin?: TextmodePlugin;
	}
}

if (typeof window !== 'undefined') window.FiltersPlugin = FiltersPlugin;
