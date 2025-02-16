import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app/app.js";
import { RouterProvider } from "./components/app/router.js";
import { Toaster } from "./components/toaster/toaster.js";

document.body.innerHTML = `<div id="app"></div>`;
const root = createRoot(document.getElementById("app")!);
root.render(
  <RouterProvider>
    <App />
    <Toaster />
  </RouterProvider>,
);
