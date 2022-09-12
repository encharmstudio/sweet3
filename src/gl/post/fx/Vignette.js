import { guiSettingsBind } from "../../global/GUI";

export class Vignette {
  out = {
    uniforms: {
      vignettePower: guiSettingsBind("post.vignette", .01, 2),
    },
    declarations: /*glsl*/`
uniform float vignettePower;
    `,
    inject: /*glsl*/`{
      vec2 uv = vUv * (1. - vUv);
      float v = pow(16. * uv.x * uv.y, vignettePower);
      color *= v;
    }`
  };
}