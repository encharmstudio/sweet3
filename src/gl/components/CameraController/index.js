import { EventBus } from "../../global/EventDispatcher";
import { Root } from "../../Root";
import { ContextualComponent } from "../Foundation/ContextualComponent";
import { OrbitControls } from "./OrbitControls";

export class CameraController extends ContextualComponent {
  constructor({
    context,
  } = {}) {
    super({ context });

    this.onResize(Root.screen);

    this.controls = new OrbitControls(this.camera, Root.container);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .1;

    this.camera.position.set(0, 2, 7);
    this.controls.target.set(0, 0.75, 0);

    if (Root.settings.devMode) {

      window.controls = this.controls;
      
      window.cam = this.camera;
      window.getCam = () => {
        console.log(`
    this.camera.position.set(${ this.camera.position.toArray().join(", ") })
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
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  };
}