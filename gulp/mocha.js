/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const path = require("path");

module.exports = (gulp, plugins, blueprint) => {
    blueprint.task("karma", "mocha", [], (project) => {
        require("ts-node/register");
        return gulp.src(path.join(project.cwd, "test", "index.ts"))
            .pipe(plugins.mocha({
                require: [
                    "./packages/core/test/setup.ts",
                ],
            }));
    });
};
