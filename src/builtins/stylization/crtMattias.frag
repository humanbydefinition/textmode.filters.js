#version 300 es
precision highp float;

// CRT Emulation by Mattias
// Original: https://github.com/libretro/glsl-shaders/blob/master/crt/shaders/crt-mattias.glsl
// Adapted for WebGL2 / textmode.filters.js

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_curvature;    // 0.0 - 1.0
uniform float u_scanSpeed;    // Scanline crawl speed

in vec2 v_uv;
out vec4 fragColor;

vec3 sampleTexture(vec2 tc) {
    vec3 s = pow(texture(u_texture, tc).rgb, vec3(2.2));
    return s;
}

vec3 blur(vec2 tc, float offs) {
    vec4 xoffs = offs * vec4(-2.0, -1.0, 1.0, 2.0) / u_resolution.x;
    vec4 yoffs = offs * vec4(-2.0, -1.0, 1.0, 2.0) / u_resolution.y;
    
    vec3 color = vec3(0.0);
    color += sampleTexture(tc + vec2(xoffs.x, yoffs.x)) * 0.00366;
    color += sampleTexture(tc + vec2(xoffs.y, yoffs.x)) * 0.01465;
    color += sampleTexture(tc + vec2(    0.0, yoffs.x)) * 0.02564;
    color += sampleTexture(tc + vec2(xoffs.z, yoffs.x)) * 0.01465;
    color += sampleTexture(tc + vec2(xoffs.w, yoffs.x)) * 0.00366;
    
    color += sampleTexture(tc + vec2(xoffs.x, yoffs.y)) * 0.01465;
    color += sampleTexture(tc + vec2(xoffs.y, yoffs.y)) * 0.05861;
    color += sampleTexture(tc + vec2(    0.0, yoffs.y)) * 0.09524;
    color += sampleTexture(tc + vec2(xoffs.z, yoffs.y)) * 0.05861;
    color += sampleTexture(tc + vec2(xoffs.w, yoffs.y)) * 0.01465;
    
    color += sampleTexture(tc + vec2(xoffs.x, 0.0)) * 0.02564;
    color += sampleTexture(tc + vec2(xoffs.y, 0.0)) * 0.09524;
    color += sampleTexture(tc + vec2(    0.0, 0.0)) * 0.15018;
    color += sampleTexture(tc + vec2(xoffs.z, 0.0)) * 0.09524;
    color += sampleTexture(tc + vec2(xoffs.w, 0.0)) * 0.02564;
    
    color += sampleTexture(tc + vec2(xoffs.x, yoffs.z)) * 0.01465;
    color += sampleTexture(tc + vec2(xoffs.y, yoffs.z)) * 0.05861;
    color += sampleTexture(tc + vec2(    0.0, yoffs.z)) * 0.09524;
    color += sampleTexture(tc + vec2(xoffs.z, yoffs.z)) * 0.05861;
    color += sampleTexture(tc + vec2(xoffs.w, yoffs.z)) * 0.01465;
    
    color += sampleTexture(tc + vec2(xoffs.x, yoffs.w)) * 0.00366;
    color += sampleTexture(tc + vec2(xoffs.y, yoffs.w)) * 0.01465;
    color += sampleTexture(tc + vec2(    0.0, yoffs.w)) * 0.02564;
    color += sampleTexture(tc + vec2(xoffs.z, yoffs.w)) * 0.01465;
    color += sampleTexture(tc + vec2(xoffs.w, yoffs.w)) * 0.00366;

    return color;
}

float rand(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(co.xy, vec2(a, b));
    float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
}

vec2 curve(vec2 uv) {
    uv = (uv - 0.5) * 2.0;
    uv *= 1.1;    
    uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0);
    uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
    uv = (uv / 2.0) + 0.5;
    uv = uv * 0.92 + 0.04;
    return uv;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 q = v_uv;
    vec2 uv = q;
    
    // Apply curvature
    uv = mix(uv, curve(uv), u_curvature);
    
    vec3 col;
    float x = sin(0.1 * u_time + uv.y * 21.0) * sin(0.23 * u_time + uv.y * 29.0) * sin(0.3 + 0.11 * u_time + uv.y * 31.0) * 0.0017;
    float o = 2.0 * mod(fragCoord.y, 2.0) / u_resolution.x;
    x += o;
    
    // RGB channel separation with blur
    col.r = 1.0 * blur(vec2(uv.x + 0.0009, uv.y + 0.0009), 1.2).x + 0.005;
    col.g = 1.0 * blur(vec2(uv.x + 0.000, uv.y - 0.0015), 1.2).y + 0.005;
    col.b = 1.0 * blur(vec2(uv.x - 0.0015, uv.y + 0.000), 1.2).z + 0.005;
    col.r += 0.2 * blur(vec2(uv.x + 0.0009, uv.y + 0.0009), 2.25).x - 0.005;
    col.g += 0.2 * blur(vec2(uv.x + 0.000, uv.y - 0.0015), 1.75).y - 0.005;
    col.b += 0.2 * blur(vec2(uv.x - 0.0015, uv.y + 0.000), 1.25).z - 0.005;
    
    // Ghost/glow effect
    float ghs = 0.05;
    col.r += ghs * (1.0 - 0.299) * blur(0.75 * vec2(0.01, -0.027) + vec2(uv.x + 0.001, uv.y + 0.001), 7.0).x;
    col.g += ghs * (1.0 - 0.587) * blur(0.75 * vec2(-0.022, -0.02) + vec2(uv.x + 0.000, uv.y - 0.002), 5.0).y;
    col.b += ghs * (1.0 - 0.114) * blur(0.75 * vec2(-0.02, -0.0) + vec2(uv.x - 0.002, uv.y + 0.000), 3.0).z;
    
    // Color processing
    col = clamp(col * 0.4 + 0.6 * col * col * 1.0, 0.0, 1.0);
    
    // Vignette
    float vig = (0.0 + 1.0 * 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y));
    vig = pow(vig, 0.3);
    col *= vec3(vig);

    // Color tint
    col *= vec3(0.95, 1.05, 0.95);
    col = mix(col, col * col, 0.3) * 3.8;

    // Scanlines
    float scans = clamp(0.35 + 0.15 * sin(3.5 * (u_time * u_scanSpeed) + uv.y * u_resolution.y * 1.5), 0.0, 1.0);
    float s = pow(scans, 0.9);
    col = col * vec3(s);

    // Flicker
    col *= 1.0 + 0.0015 * sin(300.0 * u_time);
    
    // Vertical line pattern
    col *= 1.0 - 0.15 * vec3(clamp((mod(fragCoord.x + o, 2.0) - 1.0) * 2.0, 0.0, 1.0));
    
    // Noise
    col *= vec3(1.0) - 0.25 * vec3(rand(uv + 0.0001 * u_time), rand(uv + 0.0001 * u_time + 0.3), rand(uv + 0.0001 * u_time + 0.5));
    
    // Gamma correction
    col = pow(col, vec3(0.45));

    // Black out areas outside the curved screen
    if (uv.x < 0.0 || uv.x > 1.0)
        col *= 0.0;
    if (uv.y < 0.0 || uv.y > 1.0)
        col *= 0.0;

    fragColor = vec4(col, 1.0);
}
