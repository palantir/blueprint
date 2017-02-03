/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const rs = require("run-sequence");
const path = require("path");
const util = require("util");
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
         * Define a group of tasks for projects with the given config block.
         * The special block `"all"` will operate on all projects.
         * The `block` is used as the task name, unless `name` is explicitly defined.
         * The `taskFn` is called for each matched project with `(project, taskName, depTaskNames)`.
         * The task name is of the format `[name]-[project.id]`.
         * Finally, a "group task" is defined with the base name that runs all the project tasks.
         * This group task can be configured to run in parallel or in sequence.
         * @param {{block: string, name?: string, parallel?: boolean}} options
         * @param {Function} taskFn called for each project containing block with `(project, taskName, depTaskNames)`
         */
        taskGroup(options, taskFn) {
            const { block, name = block, parallel = true } = options;

            const projects = (block === "all") ? blueprint.projects : blueprint.projectsWithBlock(block);

            const taskNames = projects.map((project) => {
                const { dependencies = [], id } = project;
                // string name is combined with block; array name ignores/overrides block
                const taskName = [name, id].join("-");
                const depNames = dependencies.map((dep) => [name, dep].join("-"));
                taskFn(project, taskName, depNames);
                return taskName;
            });

            // can run tasks in series when it's preferable to keep output separate
            gulp.task(name, parallel ? taskNames : (done) => rs(...taskNames, done));
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
