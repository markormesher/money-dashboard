const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: path.resolve(__dirname, "src", "index.jsx"),
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	devServer: {
		contentBase: "./src",
		publicPath: "/dist"
	},
	module: {
		rules: [
			{
				oneOf: [
					{
						test: /\.js(x?)/,
						include: [path.resolve(__dirname, "src")],
						use: [
							{
								loader: "babel-loader",
								options: {
									presets: ["react", "es2015"]
								}
							}
						]
					},
					{
						test: /\.scss/,
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
						test: /\.css/,
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
							}
						]
					},
					{
						loader: require.resolve('file-loader'),
						// Exclude `js` files to keep "css" loader working as it injects
						// it's runtime that would otherwise processed through "file" loader.
						// Also exclude `html` and `json` extensions so they get processed
						// by webpacks internal loaders.
						exclude: [/\.js(x?)$/, /\.html$/, /\.json$/],
						options: {
							name: 'static/media/[name].[hash:8].[ext]',
						},
					},
				]
			}
		]
	},

	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),

		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "index.html"),
			inject: 'body'
		})
	],

	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		dgram: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty',
	},
};
