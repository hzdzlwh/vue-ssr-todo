const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const ExtractPlugin = require('extract-text-webpack-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

let config

const isDev = process.env.NODE_ENV === 'development'

const plugins = [
    new ExtractPlugin('styles.[contentHash:8].css'),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"server"'
    })
]

if (isDev) {
    plugins.push(new VueServerPlugin())  // 引入此插件不会生成js文件，会生成一个json文件
}

config = merge(baseConfig, {
    target: 'node',
    entry: path.join(__dirname, '../client/server-entry.js'),
    devtool: 'source-map',
    output: {
        libraryTarget: 'commonjs2',   // 打包后的是module.exports
        filename: 'server-entry.js',
        path: path.join(__dirname, '../server-build')
    },
    externals: Object.keys(require('../package.json').dependencies),  // 声明不要打包的文件
    module: {
        rules: [
            {
              test: /\.styl/,
              use: ExtractPlugin.extract({
                fallback: 'vue-style-loader',
                use: [
                  'css-loader',
                  {
                    loader: 'postcss-loader',
                    options: {
                      sourceMap: true,
                    }
                  },
                  'stylus-loader'
                ]
              })
            }
        ]
    },
    plugins
})

config.resolve = {
    alias: {
        'model': path.join(__dirname, '../client/model/server-model.js')
    }
}

module.exports = config
