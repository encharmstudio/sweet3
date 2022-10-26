#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 texelSize;
uniform sampler2D positionsMap;
uniform sampler2D normalsMap;

void main() {

  vec3 pos = texture(positionsMap, vUv).xyz;
  vec3 nextPos = texture(positionsMap, vec2(vUv.x + texelSize.x, vUv.y)).xyz;

  vec3 dir = nextPos - pos;

  if (length(dir) < 1e-2) {
    fragColor = texture(normalsMap, vUv);
  } else {
    fragColor = vec4(normalize(dir), 1.);
  }

}