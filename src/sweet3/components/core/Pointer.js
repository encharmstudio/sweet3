import { EventBus } from "@/components/core/EventBus";
import { provide } from "@/components/core/Uniforms";
import { Root } from "@/Root";
import { Raycaster, Vector2, Vector3 } from "three";

export class Pointer {
  static rawEvent = "Pointer.raw";
  static rawDownEvent = "Pointer.raw.down";
  static rawUpEvent = "Pointer.raw.up";

  static event = "Pointer";
  static ndcEvent = "Pointer.ndc";
  static raycasterEvent = "Pointer.raycaster";

  static provider = "Pointer";
  static v3Provider = "Pointer.v3";
  static raycasterProvider = "Pointer.raycaster";
  static raycasterOriginProvider = "Pointer.origin";
  static raycasterDirectionProvider = "Pointer.direction";

  constructor({ enableRaycaster = false } = {}) {
    this.pointer = new Vector2();
    this.pointerNDC = new Vector2();
    this.pointer3 = new Vector3();
    this.updatePointer({ x: Root.viewport.x * 0.5, y: Root.viewport.y * 0.5 });

    provide(Pointer.provider, this.pointer);
    provide(Pointer.v3Provider, this.pointer3);

    EventBus.on(Pointer.rawEvent, this.updatePointer);
    EventBus.on(Pointer.rawDownEvent, this.onDown);
    EventBus.on(Pointer.rawUpEvent, this.onUp);

    if (enableRaycaster) {
      this.raycaster = new Raycaster();
      provide(Pointer.raycasterOriginProvider, this.raycaster.ray.origin);
      provide(Pointer.raycasterDirectionProvider, this.raycaster.ray.direction);
      EventBus.on(Pointer.rawEvent, this.updateRaycaster);
    }
  }

  updatePointer = ({ x, y }) => {
    this.pointer.set(x / Root.viewport.x, 1 - y / Root.viewport.y);
    this.pointerNDC.copy(this.pointer).multiplyScalar(2).subScalar(1);

    this.pointer3.x = this.pointer.x;
    this.pointer3.y = this.pointer.y;

    EventBus.dispatch(Pointer.event, this.pointer);
    EventBus.dispatch(Pointer.ndcEvent, this.pointerNDC);
  };

  updateRaycaster = () => {
    this.raycaster.setFromCamera(this.pointerNDC, this.camera);
    EventBus.dispatch(Pointer.raycasterEvent, this.raycaster);
  };

  onDown = () => {
    this.pointer3.z = 1;
  };

  onUp = () => {
    this.pointer3.z = 0;
  };
}
