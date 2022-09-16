#version 300 es

in vec2 uv;
in vec3 position;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.);
}