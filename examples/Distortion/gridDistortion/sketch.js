/**
 * @title FiltersPlugin.gridDistortion
 */
const t = textmode.create({
	width: window.innerWidth,
	height: window.innerHeight,
	fontSize: window.innerWidth < 700 ? 8 : 16,
	plugins: [FiltersPlugin],
});
const labelLayer = t.layers.add({ fontSize: window.innerWidth < 700 ? 8 : 16 });
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

function drawLabel(lines) {
	const { cols, rows } = labelLayer.grid;
	const [left, top] = [-Math.floor(cols / 2), -Math.floor(rows / 2)];
	const width = Math.max(...lines.map(([text]) => [...text].length)) + 2;
	t.push();
	t.translate(left + (width + 4) / 2, top + (lines.length + 5) / 2);
	t.char(' ');
	t.charColor(6, 10, 22);
	t.cellColor(6, 10, 22);
	t.rect(width, lines.length + 2);
	t.pop();
	t.printAlign('left', 'top');
	lines.forEach(([text, color], i) => {
		t.charColor(color[0], color[1], color[2]);
		t.print(text, left + 3, top + 3 + i);
	});
}

t.setup(async () => {
	video = await t.loadVideo('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
	video.play();
	video.loop();
	video.characters(' .:-=+*#%@');
});

labelLayer.draw(() => {
	t.clear();
	const wVar = (0.5 + 0.3 * Math.sin(t.secs * 1.0)).toFixed(2);
	const hVar = (0.5 + 0.3 * Math.cos(t.secs * 1.5)).toFixed(2);
	drawLabel([
		['FILTERSPLUGIN.GRIDDISTORTION', [120, 240, 180]],
		['------------------------------------', [70, 100, 140]],
		['CONCEPT: COORDINATE SPACE WARPING', [140, 210, 255]],
		['Warp grid columns and rows.', [140, 160, 190]],
		['------------------------------------', [70, 100, 140]],
		[`WIDTH/HEIGHT: ${wVar}/${hVar}`, [140, 255, 200]],
	]);
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
	const size = window.innerWidth < 700 ? 8 : 16;
	t.fontSize(size);
	for (const layer of t.layers.all) layer.fontSize(size);
});
