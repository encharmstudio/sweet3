import { Raycaster, Vector2 } from "three";
import { EventBus } from "../global/EventDispatcher";
import { provide } from "../global/Uniforms";
import { Root } from "../Root";

export class Pointer {
  constructor() {

    this.pointer = new Vector2();
    this.raycaster = new Raycaster();
    provide("pointer.origin", this.raycaster.ray.origin);
    provide("pointer.direction", this.raycaster.ray.direction);
    provide("pointer", this.pointer);
    this.updatePointer({ x: Root.screen.x * .5, y: Root.screen.y * .5 });

    EventBus.on("pointer.raw", this.updatePointer);
  }
  
  updatePointer = ({ x, y }) => {
    const ndcX = x / Root.screen.x * 2 - 1,
          ndcY = 1 - y / Root.screen.y * 2,
          ndc = { x: ndcX, y: ndcY };

    this.pointer.set(x / Root.screen.x, 1 - y / Root.screen.y);
    EventBus.dispatch("pointer", ndc);
    
    this.raycaster.setFromCamera(ndc, Root.camera);
  };

}