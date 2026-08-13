#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_amount;      // Intensity of darkening (0.0 = none, 1.0 = strong)
uniform float u_softness;    // Falloff softness (0.0 = hard edge, 1.0 = very soft)
uniform float u_roundness;   // Shape: 0.0 = more rectangular, 1.0 = circular

in vec2 v_uv;
out vec4 fragColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    
    // Center the UV coordinates (-1 to 1 range)
    vec2 uv = v_uv * 2.0 - 1.0;
    
    // Adjust for aspect ratio to maintain roundness
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    // Calculate distance from center
    // Mix between rectangular (max of abs) and circular (length) based on roundness
    float distRect = max(abs(uv.x), abs(uv.y));
    float distCircle = length(uv);
    float dist = mix(distRect, distCircle, u_roundness);
    
    // Normalize distance based on aspect ratio
    float maxDist = mix(max(aspect, 1.0), length(vec2(aspect, 1.0)), u_roundness);
    dist /= maxDist;
    
    // Calculate vignette with softness control
    // softness controls the falloff gradient width
    float vignetteStart = 1.0 - u_amount;
    float vignetteEnd = vignetteStart + u_softness * 0.5 + 0.01; // +0.01 to avoid division issues
    
    float vignette = 1.0 - smoothstep(vignetteStart, vignetteEnd, dist);
    
    // Apply vignette to color
    vec3 result = color.rgb * vignette;
    
    fragColor = vec4(result, color.a);
}
