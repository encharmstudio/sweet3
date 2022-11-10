export const defaults = {
  devMode: true,

  camera: {
    fov: 45,
    near: 0.1,
    far: 2e3,
  },

  backgroundColor: 0x010101,

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

  "floor.diffuse": "textures/squfloor/diffuse.jpg",
  "floor.normal": "textures/squfloor/normal.jpg",
  "floor.roughness": "textures/squfloor/roughness.jpg",

  env: {
    type: "env",
    path: "textures/env/MR_INT-003_Kitchen_Pierre.hdr",
  },

  cross: "models/cross.glb",

  AvenirNext: "fonts/AvenirNext/AvenirNextRoundedStd-Demi-msdf.json",
  "AvenirNext.texture": "fonts/AvenirNext/AvenirNextRoundedStd-Demi.png",

  BungeeSpice: "fonts/BungeeSpice/BungeeSpice-Regular-msdf.json",
  "BungeeSpice.texture": "fonts/BungeeSpice/BungeeSpice-Regular.png",

  doom: "fonts/doom/AmazDooMLeft-msdf.json",
  "doom.texture": "fonts/doom/DooM.png",

  ATSURT: "fonts/ATSURT/ATSURT-LIGHT-1.TTF-msdf.json",
  "ATSURT.texture": "fonts/ATSURT/ATSURT-LIGHT-1TTF.png",

  OPENSAUCESANSBOLD:
    "fonts/OPENSAUCESANS/BOLD/OPENSAUCESANS-BOLD.TTF-msdf.json",
  "OPENSAUCESANSBOLD.texture": "fonts/OPENSAUCESANS/BOLD/OPENSAUCESANS-BOLDTTF.png",

  OPENSAUCESANSLIGTH:
    "fonts/OPENSAUCESANS/LIGTH/OPENSAUCESANS-LIGHT.TTF-msdf.json",
  "OPENSAUCESANSLIGTH.texture": "fonts/OPENSAUCESANS/LIGTH/OPENSAUCESANS-LIGHTTTF.png",    
};
