import { LoadingManager, FloatType, TextureLoader } from "three";
import { GLTFLoader } from "./loaders/GLTFLoader";
import { RGBELoader } from "./loaders/RGBELoader";
import { EnvLoader } from "./loaders/EnvLoader";
import { assets } from "../../data";
import { EventBus } from "./EventDispatcher";
import { JSONLoader } from "./loaders/JSONLoader";

export class AssetsManager {
  constructor() {
    
    this.manager = new LoadingManager(
      () =>
        EventBus.dispatch("loading.complete", {}),

      (url, loaded, total) =>
        EventBus.dispatch("loading.progress", { url, loaded, total }),

      (url) =>
        EventBus.dispatch("loading.error", { url }),
    );
    
    this.paths = {};
    this.loaders = {};
    this.resources = {};

    this.#setAssets(assets);
  }

  #getLoader = type => {
    switch (type) {
    case "jpg":
    case "png":
      return new TextureLoader(this.manager);
    case "gltf":
    case "glb":
      return new GLTFLoader(this.manager);
    case "env":
      return new EnvLoader(this.manager);
    case "hdr":
      // TODO check if works in WebGL 1
      return new RGBELoader(this.manager).setDataType(FloatType);
    case "json":
      return new JSONLoader(this.manager);
    default:
      throw `Unknown resource type ${type}!`;
    }
  };

  #prepareAsset = (data, name) => {
    let type, path;
    if (typeof data == "string") {
      path = data;
      type = path.substring(path.lastIndexOf(".") + 1, path.length);
    } else {
      path = data.path;
      type = data.type;
    }

    this.paths[name] = path;
    this.loaders[name] = this.#getLoader(type);
  };

  #setAssets = assets => {
    Object.entries(assets).forEach(([name, data]) => {
      if (Array.isArray(data)) {
        name = name.substr(0, name.length - 1);
        data.forEach((entry, i) => {
          this.#prepareAsset(entry, name + i);
        });
      } else {
        this.#prepareAsset(data, name);
      }
    });
  };

  load = () => {
    Object.keys(this.paths).forEach(key => {
      this.loaders[key].load(this.paths[key], result => this.resources[key] = result);
    });
  };

  get = key => this.resources[key];
}