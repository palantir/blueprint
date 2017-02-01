/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const path = require("path");
const plugins = require("gulp-load-plugins")();
const assign = require("lodash/assign");

/**
 * @param config {Object} array of projects and optional dest() function
 */
module.exports = (gulp, config) => {
    const blueprint = Object.assign({
        /**
         * Returns a path in the default output directory, `dist/`.
         * @param project {Object} current project
         * @param paths {string[]} subdirectories
         */
        destPath(project, ...paths) {
            return path.join(project.cwd, "dist", ...paths);
        },

        /**
         * @param id {string}
         * @returns {Object} project config block with given id
         */
        findProject(id) {
            return this.projects.find((project) => project.id === id);
        },

        /**
         * @param block {string|string[]} name of project config block or list of names
         * @returns {Object[]} all projects that have each of the config blocks
         */
        projectsWithBlock(block) {
            return blueprint.projects.filter((project) => {
                if (Array.isArray(block)) {
                    return block.every((key) => project.hasOwnProperty(key));
                } else {
                    return project.hasOwnProperty(block);
                }
            });
        },

        taskMapper(block, prefix, extra) {
            return blueprint
                .projectsWithBlock(block)
                .map((project) => prefix + project.id)
                .concat(extra || []);
        },
    }, config);

    blueprint.task = require("./util/task.js")(gulp, blueprint);

    [
        "aliases",
        "copy",
        "dist",
        "docs",
        "hygiene",
        "icons",
        "karma",
        "sass",
        "typescript",
        "webpack",
        "watch",
    ].forEach((taskGroup) => {
        require(`./${taskGroup}.js`)(gulp, plugins, blueprint);
    });
};
