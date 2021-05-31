const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
      script: "./app.js",
    },
    plugins: [
      new HtmlWebpackPlugin()
    ],
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].js",
        clean: true
    },
    module: {
        rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        open: true,
        hot: true,
        overlay: true,
        port: 4310
    }
}
