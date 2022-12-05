const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        "bundle": "./tracker.js",
        "bundle.min": "./tracker.js",
    },
    output: {
        path: __dirname + "/test",
        filename: "[name].js",
        libraryTarget: "var",
        library: "RLTracker",
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
            },
        })]
    }
};