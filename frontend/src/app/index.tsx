import { createRoot } from "react-dom/client";
import { App } from "./components/app/app.js";
import { RouterProvider } from "./components/app/router.js";
import { Toaster } from "./components/toaster/toaster.js";

document.body.innerHTML = `<div id="app"></div>`;
const appEl = document.getElementById("app");
if (appEl) {
	const root = createRoot(appEl);
	root.render(
		<RouterProvider>
			<App />
			<Toaster />
		</RouterProvider>,
	);
} else {
	document.body.innerHTML = "Error: couldn't find app div.";
}
