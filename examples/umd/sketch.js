const filtersPlugin = createFiltersPlugin();

const t = textmode.create({
	canvas: document.getElementById('textmode-canvas'),
	fontSize: 8,
	frameRate: 60,
	plugins: [filtersPlugin],
});

let video;

t.setup(async () => {
	video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
	video.play();
	video.loop();

	video.invert(false);
	video.flipX(false);
	video.flipY(false);
	video.charRotation(0);
	video.charColorMode('sampled');
	video.cellColorMode('fixed');
	video.characters(" .:-=+*#%@");

	console.log("Plugins:", t.plugins);
});

t.draw(() => {
	t.layers.base.filter('brightness', { amount: Math.sin(t.frameCount * 0.1) });

	t.background(0);
	t.image(video);
});