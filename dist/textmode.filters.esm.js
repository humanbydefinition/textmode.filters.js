const e = () => ({ name: "textmode.filters", version: "1.0.0", async install(n) {
  n.filters.register("brightness", `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);

    // Multiply RGB by brightness amount
    vec3 result = color.rgb * u_amount;

    fragColor = vec4(result, color.a);
}`, { u_amount: ["amount", 1] }), n.filters.register("contrast", `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);

    // Adjust contrast around midpoint (0.5)
    vec3 result = (color.rgb - 0.5) * u_amount + 0.5;

    fragColor = vec4(result, color.a);
}`, { u_amount: ["amount", 1] }), n.filters.register("hueRotate", `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_angle;

in vec2 v_uv;
out vec4 fragColor;

// Helper function for HSL to RGB conversion
float hue2rgb(float p, float q, float t) {
    if (t < 0.0) t += 1.0;
    if (t > 1.0) t -= 1.0;
    if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
    if (t < 1.0 / 2.0) return q;
    if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
    return p;
}

// Convert RGB to HSL
vec3 rgb2hsl(vec3 color) {
    float maxC = max(max(color.r, color.g), color.b);
    float minC = min(min(color.r, color.g), color.b);
    float delta = maxC - minC;

    vec3 hsl = vec3(0.0);
    hsl.z = (maxC + minC) / 2.0; // Lightness

    if (delta == 0.0) {
        hsl.x = 0.0; // Hue
        hsl.y = 0.0; // Saturation
    } else {
        hsl.y = hsl.z < 0.5 ? delta / (maxC + minC) : delta / (2.0 - maxC - minC); // Saturation

        if (color.r == maxC) {
            hsl.x = (color.g - color.b) / delta + (color.g < color.b ? 6.0 : 0.0);
        } else if (color.g == maxC) {
            hsl.x = (color.b - color.r) / delta + 2.0;
        } else {
            hsl.x = (color.r - color.g) / delta + 4.0;
        }
        hsl.x /= 6.0;
    }

    return hsl;
}

// Convert HSL to RGB
vec3 hsl2rgb(vec3 hsl) {
    float h = hsl.x;
    float s = hsl.y;
    float l = hsl.z;

    if (s == 0.0) {
        return vec3(l);
    }

    float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    float p = 2.0 * l - q;

    float r = hue2rgb(p, q, h + 1.0 / 3.0);
    float g = hue2rgb(p, q, h);
    float b = hue2rgb(p, q, h - 1.0 / 3.0);

    return vec3(r, g, b);
}

void main() {
    vec4 color = texture(u_texture, v_uv);

    // Convert to HSL
    vec3 hsl = rgb2hsl(color.rgb);

    // Rotate hue (angle is in degrees, convert to 0-1 range)
    hsl.x = fract(hsl.x + u_angle / 360.0);

    // Convert back to RGB
    vec3 result = hsl2rgb(hsl);

    fragColor = vec4(result, color.a);
}
`, { u_angle: ["angle", 0] }), n.filters.register("glitch", `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;

in vec2 v_uv;
out vec4 fragColor;

// Random function
float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_uv;

    // Create glitch effect based on amount
    float glitchStrength = u_amount * 0.1;

    // Horizontal displacement
    float block = floor(uv.y * 20.0);
    float noise = random(vec2(block, floor(u_amount * 100.0)));

    if (noise > 0.7) {
        uv.x += (noise - 0.7) * glitchStrength * 2.0;
    }

    // RGB channel separation (chromatic aberration)
    float separation = glitchStrength * 0.02;
    vec2 uvR = uv + vec2(separation, 0.0);
    vec2 uvG = uv;
    vec2 uvB = uv - vec2(separation, 0.0);

    float r = texture(u_texture, uvR).r;
    float g = texture(u_texture, uvG).g;
    float b = texture(u_texture, uvB).b;
    float a = texture(u_texture, uv).a;

    vec3 color = vec3(r, g, b);

    // Add scanlines
    float scanline = sin(uv.y * u_resolution.y * 2.0) * 0.1 * u_amount;
    color -= scanline;

    // Add random noise
    float noiseAmount = random(uv + fract(u_amount)) * 0.1 * u_amount;
    color += noiseAmount;

    fragColor = vec4(color, a);
}
`, { u_amount: ["amount", 0] }), n.filters.register("chromaticAberration", `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;
uniform vec2 u_direction;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec2 texelSize = 1.0 / u_resolution;
    vec2 offset = u_direction * u_amount * texelSize;

    // Sample each color channel with different offsets
    float r = texture(u_texture, v_uv + offset).r;
    vec4 ga = texture(u_texture, v_uv);
    float g = ga.g;
    float b = texture(u_texture, v_uv - offset).b;
    float a = ga.a;

    fragColor = vec4(r, g, b, a);
}
`, { u_amount: ["amount", 5], u_direction: ["direction", [1, 0]] }), n.filters.register("pixelate", `#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_pixelSize;

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec2 pixelSize = vec2(u_pixelSize) / u_resolution;
    vec2 pixelatedUV = floor(v_uv / pixelSize) * pixelSize + pixelSize * 0.5;

    fragColor = texture(u_texture, pixelatedUV);
}
`, { u_pixelSize: ["pixelSize", 4] });
}, async uninstall(n) {
  n.filters.unregister("brightness"), n.filters.unregister("contrast"), n.filters.unregister("hueRotate"), n.filters.unregister("glitch"), n.filters.unregister("chromaticAberration"), n.filters.unregister("pixelate");
} });
typeof window < "u" && (window.createFiltersPlugin = e);
export {
  e as createFiltersPlugin
};
