import * as textmodeModule from 'textmode.js';
import * as filtersModule from 'textmode.filters.js';

const validSegment = /^[A-Za-z0-9_.-]+$/;

function resolveExamplePath(params) {
	const rawPath = params.get('path');
	const group = params.get('group');
	const entry = params.get('entry');

	if (rawPath) {
		return rawPath;
	}

	if (group && entry) {
		return `${group}/${entry}`;
	}

	return null;
}

function isValidPath(examplePath) {
	const segments = examplePath.split('/');
	return (
		segments.length > 0 &&
		segments.every(
			(segment) => segment.length > 0 && segment !== '.' && segment !== '..' && validSegment.test(segment)
		)
	);
}

function showError(message) {
	document.body.innerHTML = `
		<div style="padding: 1rem; color: #e4e4e7; background: #09090b; min-height: 100vh; box-sizing: border-box;">
			<p style="margin: 0; font-size: 0.9rem;">${message}</p>
		</div>
	`;
}

const params = new URLSearchParams(window.location.search);
const examplePath = resolveExamplePath(params);

if (!examplePath || !isValidPath(examplePath)) {
	showError('Invalid example path.');
} else {
	window.textmode = textmodeModule.textmode;
	window.TextmodeErrorLevel = textmodeModule.TextmodeErrorLevel;
	window.LayerBlendMode = textmodeModule.LayerBlendMode;
	window.FiltersPlugin = filtersModule.FiltersPlugin;

	window.__TEXTMODE_FILTERS_EXAMPLE_PATH__ = examplePath;

	document.title = `textmode.filters.js - ${examplePath}`;
	const base = document.createElement('base');
	base.href = `./${examplePath}/`;
	document.head.appendChild(base);

	const script = document.createElement('script');
	script.type = 'module';
	script.src = './sketch.js';
	script.onerror = () => showError(`Unable to load ${examplePath}.`);
	document.body.appendChild(script);
}
