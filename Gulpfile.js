/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const COPY_CONFIG = {
    "resources/**/*": {to: ["src", "global"]},
    "bower.json": {to: ["global"]},
    "package.json": {to: ["src"]},
    "README.md": {to: ["global"]},
};

const projects = [
    {
        id: "core",
        cwd: "packages/core",
        dependencies: [],
        sass: true,
        typescript: true,
        karma: true,
        copy: COPY_CONFIG,
    }, {
        id: "datetime",
        cwd: "packages/datetime",
        dependencies: ["core"],
        sass: true,
        typescript: true,
        karma: true,
        copy: COPY_CONFIG,
    }, {
        id: "docs",
        cwd: "packages/docs/",
        dependencies: [
            // docs typescript "depends" on all other projects, but as it uses webpack entirely,
            // that dependency is expressed by making `webpack` tasks depend on `typescript` tasks.
        ],
        sass: {
            // override default dests, defined in sass.js
            dests: ["build"],
        },
        webpack: {
            entry: "src/index.tsx",
            dest: "build",
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
            "src/index.html": {to: [""], base: "src/"},
        },
    },
];

require("./gulp")(require("gulp"), projects);
