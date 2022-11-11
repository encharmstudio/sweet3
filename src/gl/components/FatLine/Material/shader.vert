precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

varying vec3 vColor;

varying vec3 vNormalView;
varying vec3 vPosToCam;

uniform vec2 texelSize;
uniform sampler2D positionsMap;
uniform sampler2D normalsMap;

mat3 TBN(vec3 direction, vec3 up) {
  vec3 norm = direction;
  vec3 tang = normalize(cross(norm, up));
  vec3 binormal = normalize(cross(norm, tang));
  return mat3(tang, norm, binormal);
}

void main() {

  vUv = uv;
  vNormal = normal;
  vPosition = position;
 
  float pointIndex = vPosition.y + 0.5;
  // 0 .. 1 we are translating to
  // 0.5 * texelSize .. 1 - 1.5 * texelSize
  pointIndex = 0.5 * texelSize.x + pointIndex * (1. - 1.5 * texelSize.x);
  vec3 bonePosition = texture2D(positionsMap, vec2(pointIndex, 0.5)).xyz;
  vec3 direction = texture2D(normalsMap, vec2(pointIndex, 0.5)).xyz;
  direction = normalize(direction);

  vPosToCam = cameraPosition - vPosition;
  mat3 tbnMatrix = TBN(direction, vPosToCam);

  vPosition.y = 0.;
  vPosition = tbnMatrix * vPosition;
  vPosition += bonePosition;
  vPosition += instanceColor;
  //vPosition = (instanceMatrix * vec4(vPosition,1.0)).xyz;

  vNormalView = tbnMatrix * vNormal;
  vColor = vPosition * 0.5 + 1.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}