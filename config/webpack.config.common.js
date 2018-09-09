const { resolve, join } = require("path");
const webpack = require("webpack");

const isProd = process.env.NODE_ENV.indexOf("prod") >= 0;

console.log(resolve(__dirname, isProd ? "tsconfig.prod.js" : "tsconfig.prod.js"));

module.exports = {
	target: "web",
	entry: resolve(__dirname, "..", "src", "client", "index.tsx"),
	output: {
		publicPath: "/",
		path: resolve(__dirname, "..", "build", "client"),
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				loader: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.js(x?)$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["react", "env"]
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.html$/,
				loader: "html-loader"
			},
			{
				test: /\.(s?)css/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: "[name]__[local]___[hash:base64:5]"
						}
					},
					{
						loader: "sass-loader"
					}
				]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: "file-loader"
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new webpack.EnvironmentPlugin(["NODE_ENV"])
	],
	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"],
		modules: ["node_modules", join("src", "client")]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
					chunks: "all"
				}
			}
		}
	},
	stats: {
		assetsSort: "!size",
		children: false,
		chunks: false,
		colors: true,
		entrypoints: false,
		modules: false
	}
};
