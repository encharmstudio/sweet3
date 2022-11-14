import { defaults } from "../data";
import { Context } from "./Context";
import { AssetsManager } from "./global/AssetsManager";
import { Screen } from "./global/Screen";
import { Pipeline } from "./post/Pipeline";

import { Pointer } from "./components/Foundation/Pointer";
import { Frame } from "./components/Foundation/Frame";

import { CameraController } from "./components/CameraController";
import { Floor } from "./components/Floor";
import { MSDFText } from "./components/MSDFText";
import { LightsAndShadows } from "./components/LightsAndShadows";
import { BackgroundColor } from "./components/BackgroundColor";

import { EndLess } from "./components/EndLess";
import { PlaneText } from "./components/PlaneText";
import { Twist } from "./components/Twist";
import { Env } from "./components/Env";
import { OrganicSphere } from "./components/OrganicSphere";
import { FatLine } from "./components/FatLine";
import { Greta } from "./components/Greta";

export class Root {
  /** @type { HTMLDivElement } */
  static container;

  /** @type { AssetsManager } */
  static assetsManager;

  /** @type { Screen } */
  static screen;

  /** @type { Pipeline } */
  static pipeline;

  /** @type { Context } */
  static context;

  static settings = defaults;

  /** @type { Root } */
  static #instance = null;

  static get instance() {
    if (Root.#instance !== null) {
      return Root.#instance;
    }
    return new Root();
  }

  constructor({ settings }) {
    if (Root.#instance !== null) {
      throw "Root already exists";
    }
    Root.#instance = this;

    Root.settings = Object.assign(Root.settings, settings);

    Root.assetsManager = new AssetsManager();
    Root.screen = new Screen();
    Root.pipeline = new Pipeline();

    Root.context = new Context();
  }

  create = (container) => {
    Root.container = container;
    Root.screen.setContainer(container);
    Root.pipeline.setContainer(container);

    const textContext = new Context({
      camera: Root.context.camera,
      renderSettings: {
        bypassFX: true,
      },
    });

    new Frame({
      contexts: [Root.context, textContext],
    });
    new Pointer();
    new CameraController();
    new Env();
    new BackgroundColor();
    new LightsAndShadows();
    new Floor();
    // new MSDFText({
    //   text: "HI THERE",
    //   align: "center",
    //   width: 500,
    //   ptSize: 0.01,
    //   position: [-2.5, 1, 0],
    //   lookAt: [-2.5, 1, 1],
    //   context: textContext,
    // });

    // new EndLess();
    // new PlaneText();
    // new Twist();
    // new OrganicSphere({
    //   radius: 7.0,
    //   widthSegments: 128.0,
    //   heightSegments: 128.0,
    // });
    // new FatLine();
    new Greta();

    Root.pipeline.compile(Root.context);
    Root.pipeline.compile(textContext);
  };
}
