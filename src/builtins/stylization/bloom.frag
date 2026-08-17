#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_threshold;   // Brightness threshold for bloom (0.0 - 1.0)
uniform float u_intensity;   // Bloom glow intensity
uniform float u_radius;      // Blur radius in pixels

in vec2 v_uv;
out vec4 fragColor;

// Calculate luminance of a color
float luminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

// Extract bright areas above threshold
vec3 extractBright(vec3 color, float threshold) {
    float brightness = luminance(color);
    float contribution = max(0.0, brightness - threshold) / max(brightness, 0.001);
    return color * contribution;
}

void main() {
    vec4 originalColor = texture(u_texture, v_uv);
    vec2 texelSize = 1.0 / u_resolution;
    
    // Multi-sample blur for bloom effect
    // Using a 13-tap filter in a cross pattern for efficiency
    vec3 bloom = vec3(0.0);
    float totalWeight = 0.0;
    
    // Gaussian-like weights
    float weights[7];
    weights[0] = 0.227027;
    weights[1] = 0.194594;
    weights[2] = 0.121621;
    weights[3] = 0.054054;
    weights[4] = 0.016216;
    weights[5] = 0.006216;
    weights[6] = 0.002216;
    
    // Sample in horizontal and vertical directions
    for (int i = -6; i <= 6; i++) {
        float weight = weights[abs(i)];
        vec2 offsetH = vec2(float(i) * u_radius * texelSize.x, 0.0);
        vec2 offsetV = vec2(0.0, float(i) * u_radius * texelSize.y);
        
        // Horizontal samples
        vec3 sampleH = texture(u_texture, v_uv + offsetH).rgb;
        bloom += extractBright(sampleH, u_threshold) * weight;
        
        // Vertical samples (skip center to avoid double counting)
        if (i != 0) {
            vec3 sampleV = texture(u_texture, v_uv + offsetV).rgb;
            bloom += extractBright(sampleV, u_threshold) * weight;
            totalWeight += weight;
        }
        
        totalWeight += weight;
    }
    
    // Add diagonal samples for smoother bloom
    float diagWeight = 0.1;
    for (int i = 1; i <= 4; i++) {
        float dist = float(i) * u_radius;
        vec2 offset1 = vec2(dist, dist) * texelSize;
        vec2 offset2 = vec2(dist, -dist) * texelSize;
        
        vec3 s1 = texture(u_texture, v_uv + offset1).rgb;
        vec3 s2 = texture(u_texture, v_uv - offset1).rgb;
        vec3 s3 = texture(u_texture, v_uv + offset2).rgb;
        vec3 s4 = texture(u_texture, v_uv - offset2).rgb;
        
        float w = diagWeight / float(i);
        bloom += extractBright(s1, u_threshold) * w;
        bloom += extractBright(s2, u_threshold) * w;
        bloom += extractBright(s3, u_threshold) * w;
        bloom += extractBright(s4, u_threshold) * w;
        totalWeight += w * 4.0;
    }
    
    bloom /= totalWeight;
    
    // Combine original with bloom
    vec3 result = originalColor.rgb + bloom * u_intensity;
    
    fragColor = vec4(result, originalColor.a);
}
