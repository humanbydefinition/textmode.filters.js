import { textmode } from 'textmode.js';
import { FiltersPlugin } from 'textmode.filters.js';

const t = textmode.create({
    canvas: document.getElementById('textmode-canvas'),
    fontSize: 32,
    plugins: [FiltersPlugin],
});

let video;
let curvature = 0.5;
let scanSpeed = 1.0;

const curvatureSlider = document.getElementById('curvature');
const curvatureValue = document.getElementById('curvature-value');
const scanSpeedSlider = document.getElementById('scanSpeed');
const scanSpeedValue = document.getElementById('scanSpeed-value');

curvatureSlider.addEventListener('input', (e) => {
    curvature = parseFloat(e.target.value);
    curvatureValue.textContent = curvature.toFixed(2);
});

scanSpeedSlider.addEventListener('input', (e) => {
    scanSpeed = parseFloat(e.target.value);
    scanSpeedValue.textContent = scanSpeed.toFixed(1);
});

t.setup(async () => {
    video = await t.loadVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    video.play();
    video.loop();
    video.characters(" .:-=+*#%@");
});

t.draw(() => {
    t.layers.base.filter('crtMattias', {
        curvature: curvature,
        scanSpeed: scanSpeed,
        time: t.secs
    });

    t.background(0);
    t.image(video);
});
