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

    // whether to run karma unit tests
    karma?: true;

    // whether to compile sass sources.
    // "compile" simply runs sassc + autoprefixer.
    // "bundle" also inlines all imports and copies url() assets to the output directory such that
    //   all styles are in one file and all necessary assets are within the dist/ directory.
    sass: "compile" | "bundle";

    // whether to compile typescript sources
    typescript?: true;

    webpack?: {
        // webpack bundle config:
        entry: string;
        dest: string;

        // package names to resolve to the locally installed npm package
        localResolve?: string[];
    }
}
*/

const projects = [
    {
        id: "core",
        cwd: "packages/core/",
        dependencies: [],
        copy: false,
        karma: true,
        sass: "compile",
        typescript: true,
    }, {
        id: "datetime",
        cwd: "packages/datetime/",
        dependencies: ["core"],
        copy: false,
        karma: true,
        sass: "compile",
        typescript: true,
    }, {
        id: "docs",
        cwd: "packages/docs/",
        dependencies: [
            // You must add your package to this dependency list if you have any
            // examples in the docs.
            "core",
            "datetime",
            "table",
        ],
        sass: "compile",
        webpack: {
            entry: "src/index.tsx",
            dest: "dist",
            localResolve: [
                // locally resolve @blueprintjs packages so example components will compile
                // (they all import @blueprint/* but don't actually have themselves in their node_modules)
                "@blueprintjs/core",
                "@blueprintjs/datetime",
                "@blueprintjs/table",
                "dom4",
                "jquery",
                "normalize.css",
                "react",
                "react-addons-css-transition-group",
                "react-dom",
            ],
        },
        copy: {
            "src/index.html": { to: [""], base: "src/" },
            "resources/favicon.png": { to: ["assets/"], base: "resources/" },
        },
    }, {
        id: "landing",
        cwd: "packages/landing/",
        dependencies: ["core"],
        sass: "bundle",
    }, {
        id: "table",
        cwd: "packages/table/",
        dependencies: ["core"],
        copy: false,
        karma: true,
        sass: "compile",
        typescript: true,
    },
];

require("./gulp")(require("gulp"), { projects });
