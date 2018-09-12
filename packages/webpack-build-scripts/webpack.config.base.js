/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const path = require("path");
const webpack = require("webpack");

// webpack plugins
const { CheckerPlugin } = require("awesome-typescript-loader");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackNotifierPlugin = require("webpack-notifier");

const { getPackageName } = require("./utils");

// globals
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const DEV_PORT = process.env.PORT || 9000;
const PACKAGE_NAME = getPackageName();

/**
 * Configure plugins loaded based on environment.
 */
const plugins = [
    // Used for async error reporting
    // Can remove after https://github.com/webpack/webpack/issues/3460 resolved
    new CheckerPlugin(),

    // TODO: enable this
    // Zero tolereance for circular depenendencies
    // new CircularDependencyPlugin({
    //     exclude: /.js|node_modules/,
    //     failOnError: true,
    // }),
];
if (IS_PRODUCTION) {
    plugins.push(
        // Define JS globals when running the build
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        }),

        // Some loaders accept configuration through webpack internals
        new webpack.LoaderOptionsPlugin({
            debug: false,
            minimize: true,
        }),

        // Only extract CSS to a file for production because it is slow
        new ExtractTextPlugin("[name].css"),

        // Minify JS
        new UglifyJsPlugin(),

        // Use scope hoisting to reduce the number of closures in the bundle script
        new webpack.optimize.ModuleConcatenationPlugin(),

        // add production plugins here
    );
} else {
    plugins.push(
        // Trigger an OS notification when the build succeeds
        new WebpackNotifierPlugin({
            title: PACKAGE_NAME,
        })

        // add dev plugins here
    );
}

// Module loaders for .scss files, used in reverse order (compile Sass, apply PostCSS, interpret CSS as modules)
const scssLoaders = [
    {
        loader: require.resolve("css-loader"),
        options: { minimize: IS_PRODUCTION },
    },
    {
        loader: require.resolve("postcss-loader"),
        options: {
            plugins: [require("autoprefixer"), require("postcss-discard-comments")]
        },
    },
    require.resolve("sass-loader"),
];

module.exports = {
    devtool: IS_PRODUCTION ? false : "inline-source-map",

    devServer: {
        contentBase: "./src",
        disableHostCheck: true,
        historyApiFallback: true,
        https: false,
        // TODO: enable HMR
        // hot: true,
        index: path.resolve(__dirname, "src/index.html"),
        inline: true,
        stats: "errors-only",
        open: false,
        overlay: {
            warnings: true,
            errors: true,
        },
        port: DEV_PORT,
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: require.resolve("awesome-typescript-loader"),
                options: {
                    configFileName: "./src/tsconfig.json",
                },
            },
            {
                test: /\.scss$/,
                use: IS_PRODUCTION
                    ? ExtractTextPlugin.extract({
                            fallback: require.resolve("style-loader"),
                            use: scssLoaders
                        })
                    : [ require.resolve("style-loader"), ...scssLoaders ],
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                loader: require.resolve("file-loader"),
                options: {
                    name: "[name].[ext]?[hash]",
                    outputPath: "assets/",
                },
            },
        ],
    },

    plugins,

    resolve: {
        extensions: [ ".js", ".jsx", ".ts", ".tsx", ".scss" ],
    },
};
