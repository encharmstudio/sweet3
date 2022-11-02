varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float time;
uniform float test;

#define M_PI 3.1415926535897932384626433832795

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0);
}

float mapRange(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {

 

  vUv = uv;
  vNormal = normal;
  vPosition = position;


 // vec4 newposition = modelMatrix * vec4(position,1.0);
   vec4 newposition =  vec4(position, 1.0);
  //float t = fract(time / 10.);
  // float t2 = sin((newposition.y * 3.0) * 1.5 + time * 0.0001);
  // float angle = sin(time * 0.001);

  //float t = mod(time, 2.0); 

  //float t = mod(time, 9.0) - 4.0;
 
  
  
  float t = time * 0.001; 
  //float f = sin(t * 5.5) + 1.0;
  float m = mod(t,3.0);

   

  float progress = m;
  float p1 = mapRange(newposition.y, -1.0, 1.0, 0.0, 1.0);  
  float p2 = smoothstep(0.0,1.0,p1);  
  float t1 = mapRange(progress, 0.0, 1.0, 0.0, 3.1415* 2.0 + p2 * 3.0);  
  float t2 = clamp(t1,0.0,3.1415 * 2.0);

  
  mat4 mRotation = rotationMatrix(vec3(1.0,1.0,0.0), -t2);
  
  newposition = mRotation * newposition;

  gl_Position = projectionMatrix * viewMatrix *  modelMatrix * newposition;

}