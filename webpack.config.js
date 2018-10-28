const {resolve, join} = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const md5 = require("md5");

const notFalse = (val) => val !== false;
const IS_PROD = process.env.NODE_ENV === "production";
const IS_DEV = !IS_PROD; // for better readability below

const outputDir = resolve(__dirname, "build", "client");

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
				regex: /^[A-Z]+_[A-Z_]+$/, // should only match redux actions
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
		path: outputDir,
		filename: "[name]~bundle.js",

		// used in development mode only
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
				test: /\.(s?)css$/,
				include: /node_modules/,
				use: ["style-loader", "css-loader", "sass-loader"],
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
		new ReplaceInFileWebpackPlugin([{
			dir: outputDir,
			rules: [
				{
					// remove line breaks and spaces in Font Awesome pre-minified output
					search: /(\\n+)( *)/g,
					replace: "",
				},
				IS_PROD && {
					// replace redux action strings with hashes
					search: /"([A-Za-z]+)Actions\.([_A-Z]+)"/g,
					replace: (str) => "\"" + md5(str).substring(0, 6) + "\"",
				},
			].filter(notFalse),
		}]),
		IS_PROD && new BundleAnalyzerPlugin({
			analyzerMode: "static",
			openAnalyzer: false,
		}),
		IS_DEV && new webpack.HotModuleReplacementPlugin(),
	].filter(notFalse),
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
