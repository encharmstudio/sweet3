import { PMREMGenerator, FloatType } from "three";
import { Root } from "../../Root";
import { RGBELoader } from "./RGBELoader";

export class EnvLoader extends RGBELoader {
  constructor(manager) {
    super(manager);
    // alt: FloatType, HalfFloatType, UnsignedByteType
    this.setDataType(FloatType);
  }

  load = (url, onLoad, onProgress, onError) => {
    super.load(
      url,
      res => {
        const pmremGenerator = new PMREMGenerator(Root.pipeline.renderer);
        const env = pmremGenerator.fromEquirectangular(res).texture;
        pmremGenerator.dispose();
        onLoad(env);
      },
      onProgress,
      onError,
    );
  };
}