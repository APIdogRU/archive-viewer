const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	mode: isProduction ? 'production' : 'development',
	entry: {
		main: path.resolve('src', 'index.tsx'),
	},
	output: {
		path: path.resolve('dist'),
		filename: '[name].bundle.js',
	},
	devServer: {
		contentBase: path.resolve('dist'),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s?css$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	plugins: [
		new webpack.EnvironmentPlugin({
			VERSION: process.env.npm_package_version,
			YEAR: String(new Date().getFullYear()),
		}),
		new HtmlWebpackPlugin({
			template: path.resolve('public', 'index.html'),
		}),
	],
	stats: 'errors-only',
};
