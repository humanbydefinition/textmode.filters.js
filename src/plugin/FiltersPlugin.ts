import type { TextmodeLayer, TextmodePlugin, TextmodePluginContext, Textmodifier } from 'textmode.js';
import { TextmodeFilterManager } from '../runtime/TextmodeFilterManager';
import packageMetadata from '../../package.json';

const managers = new WeakMap<Textmodifier, TextmodeFilterManager>();

/**
 * GPU-accelerated filters plugin. Installing it adds the complete 18-filter workflow to one Textmodifier.
 *
 * @category Workflow
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/variables/FiltersPlugin | FiltersPlugin API reference}
 */
export const FiltersPlugin: TextmodePlugin = {
	name: packageMetadata.name,
	version: packageMetadata.version,

	install(textmodifier, context) {
		const previous = managers.get(textmodifier);
		if (previous) previous.dispose();
		const manager = new TextmodeFilterManager(textmodifier);
		managers.set(textmodifier, manager);
		installAdapters(context, manager);
	},

	uninstall(textmodifier) {
		managers.get(textmodifier)?.dispose();
		managers.delete(textmodifier);
	},
};

function installAdapters(context: TextmodePluginContext, manager: TextmodeFilterManager): void {
	context.on('preSetup', () => manager.initializeBuiltins());
	context.defineExtension('textmodifier', 'filter', {
		value: (_name: string, _params?: unknown) => manager.queueComposite(_name, _params),
	});
	context.defineExtension('textmodifier', 'filters', { get: () => manager });
	context.defineExtension('textmodifier', 'finalDraw', {
		value: (callback: () => void) => {
			manager.setFinalDrawCallback(callback);
		},
	});
	context.defineExtension('layerManager', 'filters', { get: () => manager });

	const queueLayer = manager.queueLayer.bind(manager);
	context.defineExtension('layer', 'filter', {
		value(this: TextmodeLayer, name: string, params?: unknown) {
			queueLayer(this, name, params);
		},
	});

	context.on('layerDisposed', (layer) => manager.disposeLayer(layer));
	context.on('layerOutput', ({ layer, phase, output }) => manager.transformLayer(layer, phase, output));
	context.on('compositeOutput', (output) => manager.transformComposite(output));
	context.on('preDraw', () => manager.beginFrame());
	context.on('postDraw', () => manager.endFrame());
}
