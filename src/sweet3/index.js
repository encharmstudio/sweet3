import { AssetsManager } from "./components/core/AssetsManager";
import { EventBus } from "./components/core/EventBus";
import { Pointer } from "./components/core/Pointer";
import { Tick } from "./components/core/Tick";
import { Root } from "./Root";

export class GL {
  constructor({ settings = {}, container }) {
    this.container = container;
    new Root(settings);
  }

  load = () => {
    const promise = new Promise((res) => {
      this.loadingResolve = res;
    });

    EventBus.on(AssetsManager.complete, this.#create);
    Root.assetsManager.load();

    return promise;
  };

  #create = () => {
    Root.instance.create(this.container);
  
    document.body.addEventListener("mousemove", this.#updatePointer);
    document.body.addEventListener("mousedown", this.#mouseDown);
    document.body.addEventListener("mouseup", this.#mouseUp);

    requestAnimationFrame(this.#onFrame);

    this.loadingResolve();
  };

  #updatePointer = (e) => {
    EventBus.dispatch(Pointer.rawEvent, {
      x: e.clientX,
      y: e.clientY,
    });
  };

  #mouseDown = () => {
    EventBus.dispatch(Pointer.rawDownEvent);
  };

  #mouseUp = () => {
    EventBus.dispatch(Pointer.rawUpEvent);
  };

  #onFrame = (time) => {
    EventBus.dispatch(Tick.rawEvent, time);
    
    requestAnimationFrame(this.#onFrame);
  };
  
}