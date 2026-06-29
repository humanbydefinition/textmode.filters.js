/**
 * @title FiltersPlugin.gridDistortion
 */

const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: 8,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add();

let video;

// Sine wave parameters
const config = {
	widthFrequency: 0.05,
	widthSpeed: 0.05,
	widthAmplitude: 1.0,
	heightFrequency: 0.1,
	heightSpeed: 0.03,
	heightAmplitude: 1.0,
};

function drawText(text, x, y, r = 220, g = 230, b = 255) {
	t.push();
	t.printAlign('left', 'top');
	t.charColor(r, g, b);
	t.print(text, x, y);
	t.pop();
}

t.setup(async () => {
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

labelLayer.draw(() => {
	t.clear();
	const left = -Math.floor(t.grid.cols / 2),
		top = -Math.floor(t.grid.rows / 2);
	let y = top + 3,
		x = left + 3;

	const wVar = (0.5 + 0.3 * Math.sin(t.secs * 1.0)).toFixed(2);
	const hVar = (0.5 + 0.3 * Math.cos(t.secs * 1.5)).toFixed(2);

	drawText('FILTERSPLUGIN.GRIDDISTORTION', x, y++, 100, 255, 140);
	drawText('------------------------------------', x, y++, 80, 100, 150);
	drawText('CONCEPT: COORDINATE SPACE WARPING', x, y++, 100, 220, 255);
	drawText('Warp grid columns and rows.', x, y++, 140, 160, 190);
	drawText('------------------------------------', x, y++, 80, 100, 150);
	drawText('Width Var: ' + wVar, x, y++, 140, 255, 180);
	drawText('Height Var: ' + hVar, x, y++, 140, 255, 180);
});

t.draw(() => {
	if (!video) return;

	const cols = t.grid.cols;
	const rows = t.grid.rows;
	const wVar = 0.5 + 0.3 * Math.sin(t.secs * 1.0);
	const hVar = 0.5 + 0.3 * Math.cos(t.secs * 1.5);

	// Generate sine wave pattern for width factors
	const widthFactors = [];
	for (let i = 0; i < cols; i++) {
		const sineValue = Math.sin(i * config.widthFrequency + t.secs * 60 * config.widthSpeed) * config.widthAmplitude;
		widthFactors.push((sineValue + config.widthAmplitude) / (2 * config.widthAmplitude));
	}

	// Generate sine wave pattern for height factors
	const heightFactors = [];
	for (let j = 0; j < rows; j++) {
		const sineValue =
			Math.sin(j * config.heightFrequency + t.secs * 60 * config.heightSpeed) * config.heightAmplitude;
		heightFactors.push((sineValue + config.heightAmplitude) / (2 * config.heightAmplitude));
	}

	// Apply grid distortion filter
	t.layers.base.filter('gridDistortion', {
		gridCellDimensions: [cols, rows],
		gridPixelDimensions: [t.grid.width, t.grid.height],
		gridOffsetDimensions: [t.grid.offsetX, t.grid.offsetY],
		widthFactors: widthFactors,
		heightFactors: heightFactors,
		widthVariationScale: wVar,
		heightVariationScale: hVar,
	});

	t.image(video, t.grid.cols, t.grid.rows);
});

t.windowResized(() => {
	t.resizeCanvas(window.innerWidth, window.innerHeight);
});
