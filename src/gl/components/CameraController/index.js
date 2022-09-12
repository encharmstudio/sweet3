import { EventBus } from "../../global/EventDispatcher";
import { Root } from "../../Root";
import { OrbitControls } from "./OrbitControls";

export class CameraController {
  constructor() {
    this.onResize(Root.screen);

    this.controls = new OrbitControls(Root.camera, Root.container);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .1;

    Root.camera.position.set(0, 2, 7);
    this.controls.target.set(0, 0.75, 0);

    // TODO add lookAround functionality from comet
    // Probably as another controller type

    if (Root.settings.devMode) {
      window.controls = this.controls;

      window.getCam = () => {
        console.log(`
    Root.camera.position.set(${ Root.camera.position.toArray().join(", ") })
    this.controls.target.set(${ this.controls.target.toArray().join(", ") })
        `);
      };
    }

    EventBus.on("resize", this.onResize);
    EventBus.on("frame", this.onFrame);
  }

  onFrame = () => {
    this.controls.update();
  };

  onResize = ({ aspect }) => {
    Root.camera.aspect = aspect;
    Root.camera.updateProjectionMatrix();
  };
}