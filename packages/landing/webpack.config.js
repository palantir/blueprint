"use strict";

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const SRC = path.resolve("./src");
const DEST = path.resolve("./dist");
const NAME = "blueprint-landing.js";

module.exports = {
    entry: [
        `${SRC}/index.tsx`,
    ],

    module: {
        loaders: [
            {
                include: SRC,
                loader: "ts-loader",
                test: /\.tsx?$/,
            }, {
                include: SRC,
                loader: ExtractTextPlugin.extract("style", "css!postcss!sass"),
                test: /\.s[ac]ss$/,
            }, {
                loader: require.resolve("file-loader") + "?name=assets/fonts/[name].[ext]",
                test: /\.(eot|ttf|woff|woff2)$/,
            }, {
                loader: require.resolve("file-loader") + "?name=assets/img/[name].[ext]",
                test: /resources\/img\/.*\.(svg|png)$/,
            },
        ],
    },

    output: {
        filename: NAME,
        path: DEST,
    },

    plugins: [
        new ExtractTextPlugin(NAME.replace(/\.js$/, ".css")),
    ],

    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"],
    },

    ts: {
        compilerOptions: { declaration: false },
    },
};
