import { resolve } from "path";
import * as Compression from "compression";
import { Express, Request, Response, static as expressStatic } from "express";
import * as Webpack from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import { isDev } from "../utils/env";

function setupClientRoutes(app: Express): void {
  if (isDev()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webpackConfig: Webpack.Configuration = require(resolve(__dirname, "..", "..", "webpack.config.js"));
    const compiler = Webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
    app.use(webpackHotMiddleware(compiler));
  } else {
    app.use(Compression());
    app.use("/", expressStatic(resolve(__dirname, "..", "client")));
  }

  // all other requests be handled by UI
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(resolve(__dirname, "..", "client", "index.html"));
  });
}

export { setupClientRoutes };
