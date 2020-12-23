const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// webpack.config.js
const isDev = process.env.NODE_ENV === 'development'

const config = {
	target: 'web',
	entry: path.join(__dirname, "src/index.js"),
	output: {
		filename: "bundle.[hash:8].js",
		path: path.join(__dirname, "dist")
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.jsx$/,
				loader: 'babel-loader'
			},
			{
				test: /\.(gif|jpg|jpeg|png|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1024,
							name: '[name].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
    	// 请确保引入这个插件！
    	new VueLoaderPlugin(),
    	new webpack.DefinePlugin({
    		'process.env': {
    			NODE_ENV: isDev ? '"development"' : '"production"'
    		}
    	}),
    	new HTMLPlugin(),
    	// new MiniCssExtractPlugin({
	    //   // Options similar to the same options in webpackOptions.output
	    //   // all options are optional
	    //   filename: '[name].css',
	    //   chunkFilename: '[id].css',
	    //   ignoreOrder: false, // Enable to remove warnings about conflicting order
	    // }),
    ]
}

if (isDev) {
	config.module.rules.push({
		test: /\.styl/,
		use: [
			'style-loader',
			'css-loader',
			{
			    loader: 'postcss-loader',
			    options: {
			      sourceMap: true,
			    },
		    },
			'stylus-loader',
		]
	},)
	config.devtool = '#cheap-module-eval-source-map'
	config.devServer = {
		port: 8000,
		host: '0.0.0.0',
		overlay: {
			errors: true,
		},	
	}
} else {
	config.output.filename = '[name].[chunkhash:8].js'
	config.module.rules.push({
		test: /\.styl/,
		use: [
			'style-loader',
	        MiniCssExtractPlugin.loader,
	        'css-loader',
	        {
	            loader:'postcss-loader',
	            options:{sourceMap:true}
	        },
	        'stylus-loader'
		]
	},)
	config.plugins.push(
		new MiniCssExtractPlugin(
	        {
	            filename: 'styles.[contenthash:8].css'
	        }
	    )
	)
}

module.exports = config;