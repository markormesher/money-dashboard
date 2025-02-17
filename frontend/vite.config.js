import { defineConfig } from "vite";

export default defineConfig(({}) => {
  return {
    root: "./src",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      watch: {
        buildDelay: 500,
      },
    },
    define: {
      "process.env": {},
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
