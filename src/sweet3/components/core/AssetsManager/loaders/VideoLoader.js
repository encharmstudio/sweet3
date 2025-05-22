import { VideoTexture } from "three";

export class VideoLoader {
  constructor(manager) {}

  load = (url, onLoad, onProgress, onError) => {
    this.dom = document.createElement("video");
    this.dom.src = url;
    onLoad(new VideoTexture(this.dom));
  };
}
