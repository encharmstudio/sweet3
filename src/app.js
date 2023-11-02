import { GL } from "./sweet3";

const settings = {
};

const container = document.getElementById("container");

const gl = new GL({
  container,
  settings,
});

// showLoader()

await gl.load();

// hideLoader()
