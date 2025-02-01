import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app/app";
import { RouterProvider } from "./components/app/router";

document.body.innerHTML = `<div id="app"></div>`;
const root = createRoot(document.getElementById("app")!);
root.render(
  <RouterProvider>
    <App />
  </RouterProvider>,
);
