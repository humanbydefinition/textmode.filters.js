const n = () => ({ name: "textmode.filters", version: "1.0.0", async install(r) {
  r.filters.register("brightness", `#version 300 es\r
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_resolution;\r
uniform float u_amount;\r
\r
in vec2 v_uv;\r
out vec4 fragColor;\r
\r
void main() {\r
    vec4 color = texture(u_texture, v_uv);\r
    \r
    // Multiply RGB by brightness amount\r
    vec3 result = color.rgb * u_amount;\r
    \r
    fragColor = vec4(result, color.a);\r
}`, { u_amount: ["amount", 1] }), r.filters.register("contrast", `#version 300 es\r
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_resolution;\r
uniform float u_amount;\r
\r
in vec2 v_uv;\r
out vec4 fragColor;\r
\r
void main() {\r
    vec4 color = texture(u_texture, v_uv);\r
    \r
    // Adjust contrast around midpoint (0.5)\r
    vec3 result = (color.rgb - 0.5) * u_amount + 0.5;\r
    \r
    fragColor = vec4(result, color.a);\r
}`, { u_amount: ["amount", 1] }), r.filters.register("hueRotate", `#version 300 es\r
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_resolution;\r
uniform float u_angle;\r
\r
in vec2 v_uv;\r
out vec4 fragColor;\r
\r
// Helper function for HSL to RGB conversion\r
float hue2rgb(float p, float q, float t) {\r
    if (t < 0.0) t += 1.0;\r
    if (t > 1.0) t -= 1.0;\r
    if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;\r
    if (t < 1.0 / 2.0) return q;\r
    if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;\r
    return p;\r
}\r
\r
// Convert RGB to HSL\r
vec3 rgb2hsl(vec3 color) {\r
    float maxC = max(max(color.r, color.g), color.b);\r
    float minC = min(min(color.r, color.g), color.b);\r
    float delta = maxC - minC;\r
    \r
    vec3 hsl = vec3(0.0);\r
    hsl.z = (maxC + minC) / 2.0; // Lightness\r
    \r
    if (delta == 0.0) {\r
        hsl.x = 0.0; // Hue\r
        hsl.y = 0.0; // Saturation\r
    } else {\r
        hsl.y = hsl.z < 0.5 ? delta / (maxC + minC) : delta / (2.0 - maxC - minC); // Saturation\r
        \r
        if (color.r == maxC) {\r
            hsl.x = (color.g - color.b) / delta + (color.g < color.b ? 6.0 : 0.0);\r
        } else if (color.g == maxC) {\r
            hsl.x = (color.b - color.r) / delta + 2.0;\r
        } else {\r
            hsl.x = (color.r - color.g) / delta + 4.0;\r
        }\r
        hsl.x /= 6.0;\r
    }\r
    \r
    return hsl;\r
}\r
\r
// Convert HSL to RGB\r
vec3 hsl2rgb(vec3 hsl) {\r
    float h = hsl.x;\r
    float s = hsl.y;\r
    float l = hsl.z;\r
    \r
    if (s == 0.0) {\r
        return vec3(l);\r
    }\r
    \r
    float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;\r
    float p = 2.0 * l - q;\r
    \r
    float r = hue2rgb(p, q, h + 1.0 / 3.0);\r
    float g = hue2rgb(p, q, h);\r
    float b = hue2rgb(p, q, h - 1.0 / 3.0);\r
    \r
    return vec3(r, g, b);\r
}\r
\r
void main() {\r
    vec4 color = texture(u_texture, v_uv);\r
    \r
    // Convert to HSL\r
    vec3 hsl = rgb2hsl(color.rgb);\r
    \r
    // Rotate hue (angle is in degrees, convert to 0-1 range)\r
    hsl.x = fract(hsl.x + u_angle / 360.0);\r
    \r
    // Convert back to RGB\r
    vec3 result = hsl2rgb(hsl);\r
    \r
    fragColor = vec4(result, color.a);\r
}\r
`, { u_angle: ["angle", 0] }), r.filters.register("glitch", `#version 300 es\r
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_resolution;\r
uniform float u_amount;\r
\r
in vec2 v_uv;\r
out vec4 fragColor;\r
\r
// Random function\r
float random(vec2 co) {\r
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\r
}\r
\r
void main() {\r
    vec2 uv = v_uv;\r
    \r
    // Create glitch effect based on amount\r
    float glitchStrength = u_amount * 0.1;\r
    \r
    // Horizontal displacement\r
    float block = floor(uv.y * 20.0);\r
    float noise = random(vec2(block, floor(u_amount * 100.0)));\r
    \r
    if (noise > 0.7) {\r
        uv.x += (noise - 0.7) * glitchStrength * 2.0;\r
    }\r
    \r
    // RGB channel separation (chromatic aberration)\r
    float separation = glitchStrength * 0.02;\r
    vec2 uvR = uv + vec2(separation, 0.0);\r
    vec2 uvG = uv;\r
    vec2 uvB = uv - vec2(separation, 0.0);\r
    \r
    float r = texture(u_texture, uvR).r;\r
    float g = texture(u_texture, uvG).g;\r
    float b = texture(u_texture, uvB).b;\r
    float a = texture(u_texture, uv).a;\r
    \r
    vec3 color = vec3(r, g, b);\r
    \r
    // Add scanlines\r
    float scanline = sin(uv.y * u_resolution.y * 2.0) * 0.1 * u_amount;\r
    color -= scanline;\r
    \r
    // Add random noise\r
    float noiseAmount = random(uv + fract(u_amount)) * 0.1 * u_amount;\r
    color += noiseAmount;\r
    \r
    fragColor = vec4(color, a);\r
}\r
`, { u_amount: ["amount", 0] }), r.filters.register("chromaticAberration", `#version 300 es\r
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_resolution;\r
uniform float u_amount;\r
uniform vec2 u_direction;\r
\r
in vec2 v_uv;\r
out vec4 fragColor;\r
\r
void main() {\r
    vec2 texelSize = 1.0 / u_resolution;\r
    vec2 offset = u_direction * u_amount * texelSize;\r
    \r
    // Sample each color channel with different offsets\r
    float r = texture(u_texture, v_uv + offset).r;\r
    float g = texture(u_texture, v_uv).g;\r
    float b = texture(u_texture, v_uv - offset).b;\r
    float a = texture(u_texture, v_uv).a;\r
    \r
    fragColor = vec4(r, g, b, a);\r
}\r
`, { u_amount: ["amount", 5], u_direction: ["direction", [1, 0]] }), r.filters.register("pixelate", `#version 300 es\r
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_resolution;\r
uniform float u_pixelSize;\r
\r
in vec2 v_uv;\r
out vec4 fragColor;\r
\r
void main() {\r
    vec2 pixelSize = vec2(u_pixelSize) / u_resolution;\r
    vec2 pixelatedUV = floor(v_uv / pixelSize) * pixelSize + pixelSize * 0.5;\r
    \r
    fragColor = texture(u_texture, pixelatedUV);\r
}\r
`, { u_pixelSize: ["pixelSize", 4] });
}, async uninstall(r) {
  r.filters.unregister("brightness"), r.filters.unregister("contrast"), r.filters.unregister("hueRotate"), r.filters.unregister("glitch"), r.filters.unregister("chromaticAberration"), r.filters.unregister("pixelate");
} });
typeof window < "u" && (window.createFiltersPlugin = n);
export {
  n as createFiltersPlugin
};
