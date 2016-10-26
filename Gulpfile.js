/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const projects = [
    {
        id: "core",
        cwd: "packages/core",
        dependencies: [],
        sass: true,
        typescript: true,
        karma: true,
    }, {
        id: "datetime",
        cwd: "packages/datetime",
        dependencies: ["core"],
        sass: true,
        typescript: true,
        karma: true,
    }, {
        id: "docs",
        cwd: "packages/docs/",
        dependencies: [
            // docs typescript "depends" on all other projects, but as it uses webpack entirely,
            // that dependency is expressed by making `webpack` tasks depend on `typescript` tasks.
        ],
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
    },
];

require("./gulp")(require("gulp"), { projects });
