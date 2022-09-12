const uniforms = {}

export const bind = (name, defaultValue) => {
  if (!(name in uniforms)) {
    if (defaultValue === undefined) {
      console.log(`Using 0 for undefined uniform ${name}`)
      defaultValue = 0
    }
    uniforms[name] = { value: defaultValue }
  }
  return uniforms[name]
}

export const provide = (name, value) => {
  if (name in uniforms) {
    uniforms[name].value = value
  } else {
    uniforms[name] = { value }
  }
}