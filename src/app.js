import { GL } from "./gl";

const settings = {
  backgroundColor: 0x030303,
};

const container = document.getElementById("container");

const gl = new GL({
  settings,
  container,
});

// showLoader()

gl.load().then(() => {

  // hideLoader()

});