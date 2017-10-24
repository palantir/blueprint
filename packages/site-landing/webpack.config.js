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
        rules: [
            {
                include: SRC,
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        compilerOptions: { declaration: false },
                    },
                }],
            }, {
                include: SRC,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader", "sass-loader"],
                }),
                test: /\.s[ac]ss$/,
            }, {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "assets/fonts/[name].[ext]"
                    }
                }],
            }, {
                test: /resources\/img\/.*\.(svg|png)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "assets/img/[name].[ext]"
                    }
                }],
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
        extensions: [".js", ".ts", ".tsx"],
    },
};
