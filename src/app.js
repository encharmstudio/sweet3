import { GL } from "./gl";

const settings = {
  backgroundColor: 0x000000,
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