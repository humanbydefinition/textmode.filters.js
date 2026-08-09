import type { TextmodePlugin, Textmodifier } from 'textmode.js';
import { TextmodeFilterManager } from './TextmodeFilterManager';
import packageMetadata from '../package.json';

const managers = new WeakMap<Textmodifier, TextmodeFilterManager>();

/**
 * GPU-accelerated filters plugin. Installing it adds the complete 18-filter workflow to one Textmodifier.
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/variables/FiltersPlugin | FiltersPlugin API reference}
 */
export const FiltersPlugin: TextmodePlugin = {
	name: 'textmode.filters',
	version: packageMetadata.version,

	install(textmodifier, context) {
		const previous = managers.get(textmodifier);
		if (previous) previous.dispose();
		managers.set(textmodifier, new TextmodeFilterManager(textmodifier, context));
	},

	uninstall(textmodifier) {
		managers.get(textmodifier)?.dispose();
		managers.delete(textmodifier);
	},
};
