import { EventBus } from "../../global/EventDispatcher";
import { provide } from "../../global/Uniforms";
import { Root } from "../../Root";

import Stats from "../../util/stats.module";

export class Frame {

  constructor() {

    if (Root.settings.devMode) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
      EventBus.on("afterRender", () => {
        this.stats.update();
      });
    }

    EventBus.on("frame.raw", this.onFrame);
  }

  onFrame = time => {
    if (!("prevTime" in this)) {
      this.prevTime = time;
    }
    const dt = Math.min(1e3 / 30, time - this.prevTime);
    const ds = dt * 1e-3;
    const seconds = time * 1e-3;
    this.prevTime = time;

    const times = { time, dt, seconds, ds };

    provide("time", time);
    provide("seconds", seconds);

    EventBus.dispatch("frame", times);

    EventBus.dispatch("beforeRender", times);
    Root.pipeline.render(Root.context);
    EventBus.dispatch("afterRender", times);
  };
}