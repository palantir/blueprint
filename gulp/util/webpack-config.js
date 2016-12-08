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
                "NODE_ENV": process.env.NODE_ENV,
            },
        }),
    ],
    resolve: { extensions: ["", ".js"] },
};

// Default webpack config options with support for TypeScript files
const TYPESCRIPT_CONFIG = {
    devtool: "source-map",
    module: {
        loaders: [
            { loader: "json-loader", test: /\.json$/ },
            { loader: "ts-loader", test: /\.tsx?$/ },
        ],
    },
    resolve: {
        extensions: ["", ".js", ".ts", ".tsx"],
    },
    ts: {
        compilerOptions: {
            // do not emit declarations since we are bundling
            declaration: false,
            // ensure that only @types from this project are used (instead of from local symlinked blueprint)
            typeRoots: ["node_modules/@types"],
        },
    },
};

const EXTERNALS = {
    "@blueprintjs/core": "Blueprint",
    "classnames": "classNames",
    "dom4": "window",
    "jquery": "$",
    "react": "React",
    "react-addons-css-transition-group": "React.addons.CSSTransitionGroup",
    "react-day-picker": "DayPicker",
    "react-dom": "ReactDOM",
    "tether": "Tether",
};

const ASSIGN_SIG = "var __assign = (this && this.__assign) || Object.assign || function(t) {";
const EXTENDS_SIG = "var __extends = (this && this.__extends) || function (d, b) {";
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
                [project.id]: `./${project.cwd}/dist/index.js`,
            },
            externals: EXTERNALS,
            output: {
                filename: `${project.id}.js`,
                library: globalName(project.id),
                path: `${project.cwd}/dist`,
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
            module: Object.assign({}, TYPESCRIPT_CONFIG.module, {
                postLoaders: [
                    {
                        loader: "istanbul-instrumenter",
                        test: /src\/.*\.tsx?$/,
                    },
                    {
                        loader: "string-replace",
                        query: {
                            multiple: [
                                { search: ASSIGN_SIG, replace: ISTANBUL_IGNORE + "\n" + ASSIGN_SIG },
                                { search: EXTENDS_SIG, replace: ISTANBUL_IGNORE + "\n" + EXTENDS_SIG },
                            ],
                        },
                        test: /\.tsx$/,
                    },
                ],
            }),
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
                [project.id]: `./${project.cwd}/${project.webpack.entry}`,
            },
            externals: project.webpack.externals,
            output: {
                filename: `${project.id}.js`,
                library: project.webpack.global,
                path: `${project.cwd}/${project.webpack.dest}`,
            },
        }, TYPESCRIPT_CONFIG, { plugins: DEFAULT_CONFIG.plugins });

        if (project.webpack.localResolve != null) {
            returnVal.resolve.alias = project.webpack.localResolve.reduce((obj, pkg) => {
                obj[pkg] = path.resolve(`./${project.cwd}/node_modules/${pkg}`);
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
            version: false,
        }));
        if (callback != null) {
            return callback();
        }
    },
};
