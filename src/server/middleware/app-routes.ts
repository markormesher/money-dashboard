import Compression = require("compression");
import { Express, Request, Response, static as expressStatic } from "express";
import { resolve } from "path";
import Webpack = require("webpack");
import webpackDevMiddleware = require("webpack-dev-middleware");
import webpackHotMiddleware = require("webpack-hot-middleware");
import { getDevWebpackConfig } from "../helpers/config-loader";

const webpackDevConfig = getDevWebpackConfig();
const compiler = Webpack(webpackDevConfig);
const clientBuildPath = resolve(__dirname, "..", "..", "client");

function setupDevAppRoutes(app: Express) {
	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackDevConfig.output.publicPath,
		stats: {
			colors: true,
		},
	}));
	app.use(webpackHotMiddleware(compiler));

	// all other requests be handled by UI itself
	app.get("*", (req: Request, res: Response) => res.sendFile(resolve(clientBuildPath, "index.html")));
}

function setupProdAppRoutes(app: Express) {
	app.use(Compression());
	app.use("/", expressStatic(clientBuildPath));

	// all other requests be handled by UI
	app.get("*", (req: Request, res: Response) => res.sendFile(resolve(clientBuildPath, "index.html")));
}

export {
	setupDevAppRoutes,
	setupProdAppRoutes,
};
