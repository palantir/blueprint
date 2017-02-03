/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const path = require("path");
const plugins = require("gulp-load-plugins")();

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

        /**
         * Returns an array of task names of the format [prefix]-[...prefixes]-[project]
         * for every project with the given block.
         * @param block  {string} name of project config block
         * @param prefix {string} first prefix, defaults to block name
         * @param prefixes {string[]} additional prefixes before project name
         * @returns {string[]}
         */
        taskMapper(block, prefix = block, ...prefixes) {
            return blueprint
                .projectsWithBlock(block)
                .map(({ id }) => [prefix, ...prefixes, id].join("-"));
        },
    }, config);

    blueprint.task = require("./util/task.js")(blueprint, gulp);

    [
        "aliases",
        "copy",
        "dist",
        "docs",
        "hygiene",
        "icons",
        "isotest",
        "karma",
        "sass",
        "typescript",
        "webpack",
        "watch",
    ].forEach((taskGroup) => {
        require(`./${taskGroup}.js`)(blueprint, gulp, plugins);
    });
};
