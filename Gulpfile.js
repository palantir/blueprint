/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

// Notes about adding a new package.
//
// * Even if you don't have a copy task, you should add `copy: false` to run a
//   no-op copy task. This allows other packages that depend on yours to contain
//   a copy task without failing the gulp build.

const projects = [
    {
        id: "core",
        cwd: "packages/core",
        dependencies: [],
        sass: true,
        typescript: true,
        karma: true,
        copy: false,
    }, {
        id: "datetime",
        cwd: "packages/datetime",
        dependencies: ["core"],
        sass: true,
        typescript: true,
        karma: true,
        copy: false,
    }, {
        id: "docs",
        cwd: "packages/docs/",
        dependencies: [
            // You must add your package to this dependency list if you have any
            // examples in the docs.
            "core",
            "datetime",
        ],
        sass: true,
        webpack: {
            entry: "src/index.tsx",
            dest: "dist",
            localResolve: [
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
        },
    }, {
        id: "landing",
        cwd: "packages/landing/",
        dependencies: ["core"],
        sass: true,
    },
];

require("./gulp")(require("gulp"), { projects });
