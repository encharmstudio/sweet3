import {
  WebGLRenderTarget,
  OrthographicCamera,
  Mesh,
  PlaneGeometry,
} from "three";

import { Root } from "../../Root";
import { ContextualComponent } from "../Foundation/ContextualComponent";
import { Material } from "./Material";
import { MSDFText } from "../MSDFText";
import { Context } from "../../Context";
import { objectWrap } from "../../util/objectSugar";

export class PlaneText extends ContextualComponent {
  constructor({ context } = {}) {
    super({ context });
    this.textContext = new Context({
      camera: objectWrap({
        object: new OrthographicCamera(6 / -2, 6 / 2, 6 / 2, 6 / -2, 1, 100),
        position: [0.0, 2.0, 2.5],
      }),
    });
    //GroupText
    this.groupText = this.getGroupText();

    // Render Target setup
    this.rt = new WebGLRenderTarget(2048, 2048);
   
    // main Mesh setup
    this.geometry = new PlaneGeometry(7, 7);
    this.material = new Material({
      map: this.rt.texture,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(5.0, 4.0, -2.5);

    this.scene.add(this.mesh);

    Root.pipeline.renderer.setRenderTarget(this.rt);
    Root.pipeline.renderer.render(
      this.textContext.scene,
      this.textContext.camera
    );

    //EventBus.on("frame", this.onFrame);
  }

  onFrame = ({ seconds, ds }) => {
    // Draw Render Target
    // Root.renderPipe.renderer.setRenderTarget(this.rt);
    // Root.renderPipe.renderer.render(this.rtScene, this.rtCamera);
    // Root.renderPipe.renderer.setRenderTarget(null);
  };

  getGroupText() {
    const context = this.textContext;

    this.MSDFText1 = new MSDFText({
      text: "The",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-4.66, 2.56, 0.0],
      fontName: "opensaucesansligth",
      scale: 1.02,
      context,
    }).getMesh();

    this.MSDFText2 = new MSDFText({
      text: "Beauty",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-4.3, 2.04, 0.0],
      fontName: "opensaucesansbold",
      scale: 1.02,
      context,
    }).getMesh();

    this.MSDFText3 = new MSDFText({
      text: "Nothing",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-4.22, 1.53, 0.0],
      fontName: "opensaucesansbold",
      scale: 1.02,
      context,
    }).getMesh();

    this.MSDFText4 = new MSDFText({
      text: "of",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-3.26, 2.04, 0.0],
      fontName: "opensaucesansligth",
      scale: 1.03,
      context,
    }).getMesh();

    this.MSDFText5 = new MSDFText({
      text: "You create all the impression.",
      align: "center",
      width: 2000,
      ptSize: 0.01,
      position: [-5.169, 1.18, 0.0],
      fontName: "opensaucesansligth",
      scale: 0.375,
      context,
    }).getMesh();

    this.MSDFText6 = new MSDFText({
      text: "Act.",
      align: "center",
      width: 1000,
      ptSize: 0.01,
      position: [0.38, 1.2, 0.0],
      fontName: "atsurt",
      scale: 0.39,
      context,
    }).getMesh();

    this.MSDFText7 = new MSDFText({
      text: "hello∅encharm.studio",
      align: "center",
      width: 1000,
      ptSize: 0.01,
      position: [-0.28, 0.58, 0.0],
      fontName: "atsurt",
      scale: 0.39,
      context,
    }).getMesh();
  }
}
