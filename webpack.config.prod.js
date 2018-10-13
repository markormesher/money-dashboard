const { resolve } = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const commonConfig = require("./webpack.config.common");

module.exports = merge(commonConfig, {
	mode: "production",
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			inject: true,
			template: resolve(__dirname, "src", "client", "index.html"),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			}
		})
	]
});
