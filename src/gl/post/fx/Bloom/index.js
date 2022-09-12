import { ShaderMaterial, Vector2, WebGLRenderTarget } from "three";
import { EventBus } from "../../../global/EventDispatcher";
import { Root } from "../../../Root";
import { guiSettingsBind } from "../../../global/GUI";
import { bind, provide } from "../../../global/Uniforms";
import { RenderingPipeline } from "../../RenderingPipeline";
import uvVert from "../../../shaderLib/uv.vert";
import blurFrag from "./blur.frag";
import filterFrag from "./filter.frag";

const blurDirectionX = new Vector2(1, 0);
const blurDirectionY = new Vector2(0, 1);

export class Bloom {
  constructor() {
    const kernels = [3, 5, 7, 9, 11];
    this.renderTargetsHorizontal = [];
    this.renderTargetsVertical = [];
    this.blurMaterials = [];
    this.nMips = 5;
    // let resx = Math.round(Facade.screen.x * .5)
    // let resy = Math.round(Facade.screen.y * .5)
    this.resolutions = [];
    let resX = Root.screen.x;
    let resY = Root.screen.y;

    for (let i = 0; i < this.nMips; i++) {
      
      this.resolutions.push(resX, resY);

      this.renderTargetsHorizontal.push(new WebGLRenderTarget(resX, resY, RenderingPipeline.rtParameters));
      this.renderTargetsVertical.push(new WebGLRenderTarget(resX, resY, RenderingPipeline.rtParameters));
      
      const kernel = kernels[i];
      this.blurMaterials.push(
        new ShaderMaterial({
          defines: {
            KERNEL_RADIUS: kernel,
            SIGMA: kernel,
          },
          uniforms: {
            t: { value: null },
            invSize: { value: new Vector2(1 / resX, 1 / resY) },
            direction: { value: new Vector2(.5, .5) },
          },
          vertexShader: uvVert,
          fragmentShader: blurFrag,
        })
      );
      
      resX = Math.round(resX * .5);
      resY = Math.round(resY * .5);
    }

    this.filterRenderTarget = new WebGLRenderTarget(Root.screen.x, Root.screen.y, RenderingPipeline.rtParameters);
    this.filterMaterial = new ShaderMaterial({
      uniforms: {
        t: bind("post.screen"),
        threshold: guiSettingsBind("post.bloom.filter.threshold", 0, 1),
        texelSize: { value: Root.screen.iv2 },
        anaglyphWidth: { value: 10 },
      },
      vertexShader: uvVert,
      fragmentShader: filterFrag,
    });
    // EventBus.on('pointer', ({ x }) => this.filterMaterial.uniforms.scale.value = x * .5 + .5)

    provide("post.bloom.filter.result", this.filterRenderTarget.texture);
    provide("post.bloom.level0", this.renderTargetsVertical[0].texture);
    provide("post.bloom.level1", this.renderTargetsVertical[1].texture);
    provide("post.bloom.level2", this.renderTargetsVertical[2].texture);
    provide("post.bloom.level3", this.renderTargetsVertical[3].texture);
    provide("post.bloom.level4", this.renderTargetsVertical[4].texture);
    // provide('post.bloom.resolutions', this.resolutions)

    EventBus.on("resize", this.onResize);
  }

  out = {
    uniforms: {
      bloomLevel0: bind("post.bloom.level0"),
      bloomLevel1: bind("post.bloom.level1"),
      bloomLevel2: bind("post.bloom.level2"),
      bloomLevel3: bind("post.bloom.level3"),
      bloomLevel4: bind("post.bloom.level4"),
      bloomRadius: bind("post.bloom.radius", 1),
      bloomPower: bind("post.bloom.power", .25),
      // resolutions: bind('post.bloom.resolutions'),
    },
    declarations: /*glsl*/`
uniform sampler2D bloomLevel0;
uniform sampler2D bloomLevel1;
uniform sampler2D bloomLevel2;
uniform sampler2D bloomLevel3;
uniform sampler2D bloomLevel4;
uniform float bloomRadius;
uniform float bloomPower;
// uniform float resolutions[10];

vec2 filterUV(vec2 uv, vec2 size) {
  vec2 textureCoord = uv * size + .5;
  vec2 f = fract(textureCoord);
  f = f * f * (3. - 2. * f);
  textureCoord = floor(textureCoord) + f - .5;
  return textureCoord / size;
}
    `,
    inject: /*glsl*/`
vec3 bloom = (
  mix(1., .2, bloomRadius) * texture2D(bloomLevel0, uv).rgb + 
  mix(.8, .4, bloomRadius) * texture2D(bloomLevel1, uv).rgb + 
  mix(.6, .6, bloomRadius) * texture2D(bloomLevel2, uv).rgb + 
  mix(.4, .8, bloomRadius) * texture2D(bloomLevel3, uv).rgb + 
  mix(.2, 1., bloomRadius) * texture2D(bloomLevel4, uv).rgb
);
color += bloomPower * bloom * bloom;
    `
  };

  render = (renderer, quad, cam) => {
    quad.material = this.filterMaterial;
    renderer.setRenderTarget(this.filterRenderTarget);
    renderer.render(quad, cam);
    
    let inRt = this.filterRenderTarget;
    for (let i = 0; i < this.nMips; i++) {
      const material = this.blurMaterials[i];
      quad.material = material;

      material.uniforms.t.value = inRt.texture;
      material.uniforms.direction.value = blurDirectionX;
      renderer.setRenderTarget(this.renderTargetsHorizontal[i]);
      renderer.render(quad, cam);

      material.uniforms.t.value = this.renderTargetsHorizontal[i].texture;
      material.uniforms.direction.value = blurDirectionY;
      renderer.setRenderTarget(this.renderTargetsVertical[i]);
      renderer.render(quad, cam);

      inRt = this.renderTargetsVertical[i];
    }
  };

  onResize = ({ x, y }) => {
    // let resI = 0
    let resX = x;
    let resY = y;
    // let resx = Math.round(x * .5)
    // let resy = Math.round(y * .5)

    for (let i = 0; i < this.nMips; i++) {
      // this.resolutions[resI] = resX
      // this.resolutions[resI + 1] = resY

      this.renderTargetsHorizontal[i].setSize(resX, resY);
      this.renderTargetsVertical[i].setSize(resX, resY);
      
      resX = Math.round(resX * .5);
      resY = Math.round(resY * .5);
      // resI += 2
    }

    this.filterRenderTarget.setSize(x, y);

  };
}