import { Vector2, Vector4 } from "three";
import { EventBus } from "./EventBus";
import { provide } from "./Uniforms";

export class Viewport {

  static resizeEvent = "screen.resize";
  static aspectRatioProvider = "screen.aspectRatio";

  container = document.body;
  x = 0;
  y = 0;
  v2 = new Vector2();
  iv2 = new Vector2();
  v4 = new Vector4();
  aspectRatio = 1;
  aspectRatioV2 = new Vector2();
  dpr = 2;
  #debounce = null;

  constructor() {
    this.updateDPR();

    provide(Viewport.aspectRatioProvider, this.aspectRatio);

    window.addEventListener("resize", this.debounceResize);
  }

  updateDPR = () => {
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

    this.aspectRatio = this.x / this.y;
    provide(Viewport.aspectRatioProvider, this.aspectRatio);

    this.aspectRatioV2.x = this.aspectRatio > 1 ? this.aspectRatio : 1;
    this.aspectRatioV2.y = this.aspectRatio > 1 ? 1 : this.y / this.x;

    this.iv2.x = this.v4.z = 1 / this.x;
    this.iv2.y = this.v4.w = 1 / this.y;

    EventBus.dispatch(Viewport.resizeEvent, this);
  };

}