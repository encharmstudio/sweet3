import { Sweet3 } from "./sweet3";

const settings = {
};

const container = document.getElementById("container");

const sweet3 = new Sweet3({
  container,
  settings,
});

// showLoader()

await sweet3.load();

// hideLoader()
