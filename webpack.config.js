const { resolve, join } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const notFalse = (val) => val !== false;

const nodeEnv = process.env.NODE_ENV.toLowerCase();
if (nodeEnv != "production" && nodeEnv != "development") {
  throw new Error(`NODE_ENV was not set to one of 'production' or 'development' (it was '${nodeEnv}')`);
}

let entryPoints;
if (nodeEnv == "development") {
  entryPoints = ["webpack-hot-middleware/client?reload=true", resolve(__dirname, "src", "client", "index.tsx")];
} else {
  entryPoints = resolve(__dirname, "src", "client", "index.tsx");
}

const babelLoader = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
    plugins: ["@babel/plugin-syntax-dynamic-import", "date-fns"],
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            esmodules: true,
          },
          modules: false,
        },
      ],
      ["@babel/typescript"],
      ["@babel/react"],
    ],
  },
};

const config = {
  mode: nodeEnv,
  target: "web",
  entry: entryPoints,
  output: {
    filename: "main.js",
    path: resolve(__dirname, "build", "client"),
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [babelLoader, "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.js(x?)$/,
        use: [babelLoader],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(s?)css$/,
        include: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(s?)css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader",
            options: {
              esModule: false,
            },
          },
          {
            loader: "dts-css-modules-loader",
            options: {
              namedExports: false,
            },
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                exportLocalsConvention: "camelCaseOnly",
                localIdentName: "[name]__[local]",
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        type: "asset/resource",
        dependency: { not: ["url"] },
      },
    ],
  },
  devtool: nodeEnv == "development" ? "source-map" : false,
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src", "client", "index.html"),
      publicPath: "/",
    }),
    nodeEnv == "development" && new webpack.HotModuleReplacementPlugin(),
  ].filter(notFalse),
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: ["node_modules", join("src", "client")],
    alias: {
      // this shim turns all typeorm decorators into no-ops
      typeorm: resolve(__dirname, "node_modules/typeorm/typeorm-model-shim"),
    },
  },
};

module.exports = config;
