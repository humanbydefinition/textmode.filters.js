import 'textmode.js';
import type {} from 'textmode.js/addon';
import type { BuiltInFilterName, BuiltInFilterParameterMap } from '../builtins/catalog';
import type { TextmodeFilterManager } from '../runtime/TextmodeFilterManager';

type FilterArguments<TName extends string> = TName extends BuiltInFilterName
	? [params?: BuiltInFilterParameterMap[TName]]
	: [params?: unknown];

declare module 'textmode.js/addon' {
	interface TextmodifierExtensions {
		filter<TName extends string>(name: TName, ...args: FilterArguments<TName>): void;
		readonly filters: TextmodeFilterManager;
		finalDraw(callback: () => void): void;
	}
}

declare module 'textmode.js' {
	interface TextmodeLayer {
		filter<TName extends string>(name: TName, ...args: FilterArguments<TName>): void;
	}
}

export {};
