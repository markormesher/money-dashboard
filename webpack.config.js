const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const md5 = require("md5");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const {resolve, join} = require("path");

const notFalse = (val) => val !== false;
const IS_TEST = process.env.TEST === "y";
const IS_PROD = !IS_TEST && process.env.NODE_ENV === "production";
const IS_DEV = !IS_PROD; // for better readability below

const outputDir = resolve(__dirname, "build", IS_TEST ? "client-test" : "client");
const entryPoints = IS_TEST ? glob.sync("./src/client/**/*.tests.{ts,tsx}") : resolve(__dirname, "src", "client", "index.tsx");

const babelLoader = {
	loader: "babel-loader",
	options: {
		cacheDirectory: true,
		plugins: [
			"@babel/plugin-syntax-dynamic-import",
		],
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
		// these override the settings in tsconfig.json
		compilerOptions: {
			module: "esnext",
			target: "es6",
			removeComments: false, // keep for webpackChunkName and similar
		},
	},
};

const terserMinimiser = new TerserWebpackPlugin({
	parallel: true,
	terserOptions: {
		cache: true,
		ecma: 6,
		toplevel: true,
		module: true,
		sourceMap: false,
		compress: {
			drop_console: true,
		},
		mangle: {
			properties: {
				regex: /^[A-Z]+_[A-Z_]+$/, // should only match redux actions and cache keys
			},
		},
	},
});

module.exports = {
	mode: IS_PROD ? "production" : "development",
	cache: false,
	target: "web",
	entry: entryPoints,
	output: {
		publicPath: "/",
		path: outputDir,
		filename: IS_PROD ? "[name]~[contenthash].js" : "[name].js",

		// used in development mode only
		hotUpdateMainFilename: "hot-update.[hash:6].json",
		hotUpdateChunkFilename: "hot-update.[hash:6].js",
	},
	node: {
		fs: "empty",
		__filename: true,
		__dirname: true,
	},
	module: {
		// in test mode, disable this warning
		exprContextCritical: !IS_TEST,

		rules: [
			{
				test: /\.ts(x?)$/,
				use: [
					babelLoader,
					tsLoader,
				],
				exclude: /node_modules/,
			},
			{
				test: /\.js(x?)$/,
				use: [
					babelLoader,
				],
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				loader: "html-loader",
			},
			{
				test: /\.(s?)css$/,
				include: /node_modules/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.(s?)css$/,
				exclude: /node_modules/,
				use: [
					IS_PROD ? MiniCssExtractPlugin.loader : "style-loader",
					{
						loader: "typings-for-css-modules-loader",
						options: {
							camelCase: "only",
							modules: true,
							namedExport: true,
							sourceMap: IS_DEV,
							localIdentName: IS_PROD ? "[hash:base64:5]" : "[name]_[local]_[hash:base64:5]",
						},
					},
					"sass-loader",
				],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: "file-loader",
			},
		],
	},
	devtool: IS_PROD ? false : "cheap-module-eval-source-map",
	plugins: [
		new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
		new webpack.EnvironmentPlugin(["NODE_ENV"]),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		!IS_TEST && new HtmlWebpackPlugin({
			template: resolve(__dirname, "src", "client", "index.html"),
			inject: true,
			hash: IS_DEV,
			minify: IS_PROD,
			alwaysWriteToDisk: IS_DEV,
		}),
		IS_PROD && new ReplaceInFileWebpackPlugin([{
			dir: outputDir,
			rules: [
				{
					// replace redux action strings with hashes
					search: /"([A-Za-z]+)Actions\.([_A-Z]+)"/g,
					replace: (str) => "\"" + md5(str).substring(0, 6) + "\"",
				},
				{
					// replace redux cache keys with hashes
					search: /"([A-Za-z]+)CacheKeys\.([_A-Z]+)"/g,
					replace: (str) => "\"" + md5(str).substring(0, 6) + "\"",
				},
			],
		}]),
		IS_PROD && new MiniCssExtractPlugin({
			minimize: true,
			filename: "[name]~[contenthash].css",
		}),
		IS_PROD && new BundleAnalyzerPlugin({
			analyzerMode: "static",
			openAnalyzer: false,
		}),
		IS_DEV && !IS_TEST && new webpack.HotModuleReplacementPlugin(),
	].filter(notFalse),
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		modules: ["node_modules", join("src", "client")],
	},
	optimization: {
		minimize: IS_PROD,
		minimizer: IS_PROD ? [terserMinimiser] : [],
		namedModules: IS_DEV,
		splitChunks: !IS_TEST && {
			chunks: "all",
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: (m) => "npm." + m.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1].replace("@", ""),
				},
				globalStyles: {
					test: /[\\/]global-styles[\\/]/,
					name: (m) => {
						const res = m.resource || m.issuer.resource;
						return "styles." + res.match(/[\\/]global-styles[\\/](.*?)\.(s?)css/)[1].toLowerCase();
					},
				},
			},
		},
	},
	stats: !IS_TEST && {
		assetsSort: "!size",
		children: false,
		chunks: false,
		colors: true,
		entrypoints: false,
		modules: false,
	},
};
