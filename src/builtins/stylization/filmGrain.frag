#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_intensity;   // Grain strength (0.0 - 1.0)
uniform float u_size;        // Grain particle size (1.0 - 10.0)
uniform float u_speed;       // Animation speed
uniform float u_time;        // Animation time

in vec2 v_uv;
out vec4 fragColor;

// High-quality pseudo-random function
float random(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

// Multi-octave noise for more organic grain
float noise(vec2 coord) {
    vec2 i = floor(coord);
    vec2 f = fract(coord);
    
    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    // Four corners
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    // Bilinear interpolation
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    vec4 color = texture(u_texture, v_uv);
    
    // Calculate grain coordinates with size and time offset
    vec2 grainCoord = v_uv * u_resolution / u_size;
    grainCoord += vec2(u_time * u_speed * 0.1);
    
    // Multi-layer grain for more realistic texture
    float grain1 = noise(grainCoord);
    float grain2 = noise(grainCoord * 2.0 + vec2(100.0));
    float grain3 = noise(grainCoord * 4.0 + vec2(200.0));
    
    // Combine grain layers with different weights
    float grain = grain1 * 0.6 + grain2 * 0.3 + grain3 * 0.1;
    
    // Center grain around 0.5 and scale by intensity
    grain = (grain - 0.5) * u_intensity;
    
    // Apply grain to color
    // Slightly reduce grain in darker areas (film grain is less visible in shadows)
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    float grainAmount = grain * (0.5 + luminance * 0.5);
    
    vec3 result = color.rgb + grainAmount;
    
    fragColor = vec4(result, color.a);
}
