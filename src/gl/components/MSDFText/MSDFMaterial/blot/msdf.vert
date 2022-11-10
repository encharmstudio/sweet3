varying vec2 vUv;
varying vec2 vLayoutUv;

attribute vec2 layoutUvs;

void main() {
  vUv = uv;
  vLayoutUv = layoutUvs;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}

