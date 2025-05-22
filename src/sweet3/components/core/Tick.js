import { Root } from "@/Root";
import { EventBus } from "@/components/core/EventBus";
import { provide } from "@/components/core/Uniforms";
import Stats from "@/util/stats.module";

export class Tick {
  static rawEvent = "Tick.raw";
  static event = "Tick";
  static beforeRenderEvent = "Tick.beforeRender";
  static afterRenderEvent = "Tick.afterRender";

  static timeProvider = "Tick.time";
  static secondsProvider = "Tick.seconds";

  constructor() {
    if (Root.settings.devMode) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
      EventBus.on(Tick.afterRenderEvent, () => {
        this.stats.update();
      });
    }

    EventBus.on(Tick.rawEvent, this.onAnimFrame);
  }

  onAnimFrame = (time) => {
    if (!("prevTime" in this)) {
      this.prevTime = time;
    }
    const dt = Math.min(1e3 / 30, time - this.prevTime);
    const ds = dt * 1e-3;
    const seconds = time * 1e-3;
    this.prevTime = time;

    const times = { time, dt, seconds, ds };

    provide(Tick.timeProvider, time);
    provide(Tick.secondsProvider, seconds);

    EventBus.dispatch(Tick.event, times);

    EventBus.dispatch(Tick.beforeRenderEvent, times);
    Root.pipeline.render();
    EventBus.dispatch(Tick.afterRenderEvent, times);
  };
}
