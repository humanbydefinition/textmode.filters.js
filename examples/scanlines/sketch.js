import { textmode } from 'textmode.js';
import { createFiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
    canvas: document.getElementById('textmode-canvas'),
    fontSize: 16,
    plugins: [createFiltersPlugin()],
});

let video;
let count = 300;
let intensity = 0.5;
let speed = 1.0;

const countSlider = document.getElementById('count');
const countValue = document.getElementById('count-value');
const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');

countSlider.addEventListener('input', (e) => {
    count = parseFloat(e.target.value);
    countValue.textContent = count;
});

intensitySlider.addEventListener('input', (e) => {
    intensity = parseFloat(e.target.value);
    intensityValue.textContent = intensity.toFixed(2);
});

speedSlider.addEventListener('input', (e) => {
    speed = parseFloat(e.target.value);
    speedValue.textContent = speed.toFixed(1);
});

t.setup(async () => {
    video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    video.play();
    video.loop();
    video.characters(" .:-=+*#%@");
});

t.draw(() => {
    t.layers.base.filter('scanlines', {
        count: count,
        intensity: intensity,
        speed: speed,
        time: t.secs
    });

    t.background(0);
    t.image(video);
});
