/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const glob = require("glob");
const path = require("path");

/** @type {Object[]} */
const packages = glob.sync("packages/*/package.json")
    .map((filename) => {
        /** @type {Object} */
        const json = require(`../${filename}`);
        json.cwd = path.dirname(filename);
        return json;
    });

const packageMap = packages.reduce((dict, pkg) => {
    dict[pkg.name] = pkg;
    return dict;
}, {});

const projects = packages.map((pkg) => ({
    id: pkg.name.replace("@blueprint/", ""),
    cwd: pkg.cwd,
    dependencies: Object.keys(pkg.dependencies).filter((dep) => packageMap[dep] != null),
    sass: pkg.style != null,
    typescript: pkg.typings != null,
    karma: pkg.typings != null,
    // TODO: detect webpack?
    // TODO: copy? not needed if we publish entire package?
}));

console.log(projects);

module.exports = projects;
