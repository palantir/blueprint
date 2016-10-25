/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const path = require("path");
const plugins = require("gulp-load-plugins")();

/**
 * @param projectPath {string} path to project root
 */
function getTypescriptSources(projectPath) {
    return [path.join(projectPath, "{src,test}/**/*.ts{,x}")];
}

/**
 * @param projects {Object[]} list of projects in this package
 */
module.exports = (gulp, projects) => {
    var blueprint = {
        /** List of blueprint projects to build, IN ORDER. */
        projects,

        /**
         * @param project {Object}
         * @param includeTestFiles {boolean} whether to include test sources, which must live in "test" directory
         * @returns {Array} array of typescript source files
         */
        getTypescriptSources(project, includeTestFiles) {
            const projectFiles = getTypescriptSources(project.cwd);
            if (includeTestFiles) {
                return projectFiles.concat(getTypescriptSources(path.join(project.cwd, "test")));
            }
            return projectFiles;
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
    };

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
