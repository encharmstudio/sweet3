import { guiSettingsBind } from "../../global/GUI";

export class ACESToneMapping {
  out = {
    uniforms: {
      toneMappingExposure: guiSettingsBind("post.exposure", 0, 10),
    },
    declarations: /*glsl*/`

uniform float toneMappingExposure;

vec3 RRTAndODTFit(vec3 v) {
  vec3 a = v * (v + .0245786 ) - .000090537;
  vec3 b = v * (.983729 * v + .4329510) + .238081;
  return a / b;
}

vec3 ACESFilmicToneMapping(vec3 color) {
  // sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
  const mat3 ACESInputMat = mat3(
    vec3(.59719, .07600, .02840), // transposed from source
    vec3(.35458, .90834, .13383),
    vec3(.04823, .01566, .83777)
  );
  // ODT_SAT => XYZ => D60_2_D65 => sRGB
  const mat3 ACESOutputMat = mat3(
    vec3(1.60475, -.10208, -.00327), // transposed from source
    vec3(-.53108, 1.10813, -.07276),
    vec3(-.07367, -.00605, 1.07602)
  );
  color *= toneMappingExposure / .6;
  color = ACESInputMat * color;
  // Apply RRT and ODT
  color = RRTAndODTFit(color);
  color = ACESOutputMat * color;
  // Clamp to [0, 1]
  return saturate(color);
}

`,
    inject: /*glsl*/`{
      color = ACESFilmicToneMapping(color);
    }`
  };
}