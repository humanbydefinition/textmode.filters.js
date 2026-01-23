#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;  // Saturation multiplier (0.0 = grayscale, 1.0 = normal, >1.0 = vivid)

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
    
    // Adjust saturation
    hsl.y = clamp(hsl.y * u_amount, 0.0, 1.0);
    
    // Convert back to RGB
    vec3 result = hsl2rgb(hsl);
    
    fragColor = vec4(result, color.a);
}
