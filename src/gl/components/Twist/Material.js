import { MeshPhysicalMaterial } from "three";
import { bind } from "../../global/Uniforms";

export class Material extends MeshPhysicalMaterial {
  constructor() {
    super({
      transmission: 0.0,
      roughness: 0.0,
      metalness: 1.0,
      thickness: 0.1,
    });

    this.onBeforeCompile = (shader) => {
      shader.uniforms.time = bind("time");

      shader.vertexShader =
        /*glsl*/ `
        uniform float time;
        
        mat4 rotationMatrix(vec3 axis, float angle) {

          axis = normalize(axis);
          float s = sin(angle);
          float c = cos(angle);
          float oc = 1.0 - c;

          return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0, oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0, oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0, 0.0, 0.0, 0.0, 1.0);
        }

        vec3 rotate(vec3 v, vec3 axis, float angle) {
          mat4 m = rotationMatrix(axis, angle);
          return (m * vec4(v, 1.0)).xyz;
        }
        
        float qinticInOut(float t) {
          return t < 0.5
          ? +16.0 * pow(t, 5.0)
          : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
        }  
     ` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <displacementmap_vertex>",
        /*glsl*/ `#include <displacementmap_vertex>
       
        vec4 newposition = vec4(position, 1.0);
        vec3 axes = vec3(0., 1., 0.);
        float norm = 0.5;
        vec3 newpos = position;
        float offset = ( dot(axes, position) +norm/2.)/norm;
        float speed = 0.0005;
        float distortion = 5.0;
        
        float localprogress = clamp( (fract(time*speed) - 0.01*distortion*offset)/(1. - 0.01*distortion), 0., 1.);
        localprogress = qinticInOut(localprogress)*PI;
        newpos = rotate(newpos, axes, localprogress);
        vec3 newnormal = rotate(normal, axes, localprogress);
        vNormal = normalMatrix*newnormal;   
        transformed = newpos.xyz;`
      );
    };
  }
}
