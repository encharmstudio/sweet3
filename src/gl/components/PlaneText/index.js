import {
  WebGLRenderTarget,
  PerspectiveCamera,
  OrthographicCamera,
  Scene,
  Color,
  Mesh,
  PlaneGeometry,
  Group,
} from "three";

import { Root } from "../../Root";
import { EventBus } from "../../global/EventDispatcher";
import { Material } from "./Material";
import { MSDFText } from "../MSDFText";

export class PlaneText {
  constructor() {
    //GroupText
    this.groupText = this.getGroupText();

    // Render Target setup
    this.rt = new WebGLRenderTarget(2048, 2048);
    this.rtCamera = new OrthographicCamera(
      6 / -2,
      6 / 2,
      6 / 2,
      6 / -2,
      1,
      100
    );
    this.rtCamera.position.x = 0.0;
    this.rtCamera.position.y = 2.0;
    this.rtCamera.position.z = 2.5;
    // this.rtCamera.lookAt(0.0,-0.0,0.0);
    this.rtScene = new Scene();
    this.rtScene.background = new Color("#000000");
    this.groupText.scale.set(1.0, 1.0, 1.0);
    this.rtScene.add(this.groupText);

    // main Mesh setup
    this.geometry = new PlaneGeometry(7, 7);
    this.material = new Material({
      map: this.rt.texture,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(5.0, 4.0, -2.5);
    this.mesh.scale.set(1.0, 1.0, 1.0);

    Root.scene.add(this.mesh);

    Root.renderPipe.renderer.setRenderTarget(this.rt);
    Root.renderPipe.renderer.render(this.rtScene, this.rtCamera);
    Root.renderPipe.renderer.setRenderTarget(null);

    //EventBus.on("frame", this.onFrame);
  }

  onFrame = ({ seconds, ds }) => {
    // Draw Render Target
    // Root.renderPipe.renderer.setRenderTarget(this.rt);
    // Root.renderPipe.renderer.render(this.rtScene, this.rtCamera);
    // Root.renderPipe.renderer.setRenderTarget(null);
  };

  getGroupText(){
    //GroupText
   let groupText = new Group();

    this.MSDFText1 = new MSDFText({
      text: "The",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-4.66, 2.56, 0.0],
      lookAt: undefined,
      fontName: "OPENSAUCESANSLIGTH",
      scale: [1.02, 1.02, 1.02],
    }).getMesh();

    this.MSDFText2 = new MSDFText({
      text: "Beauty",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-4.3, 2.04, 0.0],
      lookAt: undefined,
      fontName: "OPENSAUCESANSBOLD",
      scale: [1.02, 1.02, 1.02],
    }).getMesh();

    this.MSDFText3 = new MSDFText({
      text: "Nothing",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-4.22, 1.53, 0.0],
      lookAt: undefined,
      fontName: "OPENSAUCESANSBOLD",
      scale: [1.02, 1.02, 1.02],
    }).getMesh();

    this.MSDFText4 = new MSDFText({
      text: "of",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-3.26, 2.04, 0.0],
      lookAt: undefined,
      fontName: "OPENSAUCESANSLIGTH",
      scale: [1.03, 1.03, 1.03],
    }).getMesh();

    this.MSDFText5 = new MSDFText({
      text: "You create all the impression.",
      align: "center",
      width: 2000,
      ptSize: 0.01,
      position: [-5.169, 1.18, 0.0],
      lookAt: undefined,
      fontName: "OPENSAUCESANSLIGTH",
      scale: [0.375, 0.375, 1.0],
    }).getMesh();

    this.MSDFText6 = new MSDFText({
      text: "Act.",
      align: "center",
      width: 1000,
      ptSize: 0.01,
      position: [0.38, 1.2, 0.0],
      lookAt: undefined,
      fontName: "ATSURT",
      scale: [0.39, 0.39, 0.39],
    }).getMesh();

    this.MSDFText7 = new MSDFText({
      text: "hello∅encharm.studio",
      align: "center",
      width: 1000,
      ptSize: 0.01,
      position: [-0.28, 0.58, 0.0],
      lookAt: undefined,
      fontName: "ATSURT",
      scale: [0.39, 0.39, 0.39],
    }).getMesh();

    groupText.add(this.MSDFText1);
    groupText.add(this.MSDFText2);
    groupText.add(this.MSDFText3);
    groupText.add(this.MSDFText4);
    groupText.add(this.MSDFText5);
    groupText.add(this.MSDFText6);
    groupText.add(this.MSDFText7);

    return groupText;
  };
}
