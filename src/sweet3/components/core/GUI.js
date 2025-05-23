import { Root } from "@/Root";
import { bind, provide } from "@/components/core/Uniforms";
import { Pane } from "tweakpane";

const binder = {};
let pane;

export function guiField(object, name, min, max) {
  if (!Root.settings.devMode) {
    return null;
  }
  if (!pane) {
    pane = new Pane();
  }
  return pane.addBinding(object, name, {
    min,
    max,
  });
}

export function guiBind(name, min, max, val = (min + max) * 0.5) {
  if (Root.settings.devMode) {
    if (!pane) {
      pane = new Pane();
    }
    while (name in binder) {
      name += "_";
    }
    binder[name] = val;
    pane
      .addBinding(binder, name, {
        min,
        max,
      })
      .on("change", (ev) => provide(name, ev.value));
  }
  return bind(name, val);
}
