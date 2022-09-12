import { guiSettingsBind } from "../../global/GUI";
import { Root } from "../../Root";

export class Halo {
  out = {
    uniforms: {
      aspectRatio: { value: Root.screen.aspectV2 },
      haloPower: guiSettingsBind("post.halo", 0, 10),
    },
    declarations: /*glsl*/`
uniform vec2 aspectRatio;
uniform float haloPower;
    `,
    inject: /*glsl*/`
{
  vec2 fromCenter = (vUv - .5) * aspectRatio;
  vec2 direction = normalize(fromCenter);
  vec2 offset = direction * .75;
  vec2 uv = .5 - fromCenter + offset;
  vec2 anaglyph = direction * texelSize.y * 100.;
  color += vec3(
    texture2D(bloomLevel4, uv - anaglyph).r,
    texture2D(bloomLevel4, uv).g,
    texture2D(bloomLevel4, uv + anaglyph).b
  ) * smoothstep(.5, .85, length(fromCenter)) * haloPower;
}
    `
  };
}