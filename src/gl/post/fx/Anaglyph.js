import { guiSettingsBind } from "../../global/GUI";

export class Anaglyph {
  out = {
    uniforms: {
      anaglyphPower: guiSettingsBind("post.anaglyph", 0, 100, 5),
    },
    declarations: /*glsl*/`
uniform float anaglyphPower;
    `,
    inject: /*glsl*/`{
      vec2 fc = uv * 2. - 1.;
      vec2 d = fc * texelSize * anaglyphPower;
      // vec2 d = normalize(fc) * texelSize * anaglyphPower;
      color = vec3(
        texture2D(map, uv + d).r,
        color.g,
        texture2D(map, uv - d).b
      );
    }`
  };
}