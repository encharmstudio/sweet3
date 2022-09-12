export const defaults = {
  devMode: true,

  backgroundColor: 0x001020,

  post: {
    exposure: 1,
    vignette: .1,
    halo: .5,
    anaglyph: 10,
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
