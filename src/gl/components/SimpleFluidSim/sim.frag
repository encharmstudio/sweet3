#version 300 es
precision highp float;
precision highp int;

#define PI 3.141592653589793
#define TAU 6.283185307179586
#define rain 1
#define depth 20.
#define velPropagation 1.4
#define pow2(x) (x * x)

in vec2 vUv;
layout(location = 0) out highp vec2 fragColor;

uniform vec2 aspect;
uniform vec2 texelSize;
uniform vec3 pointer;
uniform float seconds;
uniform sampler2D map;

// https://newbedev.com/random-noise-functions-for-glsl
// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
uint hash( uint x ) {
  x += ( x << 10u );
  x ^= ( x >>  6u );
  x += ( x <<  3u );
  x ^= ( x >> 11u );
  x += ( x << 15u );
  return x;
}

// Compound versions of the hashing algorithm I whipped together.
uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

// Construct a float with half-open range [0:1] using low 23 bits.
// All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
float floatConstruct( uint m ) {
  const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
  const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32

  m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
  m |= ieeeOne;                          // Add fractional part to 1.0

  float  f = uintBitsToFloat( m );       // Range [1:2]
  return f - 1.0;                        // Range [0:1]
}

// Pseudo-random value in half-open range [0:1].
float random( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
float random( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
float random( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
float random( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }

vec2 hash22(vec2 p) {
  return vec2(
    random(p),
    random(p + vec2(735.153, 369.165))
  );
}

// https://codepen.io/shubniggurath/pen/OEeMOd
void main() {
  vec2 uv = vUv;
  vec2 mouse = (pointer.xy - vUv) * aspect;
  
  float ripple = 0.;
  if (pointer.z == 1.) {
    ripple = smoothstep(.02 + abs(sin(seconds * 10.) * .006), .0, length(mouse)); 
  }
  if (mod(seconds, .1) >= .05) {
    vec2 hash = hash22(vec2(seconds * 2., sin(seconds * 10.))) * 3. - 1.;
    ripple += smoothstep(.012, .0, length(uv - hash + .5));
  }

  vec3 e = vec3(3.6 * texelSize, 0.);
  
  vec4 value = texture(map, uv);

  float d = ripple * 2.;

  float t = texture(map, uv - e.zy, 1.).x;
  float b = texture(map, uv + e.xz, 1.).x;
  float l = texture(map, uv + e.zy, 1.).x;
  float r = texture(map, uv - e.xz, 1.).x;

  d += (.5 - value.y) * 2. + t + r + b + l - 2.;
  d *= .99;
  d = d * .5 + .5;

  fragColor = vec2(d, value.x);
}