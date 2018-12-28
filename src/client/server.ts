import * as Compression from "compression";
import * as Express from "express";
import { Request, Response, static as expressStatic } from "express";
import { resolve } from "path";
import * as Webpack from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import { getDevWebpackConfig, isDev } from "../commons/config-loader";
import { logger } from "../commons/logging";

const app = Express();

const webpackDevConfig = getDevWebpackConfig();
const compiler = Webpack(webpackDevConfig);

if (isDev()) {
	app.use(webpackDevMiddleware(compiler, {
		publicPath: webpackDevConfig.output.publicPath,
		stats: {
			colors: true,
		},
	}));
	app.use(webpackHotMiddleware(compiler));
} else {
	app.use(Compression());
	app.use("/", expressStatic(__dirname));
}

// all other requests be handled by UI
app.get("*", (req: Request, res: Response) => {
	res.sendFile(resolve(__dirname, "index.html"));
});

// go!
const port = 3001;
const server = app.listen(port, () => logger.info(`Client server listening on port ${port}`));
process.on("SIGTERM", () => server.close(() => process.exit(0)));

// TODO: client React tests have gone missing
// TODO:
