/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

// Notes about adding a new package.
//
// * Even if you don't have a copy task, you should add `copy: false` to run a
//   no-op copy task. This allows other packages that depend on yours to contain
//   a copy task without failing the gulp build.

/*
interface IProject {
    id: string;

    // working directory of this project
    cwd: string;

    // ids of dependent projects. each task will run corresponding dependency task first.
    dependencies: string[];

    // copy files `to` directories, with given base. false value creates no-op task (for dependency).
    copy?: false | { [glob: string]: { to: string[], base?: string } };

    // whether to run isometric/server-side rendering tests
    isotest?: true;

    // whether to run karma unit tests
    karma?: true;

    // whether to compile sass sources.
    // "compile" simply runs sassc + autoprefixer.
    // "bundle" also inlines all imports and copies url() assets to the output directory such that
    //   all styles are in one file and all necessary assets are within the dist/ directory.
    sass: "compile" | "bundle";

    // whether to compile typescript sources
    typescript?: true;

    // paths to .scss files to concatenate and export as variables.{scss,less,ts}
    variables?: string[];

    webpack?: {
        // webpack bundle config:
        entry: string;
        dest: string;

        // package names to resolve to the locally installed npm package
        localResolve?: string[];
    }
}
*/

// prioritizing legibility over correctness here
// tslint:disable:object-literal-sort-keys

const projects = [
    {
        id: "core",
        cwd: "packages/core/",
        dependencies: [],
        isotest: true,
        karma: true,
        sass: "compile",
        typescript: true,
        // sass files to concatenate and export as `variables.{scss,less,ts}`
        variables: [
            "src/common/_colors.scss",
            "src/common/_color-aliases.scss",
            "src/common/_variables.scss",
            "src/generated/_icon-variables.scss",
        ],
    }, {
        id: "datetime",
        cwd: "packages/datetime/",
        dependencies: ["core"],
        isotest: true,
        karma: true,
        sass: "compile",
        typescript: true,
    }, {
        id: "docs",
        cwd: "packages/docs/",
        dependencies: ["core"],
        sass: "compile",
        typescript: true,
    }, {
        id: "labs",
        cwd: "packages/labs/",
        dependencies: ["core"],
        isotest: true,
        karma: true,
        sass: "compile",
        typescript: true,
    }, {
        id: "site-docs",
        cwd: "packages/site-docs/",
        dependencies: [
            // You must add your package to this dependency list if you have any
            // examples in the docs.
            "core",
            "datetime",
            "docs",
            "table",
        ],
        sass: "bundle",
        webpack: {
            entry: "src/index.tsx",
            dest: "dist",
            localResolve: [
                // locally resolve @blueprintjs packages so example components will compile
                // (they all import @blueprint/* but don't actually have themselves in their node_modules)
                "@blueprintjs/core",
                "@blueprintjs/datetime",
                "@blueprintjs/docs",
                "@blueprintjs/table",
                "dom4",
                "moment",
                "normalize.css",
                "react",
                "react-addons-css-transition-group",
                "react-dom",
            ],
        },
        copy: {
            "resources/favicon.png": { to: ["resources/"], base: "resources/" },
            "src/index.html": { to: [""], base: "src/" },
        },
    }, {
        id: "site-landing",
        cwd: "packages/site-landing/",
        dependencies: ["core"],
        sass: "bundle",
    }, {
        id: "table",
        cwd: "packages/table/",
        dependencies: ["core"],
        isotest: true,
        karma: true,
        sass: "compile",
        typescript: true,
    },
];

require("./gulp")(require("gulp"), { projects });
