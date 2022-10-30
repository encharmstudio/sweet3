import { Vector2, Vector4 } from "three";
import { EventBus } from "./EventDispatcher";

export class Screen {

  container = document.body;
  v2 = new Vector2();
  iv2 = new Vector2();
  v4 = new Vector4();
  aspect = 1;
  aspectV2 = new Vector2();
  dpr = 2;
  #debounce = null;

  constructor() {
    this.resetDPR();

    EventBus.on("dpr.set", this.setDPR);
    EventBus.on("dpr.reset", this.resetDPR);

    window.addEventListener("resize", this.debounceResize);
  }

  setDPR = dpr => {
    this.dpr = dpr;
    this.update();
  };

  resetDPR = () => {
    this.dpr = Math.min(2, window.devicePixelRatio);
    this.update();
  };

  setContainer = container => {
    this.container = container;
    this.update();
  };

  debounceResize = () => {
    if (this.#debounce !== null) {
      clearTimeout(this.#debounce);
    }
    this.#debounce = setTimeout(this.update, 333);
  };

  update = () => {
    this.#debounce = null;

    this.x = this.v2.x = this.v4.x = this.container.clientWidth || this.container.innerWidth;
    this.y = this.v2.y = this.v4.y = this.container.clientHeight || this.container.innerHeight;
    this.aspect = this.x / this.y;
    this.aspectV2.x = this.aspect > 1 ? this.aspect : 1;
    this.aspectV2.y = this.aspect > 1 ? 1 : 1 / this.aspect;
    this.iv2.x = this.v4.z = 1 / this.x;
    this.iv2.y = this.v4.w = 1 / this.y;

    EventBus.dispatch("resize", this);
  };

}