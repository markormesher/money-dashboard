const { resolve } = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");

const commonConfig = require("./webpack.config.common");

module.exports = merge(commonConfig, {
	mode: "development",
	output: {
		hotUpdateMainFilename: "hot-update.[hash:6].json",
		hotUpdateChunkFilename: "hot-update.[hash:6].js"
	},
	optimization: {
		minimize: false,
		namedModules: true
	},
	devtool: "cheap-module-eval-source-map",
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			template: resolve(__dirname, "src", "client", "index.html"),
			alwaysWriteToDisk: true
		}),
		new HtmlWebpackHarddiskPlugin({
			outputPath: resolve(__dirname, "build", "client")
		})
	]
});
