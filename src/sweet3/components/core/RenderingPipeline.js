import { WebGLRenderer } from "three";
import { EventBus } from "./EventBus";
import { Root } from "../../Root";
import { Viewport } from "./Viewport";

export class RenderingPipeline {
  constructor() {
    this.renderer = new WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    this.onResize(Root.viewport);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    
    this.onResize(Root.viewport);
    EventBus.on(Viewport.resizeEvent, this.onResize);
  }

  render = () => {
    const { scene, camera } = Root;
    this.renderer.render(scene, camera);
  }

  setContainer = container => {
    container.appendChild(this.renderer.domElement);
    this.onResize(Root.viewport);
  };

  onResize = ({ x, y }) => {
    this.renderer.setSize(x, y);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  };

  compile = () => {
    const { scene, camera } = Root;
    this.renderer.compile(scene, camera);
  };
}