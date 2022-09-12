import GUI from "lil-gui";
import { defaults } from "../../data";
import { Root } from "../Root";
import { recursiveSearch } from "../util/recursiveSearch";
import { bind, provide } from "./Uniforms";

const gui = new GUI(),
      binder = {};

export function guiField(object, name, min, max) {
  return gui.add(object, name, min, max);
}

export function guiBind(name, min, max, val = (min + max) * .5) {
  while (name in binder) {
    name += "_";
  }
  binder[name] = val;
  gui.add(binder, name, min, max).onChange(val => provide(name, val));
  return bind(name, val);
}

export function guiSettingsBind(name, min, max) {
  const value = recursiveSearch(Root.settings, name);
  if (defaults.devMode) {
    return guiBind(name, min, max, value);
  } else {
    return { value };
  }
}