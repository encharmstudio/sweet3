import { JSONLoader } from "@/components/core/AssetsManager/loaders/JSONLoader";
import { EventBus } from "@/components/core/EventBus";
import { assets } from "@/settings";
import { LoadingManager, TextureLoader } from "three";
import { GLTFLoader, RGBELoader } from "three-stdlib";

export class AssetsManager {
  static complete = "loading.complete";
  static progress = "loading.progress";
  static error = "loading.error";

  constructor() {
    this.manager = new LoadingManager(
      () => EventBus.dispatch(AssetsManager.complete, {}),

      (url, loaded, total) =>
        EventBus.dispatch(AssetsManager.progress, { url, loaded, total }),

      (url) => EventBus.dispatch(AssetsManager.error, { url })
    );

    this.paths = {};
    this.loaders = {};
    this.resources = {};

    this.#setAssets(assets);
  }

  #getLoader = (type) => {
    switch (type) {
      case "jpg":
      case "png":
        return new TextureLoader(this.manager);
      case "gltf":
      case "glb":
        return new GLTFLoader(this.manager);
      case "hdr":
        return new RGBELoader(this.manager).setDataType(HalfFloatType);
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

  #setAssets = (assets) => {
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
    const keys = Object.keys(this.paths);
    if (keys.length == 0) {
      EventBus.dispatch(AssetsManager.complete, {});
      return;
    }
    keys.forEach((key) => {
      this.loaders[key].load(
        this.paths[key],
        (result) => (this.resources[key] = result)
      );
    });
  };

  get = (key) => {
    if (!(key in this.resources)) {
      console.warn(
        `Missing ${key} in ${Object.keys(this.resources).join(", ")}`,
        this
      );
      throw `${key} is not found in resources!`;
    }
    return this.resources[key];
  };
}
