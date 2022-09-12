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

    requestAnimationFrame(this.#onFrame);

    this.loadingResolve();
  };

  #updatePointer = (e) => {
    EventBus.dispatch("pointer.raw", {
      x: e.clientX,
      y: e.clientY,
    });
  };

  #onFrame = (time) => {
    EventBus.dispatch("frame.raw", time);
    
    requestAnimationFrame(this.#onFrame);
  };
  
}