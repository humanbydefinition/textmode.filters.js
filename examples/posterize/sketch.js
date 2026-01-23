import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
    canvas: document.getElementById('textmode-canvas'),
    fontSize: 8,
    plugins: [createFiltersPlugin()],
});

let video;
let levels = 4.0;

const levelsSlider = document.getElementById('levels');
const levelsValue = document.getElementById('levels-value');

levelsSlider.addEventListener('input', (e) => {
    levels = parseFloat(e.target.value);
    levelsValue.textContent = levels;
});

t.setup(async () => {
    video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    video.play();
    video.loop();
    video.characters(" .:-=+*#%@");
});

t.draw(() => {
    t.layers.base.filter('posterize', {
        levels: levels
    });

    t.background(0);
    t.image(video);
});
