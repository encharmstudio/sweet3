import {
  WebGLRenderTarget,
  PerspectiveCamera,
  OrthographicCamera,
  Scene,
  Color,
  Mesh,
  PlaneGeometry,
  Group
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

    //GroupText
    this.groupText = new Group();

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
    this.rtCamera.position.x = 3.0;
    this.rtCamera.position.y = -1.0;
    this.rtCamera.position.z = 2.5;
    // this.rtCamera.lookAt(0.0,-0.0,0.0);
    this.rtScene = new Scene();
    this.rtScene.background = new Color("#000000");
    this.MSDFText.groupText.scale.set(1.0, 1.0, 1.0);
    this.rtScene.add(this.MSDFText.groupText);

    // main Mesh setup
    this.geometry = new PlaneGeometry(7, 7);
    this.material = new Material({
      map: this.rt.texture,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0.0, 7.0, -2.5);
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
