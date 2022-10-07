import {
  MeshStandardMaterial,
  RepeatWrapping,
  Vector2,
  MeshPhongMaterial,
  ShaderMaterial,
  MeshPhysicalMaterial,
} from "three";
import { Root } from "../../Root";
import { bind } from "../../global/Uniforms";
import { guiSettingsBind } from "../../global/GUI";

import vertexShader from "./shaderSphere.vert";
import fragmentShader from "./shaderSphere.frag";

export class Material1 extends ShaderMaterial {
  constructor() {
   
    super({
      uniforms: {
        time: bind("time"),
        test: guiSettingsBind("test", 0, 1),
      },
      defines: {
        USE_TANGENT: "",
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    
    //this.onBeforeCompile = shader => {
     
}}

export class Material2 extends MeshPhongMaterial {
  constructor() {
   
    super({
      color: 0xffffff, // red (can also use a CSS color string here)
      flatShading: false,
    });
    
    //this.onBeforeCompile = shader => {
     
}}

export class Material extends MeshPhysicalMaterial {
  constructor() {
    super({
      //color: 0x00ff00, // red (can also use a CSS color string here)
      //flatShading: false,
      transmission: 0.0,
      roughness: 0.0,
      metalness: 1.0,
      thickness: 0.1,
    });
  

    this.onBeforeCompile = (shader) => {
      shader.uniforms.time = bind("time");
      shader.uniforms.uSubdivision = {value: new Vector2(128.0, 128.0)};

      shader.vertexShader =
        /*glsl*/ `
      // varying vec2 vUv;
      // varying vec3 vNormal;
      // varying vec3 vPosition;

      uniform float time;
      uniform vec2 uSubdivision;

      #define M_PI 3.1415926535897932384626433832795

       //#define USE_TANGENT ""

      //	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec4 P){
  vec4 Pi0 = floor(P); // Integer part for indexing
  vec4 Pi1 = Pi0 + 1.0; // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec4 Pf0 = fract(P); // Fractional part for interpolation
  vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = vec4(Pi0.zzzz);
  vec4 iz1 = vec4(Pi1.zzzz);
  vec4 iw0 = vec4(Pi0.wwww);
  vec4 iw1 = vec4(Pi1.wwww);

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 ixy00 = permute(ixy0 + iw0);
  vec4 ixy01 = permute(ixy0 + iw1);
  vec4 ixy10 = permute(ixy1 + iw0);
  vec4 ixy11 = permute(ixy1 + iw1);

  vec4 gx00 = ixy00 / 7.0;
  vec4 gy00 = floor(gx00) / 7.0;
  vec4 gz00 = floor(gy00) / 6.0;
  gx00 = fract(gx00) - 0.5;
  gy00 = fract(gy00) - 0.5;
  gz00 = fract(gz00) - 0.5;
  vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
  vec4 sw00 = step(gw00, vec4(0.0));
  gx00 -= sw00 * (step(0.0, gx00) - 0.5);
  gy00 -= sw00 * (step(0.0, gy00) - 0.5);

  vec4 gx01 = ixy01 / 7.0;
  vec4 gy01 = floor(gx01) / 7.0;
  vec4 gz01 = floor(gy01) / 6.0;
  gx01 = fract(gx01) - 0.5;
  gy01 = fract(gy01) - 0.5;
  gz01 = fract(gz01) - 0.5;
  vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
  vec4 sw01 = step(gw01, vec4(0.0));
  gx01 -= sw01 * (step(0.0, gx01) - 0.5);
  gy01 -= sw01 * (step(0.0, gy01) - 0.5);

  vec4 gx10 = ixy10 / 7.0;
  vec4 gy10 = floor(gx10) / 7.0;
  vec4 gz10 = floor(gy10) / 6.0;
  gx10 = fract(gx10) - 0.5;
  gy10 = fract(gy10) - 0.5;
  gz10 = fract(gz10) - 0.5;
  vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
  vec4 sw10 = step(gw10, vec4(0.0));
  gx10 -= sw10 * (step(0.0, gx10) - 0.5);
  gy10 -= sw10 * (step(0.0, gy10) - 0.5);

  vec4 gx11 = ixy11 / 7.0;
  vec4 gy11 = floor(gx11) / 7.0;
  vec4 gz11 = floor(gy11) / 6.0;
  gx11 = fract(gx11) - 0.5;
  gy11 = fract(gy11) - 0.5;
  gz11 = fract(gz11) - 0.5;
  vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
  vec4 sw11 = step(gw11, vec4(0.0));
  gx11 -= sw11 * (step(0.0, gx11) - 0.5);
  gy11 -= sw11 * (step(0.0, gy11) - 0.5);

  vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
  vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
  vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
  vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
  vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
  vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
  vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
  vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
  vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
  vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
  vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
  vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
  vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
  vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
  vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
  vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

  vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
  g0000 *= norm00.x;
  g0100 *= norm00.y;
  g1000 *= norm00.z;
  g1100 *= norm00.w;

  vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
  g0001 *= norm01.x;
  g0101 *= norm01.y;
  g1001 *= norm01.z;
  g1101 *= norm01.w;

  vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
  g0010 *= norm10.x;
  g0110 *= norm10.y;
  g1010 *= norm10.z;
  g1110 *= norm10.w;

  vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
  g0011 *= norm11.x;
  g0111 *= norm11.y;
  g1011 *= norm11.z;
  g1111 *= norm11.w;

  float n0000 = dot(g0000, Pf0);
  float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
  float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
  float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
  float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
  float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
  float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
  float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
  float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
  float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
  float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
  float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
  float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
  float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
  float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
  float n1111 = dot(g1111, Pf1);

  vec4 fade_xyzw = fade(Pf0);
  vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
  vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
  vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
  vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
  float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
  return 2.2 * n_xyzw;
}
   

    float distorted_position(vec3 p){
      //float n = cnoise(p*2.0 + vec3(time*0.001));
      //float n = cnoise(p*2.0 + vec3(cos(time*0.01)*0.01));
       float n1 = cnoise(vec4(p*2.0, time*0.001));
       float n2 = cnoise(vec4(p*5.0, n1));
       //float n3 = cnoise(vec4(p*2.0, n2));

      // vec3 distoredPosition = p;
      // distoredPosition += cnoise(vec4(distoredPosition * 0.005 + 0.01, time*0.005)) * 0.005;

      // float n = cnoise(vec4(distoredPosition * 0.005 + 0.01, time*0.005));
       return n2;
    }

    vec3 ortohonal(vec3 n){
      return normalize(
        abs(n.x)>abs(n.z) ? vec3(-n.y,n.x,0.0) :vec3(0.0,-n.z,n.y)
      );
    }

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

    float mapRange(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    float amp = 0.5;
     ` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <displacementmap_vertex>",
        /*glsl*/ `#include <displacementmap_vertex>
      //  vUv = uv;
      //vNormal = normal;
      //vPosition = position;
      // vec3 n =  normalMatrix * normal;
      // vec3 dipslacedposition = transformed + amp * normal  * distorted_position(transformed);

      // vec3 tangent = ortohonal(normal );
      // vec3 bitangent = normalize(cross(tangent, normal ));

      // vec3 neighbour1 = transformed + tangent * 0.0001;
      // vec3 neighbour2 = transformed + bitangent * 0.0001;

      // vec3 displacedN1 = neighbour1 + amp * normal  * distorted_position(neighbour1);
      // vec3 displacedN2 = neighbour2 + amp * normal  * distorted_position(neighbour2);
     

      // vec3 dipslacedTangent = normalize(displacedN1 - dipslacedposition);
      // vec3 dipslacedBitangent = normalize(displacedN2 - dipslacedposition);
      // vec3 dipslacedNormal = normalize(cross(dipslacedBitangent, dipslacedTangent));

      // //vNormal = dipslacedNormal; 
       //vNormal = normalMatrix * dipslacedNormal; 
       //vNormal =  normalMatrix * normal;
      ///////////////////////////////////////////////////////////////////////////////////
      vec4 newposition =  vec4(position, 1.0);
     
     
      // float t = time * 0.001; 
      // float m = mod(t,3.0);
     
      // float progress = m;
      // float p1 = mapRange(newposition.y, -1.0, 1.0, 0.0, 1.0);  
      // float p2 = smoothstep(0.0,1.0,p1);  
      // float t1 = mapRange(progress, 0.0, 1.0, 0.0, 3.1415 * 1.0 + p2 * 3.0);  
      // float t2 = clamp(t1,0.0,3.1415 * 1.0);

      // mat4 mRotation = rotationMatrix(vec3(0.0,1.0,1.0), t2);



  
      // newposition = mRotation * newposition;

      // vec4 normalNew = mRotation * vec4(normal,1.0);


     //vNormal =  normalMatrix * normalNew.xyz;

        vec3 axes = vec3(0., 1., 0.);

        float norm = 4.0;
        norm = 0.5;
        vec3 newpos = position;
        //float offset = ( dot(axis2, position) +norm/2.)/norm;
        float offset = ( dot(vec3(0.0, 1.0, 0.0), position) +norm/2.)/norm;
        float speed = 0.0005;
        float distortion = 5.0;
        
         float localprogress = clamp( (fract(time*speed) - 0.01*distortion*offset)/(1. - 0.01*distortion), 0., 1.);
         localprogress = qinticInOut(localprogress)*PI;
         newpos = rotate(newpos, axes, localprogress);
         vec3 newnormal = rotate(normal, axes, localprogress);
         vNormal = normalMatrix*newnormal;
      
      ///////////////////////////////////////////////////////////////////////////////////

         transformed = newpos.xyz;
      
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(dipslacedposition, 1.);`

        // vUv = uv;
        // float norm = 4.0;
        // norm = 0.5;
        // vec3 newpos = position;
        // //float offset = ( dot(axis2, position) +norm/2.)/norm;
        // float offset = ( dot(vec3(1., 0., 0.), position) +norm/2.)/norm;
        // float speed = 1.0;
        // float distortion = 0.5;

        // // float localprogress = clamp( (progress - 0.01*distortion*offset)/(1. - 0.01*distortion), 0., 1.);
        // float localprogress = clamp( (fract(time*speed) - 0.01*distortion*offset)/(1. - 0.01*distortion), 0., 1.);
        // localprogress = qinticInOut(localprogress)*PI;
        // newpos = rotate(newpos, axis, localprogress);
        // vec3 newnormal = rotate(normal, vec3(1., 0., 0.), localprogress);
        // vNormal = normalMatrix*newnormal;
        // vec4 worldPosition = modelMatrix * vec4( newpos, 1.0);
        // //vEye = normalize(worldPosition.xyz - cameraPosition);
        // gl_Position = projectionMatrix * modelViewMatrix * vec4( newpos, 1.0 );
        // vPosition = newpos;
      );
    };
  }
}


