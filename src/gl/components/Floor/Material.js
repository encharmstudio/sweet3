import { MeshStandardMaterial, RepeatWrapping, Vector2 } from "three";
import { Root } from "../../Root";

export class Material extends MeshStandardMaterial {
  constructor({
    size,
    mirror,
    hasBlur,
    mixBlur,
    mixStrength,
    minDepthThreshold,
    maxDepthThreshold,
    depthScale,
    depthToBlurRatioBias,
    distortion,
    distortionMap,
    textureMatrix,
    tDiffuse,
    tDepth,
    tDiffuseBlur,
    color = 0x303030,
  }) {
    const map = Root.assetsManager.get("floor.diffuse"),
          normalMap = Root.assetsManager.get("floor.normal"),
          roughnessMap = Root.assetsManager.get("floor.roughness");

    map.repeat = normalMap.repeat = roughnessMap.repeat = new Vector2(size[0] * .5, size[1] * .5);
    map.wrapS = map.wrapT = normalMap.wrapS = normalMap.wrapT = 
      roughnessMap.wrapS = roughnessMap.wrapT = RepeatWrapping;

    super({
      defines: {
        USE_BLUR: hasBlur ? "" : undefined,
        USE_DEPTH: depthScale > 0 ? "" : undefined,
        USE_DISTORTION: distortionMap ? "" : undefined,  
      },
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0,
      map,
      normalMap,
      roughnessMap,
      color,
      dithering: true,
    });
    
    this.onBeforeCompile = shader => {
      if (!shader.defines.USE_UV) {
        shader.defines.USE_UV = "";
      }
      shader.uniforms.distortionMap = { value: distortionMap };
      shader.uniforms.hasBlur = { value: hasBlur };
      shader.uniforms.tDiffuse = { value: tDiffuse };
      shader.uniforms.tDepth = { value: tDepth };
      shader.uniforms.tDiffuseBlur = { value: tDiffuseBlur };
      shader.uniforms.textureMatrix = { value: textureMatrix };
      shader.uniforms.mirror = { value: mirror };
      shader.uniforms.mixBlur = { value: mixBlur };
      shader.uniforms.mixStrength = { value: mixStrength };
      shader.uniforms.minDepthThreshold = { value: minDepthThreshold };
      shader.uniforms.maxDepthThreshold = { value: maxDepthThreshold };
      shader.uniforms.depthScale = { value: depthScale };
      shader.uniforms.depthToBlurRatioBias = { value: depthToBlurRatioBias };
      shader.uniforms.distortion = { value: distortion };

      shader.vertexShader = /*glsl*/`
varying vec2 vDefaultUV;
varying vec4 vCustomUV;
varying vec4 vWorldPosition;
uniform mat4 textureMatrix;
      ` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <project_vertex>", /*glsl*/`#include <project_vertex>
vDefaultUV = uv;
vCustomUV = textureMatrix * vec4(position, 1.);
vWorldPosition = modelMatrix * vec4(position, 1.);
gl_Position = projectionMatrix * viewMatrix * vWorldPosition;`
      );

      shader.fragmentShader = /*glsl*/`
varying vec2 vDefaultUV;
varying vec4 vCustomUV;
varying vec4 vWorldPosition;
uniform sampler2D shadowMap;
uniform sampler2D tDiffuse;
uniform sampler2D tDiffuseBlur;
uniform sampler2D tDepth;
uniform sampler2D distortionMap;
uniform float distortion;
uniform float cameraNear;
uniform float cameraFar;
uniform float mixBlur;
uniform float mirror;
uniform float mixStrength;
uniform float minDepthThreshold;
uniform float maxDepthThreshold;
uniform float depthScale;
uniform float depthToBlurRatioBias;
#ifdef USE_BLUR
  uniform bool hasBlur;
#endif
          ` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>", /*glsl*/`#include <emissivemap_fragment>
float distortionFactor = 0.0;
#ifdef USE_DISTORTION
  distortionFactor = texture2D(distortionMap, vUv).r * distortion;
#endif
vec4 new_vUv = vCustomUV;
new_vUv.x += distortionFactor;
new_vUv.y += distortionFactor;
vec4 base = texture2DProj(tDiffuse, new_vUv);
vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);
vec4 merge = base;
#ifdef USE_NORMALMAP
  vec2 normal_uv = vec2(0.0);
  vec4 normalColor = texture2D(normalMap, vUv * normalScale);
  vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
  vec3 coord = new_vUv.xyz / new_vUv.w;
  normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
  vec4 base_normal = texture2D(tDiffuse, normal_uv);
  vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
  merge = base_normal;
  blur = blur_normal;
#endif
#ifdef USE_DEPTH
  float depthFactor = 0.0001;
  vec4 depth = texture2DProj(tDepth, new_vUv);
  depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
  depthFactor *= depthScale;
  depthFactor = max(0.0001, min(1.0, depthFactor));
  #ifdef USE_BLUR
    blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
    merge = merge * min(1.0, depthFactor + 0.5);
  #else
    merge = merge * depthFactor;
  #endif
#endif
float reflectorRoughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
  vec4 reflectorTexelRoughness = texture2D(roughnessMap, vUv);
  reflectorRoughnessFactor *= reflectorTexelRoughness.g;
#endif
#ifdef USE_BLUR
  float blurFactor = min(1., mixBlur * reflectorRoughnessFactor);
  merge = mix(merge, blur, blurFactor);
#endif
diffuseColor.rgb = diffuseColor.rgb * ((1. - min(1., mirror)) + merge.rgb * mixStrength);
        `
      );
    };
  }
}