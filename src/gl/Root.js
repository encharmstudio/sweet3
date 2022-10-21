import { PerspectiveCamera, Scene } from "three";
import { Screen } from "./global/Screen";
import { RenderingPipeline } from "./post/RenderingPipeline";
import { EventBus } from "./global/EventDispatcher";
import { AssetsManager } from "./global/AssetsManager";
import { defaults } from "../data";

import { CameraController } from "./components/CameraController";
import { Floor } from "./components/Floor";
import { MSDFText } from "./components/MSDFText";
import { Pointer } from "./components/Pointer";
import { Frame } from "./components/Frame";
import { LightsAndShadows } from "./components/LightsAndShadows";
import { BackgroundColor } from "./components/BackgroundColor";

import { LineFat } from "./components/LineFat";

import Stats from "./util/stats.module";

export class Root {

  /** @type {HTMLDivElement} */
  static container;

  /** @type {AssetsManager} */
  static assetsManager;

  /** @type {Screen} */
  static screen;
  
  /** @type {RenderingPipeline} */
  static renderPipe;
  
  /** @type {PerspectiveCamera} */
  static camera;
  
  static scene = new Scene();

  static settings = defaults;
  
  /** @type {Root} */
  static #instance = null;

  static get instance() {
    if (Root.#instance !== null) {
      return Root.#instance;
    }
    return new Root();
  }

  constructor({ settings, container }) {
    if (Root.#instance !== null) {
      throw "Root already exists";
    }

    Root.container = container;
    Root.settings = Object.assign(Root.settings, settings);
    
    Root.assetsManager = new AssetsManager();
    Root.screen = new Screen();
    Root.camera = new PerspectiveCamera(45, Root.screen.aspect, .1, 2e3);
    Root.renderPipe = new RenderingPipeline();
    
    Root.#instance = this;
  }

  create = () => {
    new Frame();
    new Pointer();
    new CameraController();
    new BackgroundColor();
    new LightsAndShadows();
    new Floor();
    new MSDFText({
      text: "HI THERE",
      align: "center",
      width: 500,
      ptSize: 0.01,
      position: [-2.5, 1, 0],
      lookAt: [-2.5, 1, 1],
    });
    new LineFat();

    if (defaults.devMode) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
      EventBus.on("afterRender", () => {
        this.stats.update();
      });

      window.cam = Root.camera;
    }
  };  
}