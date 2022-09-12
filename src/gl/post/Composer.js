import { ShaderMaterial } from "three";
import { Root } from "../Root";
import { bind } from "../global/Uniforms";
import vertexShader from "../shaderLib/uv.vert";

export class Composer {
  constructor(fx) {

    fx.forEach(f => !f.out && (f.out = {}));

    const uniforms = Object.assign({
      map: bind("post.screen"),
      texelSize: { value: Root.screen.iv2 },
    }, ...fx.map(f => f.out.uniforms));

    const fragmentShader = /*glsl*/`
#define saturate(x) clamp(x, 0., 1.)
varying vec2 vUv;
uniform sampler2D map;
uniform vec2 texelSize;

${ fx.map(f => f.out.declarations).join("") }

void main() {
  vec2 uv = vUv;
  vec3 color = texture2D(map, uv).rgb;

  ${ fx.map(f => f.out.inject).join("") }

  gl_FragColor = vec4(saturate(color), 1.);
}
    `;

    this.material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
  }

  render = (renderer, quad, cam) => {
    quad.material = this.material;
    renderer.setRenderTarget(null);
    renderer.render(quad, cam);
  };
}