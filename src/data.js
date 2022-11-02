export const defaults = {
  devMode: true,

  backgroundColor: 0x001020,

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

  env: {
    type: "env",
    path: "textures/env/MR_INT-003_Kitchen_Pierre.hdr",
  },

  cross: "models/cross.glb",
};
