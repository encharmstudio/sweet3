import { HalfFloatType, LinearEncoding, LinearFilter, Mesh, PlaneGeometry, RGBAFormat, ShaderMaterial, WebGLRenderer, WebGLRenderTarget } from "three";
import { Root } from "../Root";
import { EventBus } from "../global/EventDispatcher";
import { bind, provide } from "../global/Uniforms";
import { Composer } from "./Composer";

import { Bloom } from "./fx/Bloom";
import { Halo } from "./fx/Halo";
import { Vignette } from "./fx/Vignette";
import { Dither } from "./fx/Dither";
import { ACESToneMapping } from "./fx/ACESToneMapping";
import { sRGB } from "./fx/sRGB";
import { Anaglyph } from "./fx/Anaglyph";

import vertexShader from "../shaderLib/uv.vert";
import fragmentShader from "../shaderLib/copy.frag";
import { FXAA } from "./fx/FXAA";

export class RenderingPipeline {

  static rtParameters = {
    magFilter: LinearFilter,
    minFilter: LinearFilter,
    generateMipmaps: false,
    type: HalfFloatType,
    format: RGBAFormat,
    encoding: LinearEncoding,
  };

  constructor() {
    this.renderer = new WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    Root.container.appendChild(this.renderer.domElement);
    
    this.quad = new Mesh(
      new PlaneGeometry(1, 1, 1, 1),
      null
    );
    this.quad.frustumCulled = false;

    this.superSampling = 1;

    this.sceneRT = new WebGLRenderTarget(
      Root.screen.x * this.superSampling,
      Root.screen.y * this.superSampling,
      RenderingPipeline.rtParameters
    );

    this.fx = [
     // new FXAA(),
     // new Anaglyph(),
     // new Bloom(),
     // new Halo(),
     // new ACESToneMapping(),
     // new sRGB(),
      new Vignette(),
      new Dither(),
    ];

    this.composer = new Composer(this.fx);

    this.canvasScale = 1;
    this.debugBuffer = "";
    // this.debugBuffer = 'post.screen'
    // this.debugBuffer = 'post.bloom.filter.result'
    if (this.debugBuffer != "") {
      this.canvasScale = 1;
      this.debugMaterial = new ShaderMaterial({
        uniforms: {
          map: bind(this.debugBuffer),
        },
        vertexShader,
        fragmentShader,
      });
    }

    this.updateRendererSize(Root.screen);

    EventBus.on("resize", this.onResize);
  }

  render = () => {
    const { scene, camera } = Root;
    
    this.renderer.setRenderTarget(this.sceneRT);
    this.renderer.render(scene, camera);
    provide("post.screen", this.sceneRT.texture);
    provide("post.screen.raw", this.sceneRT.texture);

    this.fx.forEach(f => f.render && f.render(this.renderer, this.quad, camera));

    if (this.debugBuffer == "") {
      this.composer.render(this.renderer, this.quad, camera);
    } else {
      this.quad.material = this.debugMaterial;
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.quad, camera);
    }

  };

  updateRendererSize = ({ x, y }) => {
    // TODO consider dpr and if >= 2 disable AA
    // TODO rework canvasScale -- this is a debug stuff
    this.renderer.setSize(x * this.canvasScale, y * this.canvasScale);
    this.renderer.setPixelRatio(1);
  };

  onResize = ({ x, y }) => {
    this.updateRendererSize({ x, y });
    this.sceneRT.setSize(x * this.superSampling, y * this.superSampling);
  };
}