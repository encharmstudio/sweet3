import { Raycaster, Vector2, Vector3 } from "three";
import { EventBus } from "../global/EventDispatcher";
import { provide } from "../global/Uniforms";
import { Root } from "../Root";

export class Pointer {
  constructor() {

    this.pointer = new Vector2();
    this.pointerNDC = new Vector2();
    this.pointer3 = new Vector3();
    this.raycaster = new Raycaster();
    provide("pointer.origin", this.raycaster.ray.origin);
    provide("pointer.direction", this.raycaster.ray.direction);
    provide("pointer", this.pointer);
    provide("pointer.v3", this.pointer3);
    this.updatePointer({ x: Root.screen.x * .5, y: Root.screen.y * .5 });

    EventBus.on("pointer.raw", this.updatePointer);
    EventBus.on("pointer.raw.down", this.onDown);
    EventBus.on("pointer.raw.up", this.onUp);
  }
  
  updatePointer = ({ x, y }) => {
    const ndcX = x / Root.screen.x * 2 - 1,
          ndcY = 1 - y / Root.screen.y * 2,
          ndc = { x: ndcX, y: ndcY };

    this.pointer.set(x / Root.screen.x, 1 - y / Root.screen.y);
    this.pointerNDC.copy(this.pointer).multiplyScalar(2).subScalar(1);

    EventBus.dispatch("pointer", this.pointer);
    EventBus.dispatch("pointer.ndc", this.pointerNDC);

    this.pointer3.x = this.pointer.x;
    this.pointer3.y = this.pointer.y;
    
    this.raycaster.setFromCamera(ndc, Root.camera);
  };

  onDown = () => {
    this.pointer3.z = 1;
  };

  onUp = () => {
    this.pointer3.z = 0;
  };

}