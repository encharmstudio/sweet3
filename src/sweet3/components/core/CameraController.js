import { Root } from "@/Root";
import { EventBus } from "@/components/core/EventDispatcher";
import { Tick } from "@/components/core/Tick";
import { Viewport } from "@/components/core/Viewport";
import { OrbitControls } from "three-stdlib";

export class CameraController {
  constructor() {

    this.onResize(Root.viewport);

    this.controls = new OrbitControls(Root.camera, Root.container);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .1;

    Root.camera.position.set(0, 2, 20);
    this.controls.target.set(0, 1, 0);

    this.controls.enableZoom = true;

    if (Root.settings.devMode) {

      window.controls = this.controls;
      
      window.camera = Root.camera;
      window.getCam = () => {
        console.log(`
    Root.camera.position.set(${ Root.camera.position.toArray().join(", ") })
    this.controls.target.set(${ this.controls.target.toArray().join(", ") })
        `);
      };
    }

    EventBus.on(Viewport.resizeEvent, this.onResize);
    EventBus.on(Tick.event, this.onTick);
  }

  onTick = () => {
    this.controls.update();
  };

  onResize = ({ aspectRatio }) => {
    Root.camera.aspect = aspectRatio;
    Root.camera.updateProjectionMatrix();
  };
}
