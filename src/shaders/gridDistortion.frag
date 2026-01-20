#version 300 es
precision mediump float;

// Input from vertex shader
in vec2 v_uv;

// Output color
out vec4 fragColor;

// Input texture
uniform sampler2D u_texture;

// Grid dimensions
uniform vec2 u_gridSize; // [columns, rows]

// Distortion parameters
uniform float u_widthFactors[128];
uniform float u_heightFactors[128];
uniform float u_widthVariationScale;
uniform float u_heightVariationScale;

void main() {
    vec2 adjustedCoord = v_uv;
    
    // Calculate total effective width and height
    int numCols = int(u_gridSize.x);
    int numRows = int(u_gridSize.y);
    
    float totalWidth = 0.0;
    for (int i = 0; i < 128; i++) {
        if(i < numCols) {
            float colAdj = u_widthFactors[i];
            totalWidth += 0.1 + colAdj * u_widthVariationScale;
        }
    }
    
    float totalHeight = 0.0;
    for (int j = 0; j < 128; j++) {
        if(j < numRows) {
            float rowAdj = u_heightFactors[j];
            totalHeight += 0.1 + rowAdj * u_heightVariationScale;
        }
    }
    
    // *** INVERSE MAPPING ***
    // Map from distorted space back to uniform space
    
    float distortedX = adjustedCoord.x;
    float distortedY = adjustedCoord.y;
    
    // For X-axis
    float uniformX = 0.0;
    float accumX = 0.0;
    float normalizedX = distortedX * totalWidth;
    
    for (int i = 0; i < 128; i++) {
        if(i < numCols) {
            float colAdj = u_widthFactors[i];
            float cellWidth = 0.1 + colAdj * u_widthVariationScale;
            
            if(normalizedX < accumX + cellWidth) {
                float cellFraction = (normalizedX - accumX) / cellWidth;
                uniformX = (float(i) + cellFraction) / float(numCols);
                break;
            }
            accumX += cellWidth;
        }
    }
    
    // For Y-axis
    float uniformY = 0.0;
    float accumY = 0.0;
    float normalizedY = distortedY * totalHeight;
    
    for (int j = 0; j < 128; j++) {
        if(j < numRows) {
            float rowAdj = u_heightFactors[j];
            float cellHeight = 0.1 + rowAdj * u_heightVariationScale;
            
            if(normalizedY < accumY + cellHeight) {
                float cellFraction = (normalizedY - accumY) / cellHeight;
                uniformY = (float(j) + cellFraction) / float(numRows);
                break;
            }
            accumY += cellHeight;
        }
    }
    
    // Sample the texture using the uniform coordinates
    vec2 sourceCoord = vec2(uniformX, uniformY);
    fragColor = texture(u_texture, sourceCoord);
}
