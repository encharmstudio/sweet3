import { AssetsManager } from "@/components/core/AssetsManager/AssetsManager";
import { CameraController } from "@/components/core/CameraController";
import { Pointer } from "@/components/core/Pointer";
import { RenderingPipeline } from "@/components/core/RenderingPipeline";
import { Tick } from "@/components/core/Tick";
import { Viewport } from "@/components/core/Viewport";
import { defaults } from "@/settings";
import { PerspectiveCamera, Scene } from "three";

export class Root {
  /** @type { HTMLDivElement } */
  static container;

  /** @type { AssetsManager } */
  static assetsManager;

  /** @type { Viewport } */
  static viewport;

  /** @type { RenderingPipeline } */
  static pipeline;

  /** @type { Scene } */
  static scene = new Scene();

  /** @type { Camera } */
  static camera;

  static settings = defaults;

  /** @type { Root } */
  static #instance = null;

  static get instance() {
    if (Root.#instance !== null) {
      return Root.#instance;
    }
    return new Root();
  }

  constructor(settings) {
    if (Root.#instance !== null) {
      throw "Sweet3 Root already exists";
    }
    Root.#instance = this;

    Root.settings = Object.assign(Root.settings, settings);

    Root.assetsManager = new AssetsManager();
    Root.viewport = new Viewport();
    Root.pipeline = new RenderingPipeline();

    const { fov, near, far } = Root.settings.camera;
    Root.camera = new PerspectiveCamera(fov, Root.viewport.aspect, near, far);
  }

  create = (container) => {
    Root.container = container;
    Root.viewport.setContainer(container);
    Root.pipeline.setContainer(container);

    // core components
    new Tick();
    new Pointer();
    new CameraController();

    // user components

    // compile shaders after all components added
    Root.pipeline.compile();
  };
}
