const { resolve } = require("path");
const merge = require("webpack-merge");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const commonConfig = require("./webpack.config.common");

module.exports = merge(commonConfig, {
	mode: "production",
	optimization: {
		minimize: true,
		minimizer: [
			new TerserWebpackPlugin({
				parallel: true,
				terserOptions: {
					cache: true,
					ecma: 6,
					toplevel: true,
					compress: {
						drop_console: true,
					}
				}
			})
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			inject: true,
			template: resolve(__dirname, "src", "client", "index.html"),
			minify: true
		})
	]
});
