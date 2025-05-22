import { Root } from "@/Root";

const uniforms = {};

export const bind = (name, defaultValue) => {
  if (!(name in uniforms)) {
    if (defaultValue === undefined) {
      Root.settings.devMode &&
        console.log(`Using 0 for undefined uniform ${name}`);
      defaultValue = 0;
    }
    uniforms[name] = { value: defaultValue };
  }
  return uniforms[name];
};

export const provide = (name, value) => {
  if (name in uniforms) {
    uniforms[name].value = value;
  } else {
    uniforms[name] = { value };
  }
};

export const autoBind = (shader) => {
  const regExp = /uniform\s+\w+\s+(\w+)@(\S+);/g;
  const uniforms = {};

  shader.vertexShader = shader.vertexShader.replaceAll(
    regExp,
    (match, name, binder) => {
      uniforms[name] = bind(binder);
      return match.replace(`@${binder}`, "");
    }
  );

  shader.fragmentShader = shader.fragmentShader.replaceAll(
    regExp,
    (match, name, binder) => {
      uniforms[name] = bind(binder);
      return match.replace(`@${binder}`, "");
    }
  );

  shader.uniforms = { ...shader.uniforms, ...uniforms };
  return shader;
};
