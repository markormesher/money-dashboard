const { resolve, join } = require("path");
const webpack = require("webpack");

module.exports = {
	target: "web",
	entry: resolve(__dirname, "src", "client", "index.tsx"),
	output: {
		publicPath: "/",
		path: resolve(__dirname, "build", "client"),
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
				test: /\.css$/,
				include: /node_modules/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(s?)css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "typings-for-css-modules-loader",
						options: {
							sourceMap: true,
							modules: true,
							namedExport: true,
							camelCase: true,
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
		new webpack.WatchIgnorePlugin([
			/css\.d\.ts$/
		]),
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
