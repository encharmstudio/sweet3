varying vec2 vUv;

uniform sampler2D t;
uniform float threshold;
uniform float anaglyphWidth;
uniform vec2 texelSize;

void main() {
  vec2 uv = vUv;
  vec3 color = texture2D(t, uv).rgb;

  // vec2 direction = normalize(uv - .5);
  // vec2 offset = texelSize * anaglyphWidth;
  // vec2 uvB = uv - direction * offset;
  // vec2 uvY = uv - direction * offset * 2.;
  // vec3 color2 = vec3(
  //   texture2D(t, uvY).rg,
  //   dot(texture2D(t, uvB).rgb, vec3(.333333))
  // );
  // color = max(color, color2);
  
  float l = dot(color, vec3(.33333));
  // float l = dot(color, vec3(.299, .587, .114));
  l = smoothstep(threshold - .05, threshold + .05, l);
  color = max(color * l, 0.);

  gl_FragColor = vec4(color, 1.);
}