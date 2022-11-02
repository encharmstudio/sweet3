import {
  BackSide,
  ShaderMaterial,
  SphereBufferGeometry,
  EquirectangularReflectionMapping,
} from "three";
import { Root } from "../Root";
import { createMesh } from "../util/objectSugar";

export class Env {
  constructor() {

    // let envMap = Root.assetsManager.get("envMap");
    // envMap.mapping = EquirectangularReflectionMapping;
     
    Root.scene.add(
      createMesh({
        geometry: new SphereBufferGeometry(1e3),
        material: new ShaderMaterial({
          uniforms: {
            map: { value: Root.assetsManager.get("envMap") },
          },
          side: BackSide,
          vertexShader: /*glsl*/ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
            }
          `,
          fragmentShader: /*glsl*/ `
            varying vec2 vUv;
            uniform sampler2D map;
            void main() {
              vec3 color = texture2D(map, vUv).rgb;
              // color = color * vec3(2., 2., 2.) - vec3(1., 1., .5);
              color = pow(color, vec3(2., 2., 1.75));
              gl_FragColor = vec4(clamp(color, 0., 1.), 1.);
            }
          `,
        }),
      })      
    );

    Root.scene.environment = Root.assetsManager.get("env");
    //Root.scene.background = envMap;
    // console.log("env = " + Root.assetsManager.get("env"));
    // console.log("envMap = " + Root.assetsManager.get("envMap"));
  }
}
