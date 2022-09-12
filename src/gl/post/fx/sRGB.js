export class sRGB {
  out = {
    declarations: /*glsl*/`
vec3 LinearTosRGB(vec3 value) {
  return vec3(
    mix(
      pow(value.rgb, vec3(.41666)) * 1.055 - vec3(.055),
      value.rgb * 12.92,
      vec3(lessThanEqual(value.rgb, vec3(.0031308)))
    )
  );
}
`,
    inject: /*glsl*/`{
      color = LinearTosRGB(color);
    }`
  }
}