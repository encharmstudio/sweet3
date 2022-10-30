export const defaults = {
  devMode: true,

  camera: {
    fov: 45,
    near: .1,
    far: 2e3,
  },

  backgroundColor: 0x010101,

  post: {
    exposure: 1,
    vignette: .1,
    halo: .1,
    anaglyph: 2,
    bloom: {
      filter: {
        threshold: 1,
      },
    },
  },
};

export const assets = {
  openSansSauce: "fonts/OpenSauceSans-Black.json",
  "openSansSauce.texture": "fonts/OpenSauceSans-Black.png",

  "floor.diffuse": "textures/squfloor/diffuse.jpg",
  "floor.normal": "textures/squfloor/normal.jpg",
  "floor.roughness": "textures/squfloor/roughness.jpg",
};
