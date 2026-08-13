#version 300 es
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
