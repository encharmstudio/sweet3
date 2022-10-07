import { EventBus } from "./global/EventDispatcher";
import { Root } from "./Root";

export class GL {
  constructor({ settings, container }) {
    new Root({ settings, container });
  }

  load = () => {
    EventBus.on("loading.complete", this.#create);
    
    Root.assetsManager.load();

    return new Promise((res) => {
      this.loadingResolve = res;
    });
  };

  #create = () => {
    Root.instance.create();
  
    document.body.addEventListener("mousemove", this.#updatePointer);
    document.body.addEventListener("mousedown", this.#mouseDown);
    document.body.addEventListener("mouseup", this.#mouseUp);

    requestAnimationFrame(this.#onFrame);

    this.loadingResolve();
  };

  #updatePointer = (e) => {
    EventBus.dispatch("pointer.raw", {
      x: e.clientX,
      y: e.clientY,
    });
  };

  #mouseDown = () => {
    EventBus.dispatch("pointer.raw.down");
  };

  #mouseUp = () => {
    EventBus.dispatch("pointer.raw.up");
  };

  #onFrame = (time) => {
    EventBus.dispatch("frame.raw", time);
    //console.log(time);    
    requestAnimationFrame(this.#onFrame);
  };
  
}