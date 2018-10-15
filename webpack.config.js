const {resolve, join} = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const VisualizerPlugin = require('webpack-visualizer-plugin');

const IS_PROD = process.env.NODE_ENV === "production";
const IS_DEV = !IS_PROD; // for better readability below

const babelLoader = {
	loader: 'babel-loader',
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
				regex: /^[A-Z_]+$/,
			},
		},
	},
});

module.exports = {
	mode: IS_PROD ? "production" : "development",
	cache: false,
	target: "web",
	entry: resolve(__dirname, "src", "client", "index.tsx"),
	output: {
		publicPath: "/",
		path: resolve(__dirname, "build", "client"),
		filename: "[name]~bundle.js",

		// used for in development mode only
		hotUpdateMainFilename: "hot-update.[hash:6].json",
		hotUpdateChunkFilename: "hot-update.[hash:6].js",
	},
	module: {
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
				test: /\.css$/,
				include: /node_modules/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(s?)css$/,
				exclude: /node_modules/,
				use: [
					"style-loader",
					{
						loader: "typings-for-css-modules-loader",
						options: {
							camelCase: true,
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
		new VisualizerPlugin(),
		new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
		new webpack.EnvironmentPlugin(["NODE_ENV"]),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new HtmlWebpackPlugin({
			template: resolve(__dirname, "src", "client", "index.html"),
			inject: true,
			hash: IS_DEV,
			minify: IS_PROD,
			alwaysWriteToDisk: IS_DEV,
		}),
		IS_DEV && new webpack.HotModuleReplacementPlugin(),
	].filter((p) => p !== false),
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		modules: ["node_modules", join("src", "client")],
	},
	optimization: {
		minimize: IS_PROD,
		minimizer: IS_PROD ? [terserMinimiser] : [],
		namedModules: IS_DEV,
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
					chunks: "all",
				},
			},
		},
	},
	stats: {
		assetsSort: "!size",
		children: false,
		chunks: false,
		colors: true,
		entrypoints: false,
		modules: false,
	},
};
