export const defaults = {
  devMode: !true,

  backgroundColor: 0x001020,

  post: {
    exposure: 1,
    vignette: 0.1,
    halo: 0.1,
    anaglyph: 2,
    bloom: {
      filter: {
        threshold: 1,
      },
    },
  },

  test: 0.0,
   //envMap: "textures/MR_INT-003_Kitchen_Pierre.hdr",
};

export const assets = {
  openSansSauce: "fonts/OpenSauceSans-Black.json",
  "openSansSauce.texture": "fonts/OpenSauceSans-Black.png",

  "floor.diffuse": "textures/squfloor/diffuse.jpg",
  "floor.normal": "textures/squfloor/normal.jpg",
  "floor.roughness": "textures/squfloor/roughness.jpg",

  env: {
    type: "env",
    path: "textures/MR_INT-003_Kitchen_Pierre.hdr",
  },
  //envMap: "textures/MR_INT-003_Kitchen_Pierre.hdr",
  cross: "models/cross.glb",
};
