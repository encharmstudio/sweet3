varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(2. * (uv - .5), 0., 1.);
}