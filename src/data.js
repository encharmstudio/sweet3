export const defaults = {
  devMode: true,

  backgroundColor: 0x101010,

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

  progress: 0.0,  
};

export const assets = {
  openSansSauce: "fonts/OpenSauceSans-Black.json",
  "openSansSauce.texture": "fonts/OpenSauceSans-Black.png",

  AvenirNext: "fonts/AvenirNext/AvenirNextRoundedStd-Demi-msdf.json",
  "AvenirNext.texture": "fonts/AvenirNext/AvenirNextRoundedStd-Demi.png",

  BungeeSpice: "fonts/BungeeSpice/BungeeSpice-Regular-msdf.json",
  "BungeeSpice.texture": "fonts/BungeeSpice/BungeeSpice-Regular.png",

  doom: "fonts/doom/AmazDooMLeft-msdf.json",
  "doom.texture": "fonts/doom/DooM.png",

  "floor.diffuse": "textures/squfloor/diffuse.jpg",
  "floor.normal": "textures/squfloor/normal.jpg",
  "floor.roughness": "textures/squfloor/roughness.jpg",
};
