/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const path = require("path");
const gutil = require("gulp-util");
const camelCase = require("lodash/camelCase");
const upperFirst = require("lodash/upperFirst");
const webpack = require("webpack");

const globalName = (id) => upperFirst(camelCase(id));

const DEFAULT_CONFIG = {
    devtool: "source-map",
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ],
    resolve: { extensions: [".js"] },
};

// Default webpack config options with support for TypeScript files
const TYPESCRIPT_CONFIG = {
    devtool: "source-map",
    module: {
        rules: [
            {
                loader: "ts-loader",
                test: /\.tsx?$/,
            }, {
                loader: "source-map-loader",
                test: /\.js$/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
};

const EXTERNALS = {
    "@blueprintjs/core": "var Blueprint.Core",
    "@blueprintjs/datetime": "var Blueprint.Datetime",
    "@blueprintjs/table": "var Blueprint.Table",
    "classnames": "classNames",
    "dom4": "window",
    "es6-shim": "window",
    "jquery": "$",
    "moment": "moment",
    "react": "React",
    "react-addons-css-transition-group": "React.addons.CSSTransitionGroup",
    "react-day-picker": "DayPicker",
    "react-dom": "ReactDOM",
    "tether": "Tether",
};

const ISTANBUL_IGNORE = "/* istanbul ignore next */";

module.exports = {
    DEFAULT_CONFIG,
    TYPESCRIPT_CONFIG,

    // webpack external libraries
    EXTERNALS,

    // convert dash-case name to PascalCase
    globalName,

    /**
     * Generate a webpack config object for the given project to bundle pre-compiled CommonJS files.
     * Project ID becomes output filename. Expects `typescript` project key. This config
     * __does not__ support TypeScript sources.
     */
    generateWebpackBundleConfig: (project) => {
        if (project.typescript == null) {
            throw new Error(`Project ${project.id} must have a "typescript" config block.`);
        }

        const returnVal = Object.assign({
            entry: {
                [project.id]: path.resolve(project.cwd, "dist", "index.js"),
            },
            externals: EXTERNALS,
            output: {
                filename: `${project.id}.bundle.js`,
                library: ["Blueprint", globalName(project.id)],
                libraryTarget: "umd",
                path: path.join(project.cwd, "dist"),
            },
        }, DEFAULT_CONFIG);

        return returnVal;
    },

    /**
     * Generate a webpack config object for the given project to run unit tests through karma.
     * The karma-webpack plugin is used to perform a full webpack build, including ts-loader for
     * TypeScript compilation. Project ID becomes output filename.
     */
    generateWebpackKarmaConfig: (project) => {
        return Object.assign({}, TYPESCRIPT_CONFIG, {
            devtool: "inline-source-map",
            entry: {
                [project.id]: `./${project.cwd}/test/index`,
            },
            // these externals necessary for Enzyme harness
            externals: {
                "cheerio": "window",
                "react/addons": true,
                "react/lib/ExecutionEnvironment": true,
                "react/lib/ReactContext": true,
            },
            module: {
                rules: [
                    ...TYPESCRIPT_CONFIG.module.rules,
                    {
                        enforce: "post",
                        loader: "istanbul-instrumenter",
                        test: /src\/.*\.tsx?$/,
                    },
                ],
            },
            resolve: Object.assign({}, TYPESCRIPT_CONFIG.resolve, {
                alias: {
                    // webpack will load react twice because of symlinked node modules
                    // this makes it only use one copy of React
                    react: path.resolve(`./${project.cwd}/node_modules/react`),
                },
            }),
        });
    },

    /**
     * Generate a webpack config object for the given project to compile and bundle all sources
     * using ts-loader. Project ID becomes output filename. Expects `webpack` project key.
     */
    generateWebpackTypescriptConfig: (project) => {
        if (project.webpack == null) {
            throw new Error(`Project ${project.id} must have a "webpack" config block.`);
        }

        const returnVal = Object.assign({
            entry: {
                [project.id]: path.resolve(project.cwd, project.webpack.entry),
            },
            output: {
                filename: "[name].js",
                path: path.resolve(project.cwd, project.webpack.dest),
            },
            plugins: DEFAULT_CONFIG.plugins,
        }, TYPESCRIPT_CONFIG);

        if (project.webpack.localResolve != null) {
            returnVal.resolve.alias = project.webpack.localResolve.reduce((obj, pkg) => {
                obj[pkg] = path.resolve(project.cwd, "node_modules", pkg);
                return obj;
            }, {});
        }

        return returnVal;
    },

    webpackDone: (callback) => (err, stats) => {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }
        // all the options: https://webpack.github.io/docs/node.js-api.html#stats-tojson
        gutil.log("[webpack]", stats.toString({
            assets: true,
            chunks: false,
            colors: true,
            errorDetails: true,
            hash: false,
            source: false,
            timings: true,
            version: true,
        }));
        if (callback != null) {
            return callback();
        }
    },
};
