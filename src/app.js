import { GL } from "./gl";

const settings = {
  backgroundColor: 0x001020,
};

const container = document.getElementById("container");

const gl = new GL({
  settings,
  container,
});


// showPreloader()

gl.load().then(() => {

  // hidePreloader()

});