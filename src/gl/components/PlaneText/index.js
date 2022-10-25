import {
  WebGLRenderTarget,
  PerspectiveCamera,
  OrthographicCamera,
  Scene,
  Color,
  Mesh,
  PlaneGeometry,
} from "three";

import { Root } from "../../Root";
import { EventBus } from "../../global/EventDispatcher";
import { Material } from "./Material";
import { MSDFText } from "./MSDFText";

export class PlaneText {
  constructor() {
    this.MSDFText = new MSDFText({
      text: "ENDLESS",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-2.5, -0.6, -3.5],
      lookAt: [-2.5, -0.6, 1],
    });

    // Render Target setup
    this.rt = new WebGLRenderTarget(2048, 2048);
    this.rtCamera = new OrthographicCamera(
      6 / -2,
      6 / 2,
      6 / 2,
      6 / -2,
      1,
      1000
    );
    this.rtCamera.position.x = 1.5;
    this.rtCamera.position.y = -1.5;
    this.rtCamera.position.z = 2.5;
   // this.rtCamera.lookAt(0.0,-0.0,0.0);
    this.rtScene = new Scene();
    this.rtScene.background = new Color("#000000");
    this.MSDFText.textGroup.scale.set(1.0, 1.0, 1.0);
    this.rtScene.add(this.MSDFText.textGroup);

    // main Mesh setup
    this.geometry = new PlaneGeometry(1, 1);
    this.material = new Material({
      map: this.rt.texture,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0.0, 2.0, 0.0);
    this.mesh.scale.set(1.0, 1.0, 1.0);

    Root.scene.add(this.mesh);

    Root.renderPipe.renderer.setRenderTarget(this.rt);
    Root.renderPipe.renderer.render(this.rtScene, this.rtCamera);
    Root.renderPipe.renderer.setRenderTarget(null);

    EventBus.on("frame", this.onFrame);
  }

  onFrame = ({ seconds, ds }) => {
    // Draw Render Target
    // Root.renderPipe.renderer.setRenderTarget(this.rt);
    // Root.renderPipe.renderer.render(this.rtScene, this.rtCamera);
    // Root.renderPipe.renderer.setRenderTarget(null);
  };
}
