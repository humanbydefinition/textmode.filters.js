import type { TextmodeLayer, TextmodePlugin, TextmodePluginContext } from 'textmode.js';
import { TextmodeFilterManager } from '../runtime/TextmodeFilterManager';
import packageMetadata from '../../package.json';

/**
 * GPU-accelerated filters plugin. Installing it adds the complete 18-filter workflow to one Textmodifier.
 *
 * @category Workflow
 *
 * @see {@link https://code.textmode.art/api/textmode.filters.js/variables/FiltersPlugin | FiltersPlugin API reference}
 */
export const FiltersPlugin: TextmodePlugin = {
	name: packageMetadata.name,

	install(textmodifier, context) {
		const manager = new TextmodeFilterManager(textmodifier);
		try {
			installAdapters(context, manager);
		} catch (error) {
			manager.dispose();
			throw error;
		}
		return () => manager.dispose();
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
