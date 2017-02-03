/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

const util = require("util");

// expand each of the project IDs to begin with all the prefixes.
function expandDeps(project, prefixes, extras) {
    if (util.isFunction(extras)) { extras = extras(project); }
    if (extras == null) { extras = []; }
    return (project.dependencies || [])
        .map((dep) => prefixes.concat(dep).join("-"))
        .concat(extras.map((dep) => dep.replace("*", project.id)));
}

/**
 * This function defines a group of tasks for each project that defines the given block. Tasks are
 * generated with the following name scheme:
 *  - [block]-[taskname]-[project.id] normal build task for each project,
 *  - [block]-[taskname] parent task to run each of the project tasks,
 *  - [block]-[taskname]-w-[project.id] watch task for each project,
 *  - [block]-[taskname]-w parent task to run each of the project watch tasks,
 *
 * The watch task is run when the relevant files are changed during development. It should not
 * fail on errors and can use debug options such as sourcemaps.
 *
 * Any given dependencies will be run before each of the project tasks. Also, any project
 * dependencies will be mapped to the task prefix and run before each project task. (For instance,
 * if project X depends on project Y then task sass-compile-X will depend on task sass-compile-Y.)
 *
 * @param block {string} block name of task
 * @param taskname {string} name of task
 * @param dependencies {string[]} dependencies for generated task and watch task
 * @param callback {(project, isDevMode) => stream} task callback
 */
module.exports = (blueprint, gulp) => {
    return (block, taskname, dependencies, callback) => {
        if (!Array.isArray(dependencies) && !util.isFunction(dependencies)) {
            throw new Error(`${block}-${taskname} expected dependencies array or function.`);
        }
        if (!util.isFunction(callback)) {
            throw new Error(`${block}-${taskname} expected callback function.`);
        }

        const projects = blueprint.projectsWithBlock(block);

        // create build tasks with all dependencies
        const taskNames = projects.map((project) => {
            const taskName = [block, taskname, project.id].join("-");
            const deps = expandDeps(project, [block, taskname], dependencies);
            gulp.task(taskName, deps, () => callback(project, false));
            return taskName;
        });

        // create watch tasks with no dependencies
        const watchTaskNames = projects.map((project) => {
            const watchName = [block, taskname, "w", project.id].join("-");
            gulp.task(watchName, [], () => callback(project, true));
            return watchName;
        });

        // create parents tasks to run individual project tasks
        gulp.task([block, taskname].join("-"), taskNames);
        gulp.task([block, taskname, "w"].join("-"), watchTaskNames);
    };
};
