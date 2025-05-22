export class JSONLoader {
  constructor(manager) {
    this.manager = manager;
  }

  load = (url, onLoad, onProgress, onError) => {
    if (this.path !== undefined) {
      url = this.path + url;
    }
    url = this.manager.resolveURL(url);
    this.manager.itemStart(url);

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        onLoad(json);
        this.manager.itemEnd(url);
      })
      .catch((error) => {
        if (onError) onError(error);
        this.manager.itemError(url);
        this.manager.itemEnd(url);
      });
  };
}
