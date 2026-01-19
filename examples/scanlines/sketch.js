import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	plugins: [createFiltersPlugin()],
});

let img;
let scanCount = 50.0;
let scanOpacity = 0.5;
let scanVertical = 0.0;

const countSlider = document.getElementById('count');
const countValue = document.getElementById('count-value');
const opacitySlider = document.getElementById('opacity');
const opacityValue = document.getElementById('opacity-value');
const verticalCheckbox = document.getElementById('vertical');

countSlider.addEventListener('input', (e) => {
	scanCount = parseFloat(e.target.value);
	countValue.textContent = scanCount.toFixed(0);
});

opacitySlider.addEventListener('input', (e) => {
	scanOpacity = parseFloat(e.target.value);
	opacityValue.textContent = scanOpacity.toFixed(2);
});

verticalCheckbox.addEventListener('change', (e) => {
	scanVertical = e.target.checked ? 1.0 : 0.0;
});

t.setup(async () => {
    // Load a white 1x1 pixel image
	img = await t.loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
});

t.draw(() => {
	t.layers.base.filter('scanlines', {
		count: scanCount,
		opacity: scanOpacity,
		vertical: scanVertical
	});

	t.background(0);
	t.image(img);
});
