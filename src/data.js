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
  uLimitCurve: 0.0,
  uLimitShear: 0.0,
  wave: 0.0,
  twist: 0.0,
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

  atsurt: "fonts/atsurt/atsurt.json",
  "atsurt.texture": "fonts/atsurt/atsurt.png",

  opensaucesansbold: "fonts/oss/bold.json",
  "opensaucesansbold.texture": "fonts/oss/bold.png",

  opensaucesansligth: "fonts/oss/ligth.json",
  "opensaucesansligth.texture": "fonts/oss/ligth.png",

  greta0: "textures/greta/1.jpg",
  greta1: "textures/greta/2.jpg",
  greta2: "textures/greta/3.jpg",
  greta3: "textures/greta/4.jpg",
  greta4: "textures/greta/1.jpg",
  greta5: "textures/greta/2.jpg",
  greta6: "textures/greta/3.jpg",
  greta7: "textures/greta/4.jpg",

  kernel: "models/Box_With_UV2.glb",
};
