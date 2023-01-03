const { resolve, join } = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const notFalse = (val) => val !== false;
const nodeEnv = process.env.NODE_ENV.toLowerCase();
const IS_TEST = nodeEnv === "test";
const IS_PROD = nodeEnv === "production";
const IS_DEV = nodeEnv === "development";

if (!IS_TEST && !IS_PROD && !IS_DEV) {
  throw new Error("NODE_ENV was not set to one of test, production or development (it was '" + nodeEnv + "'");
}

const entryPoints = IS_TEST
  ? glob.sync("./src/client/**/*.tests.{ts,tsx}")
  : resolve(__dirname, "src", "client", "index.tsx");

const babelLoader = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
    plugins: [IS_TEST && "istanbul", "@babel/plugin-syntax-dynamic-import", "date-fns"].filter(notFalse),
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

const tsLoader = {
  loader: "ts-loader",
  options: {
    transpileOnly: true,
    configFile: IS_TEST ? "tsconfig.test-client.json" : "tsconfig.json",
    compilerOptions: {
      module: "esnext",
    },
  },
};

const config = {
  mode: IS_PROD ? "production" : "development",
  target: "web",
  entry: entryPoints,
  output: {
    filename: "main.js",
    path: resolve(__dirname, "build", "client"),
  },
  module: {
    // in test mode, disable this warning
    exprContextCritical: !IS_TEST,

    rules: [
      {
        test: /\.ts(x?)$/,
        use: [babelLoader, tsLoader],
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
              namedExport: false,
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
  devtool: IS_PROD ? false : "source-map",
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    !IS_TEST &&
      new HtmlWebpackPlugin({
        template: resolve(__dirname, "src", "client", "index.html"),
      }),
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
