#version 300 es
precision highp float;

in vec2 uv;
out vec2 vUv;

void main() {    
   vUv = uv;
   gl_Position = vec4(2. * uv - 1., 0., 1.);
}