import path from "path";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  publicDir: "static",
  server: {
    port: 8080,
  },
  plugins: [glsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/sweet3"),
    },
  },
});
