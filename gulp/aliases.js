/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp) => {
    const rs = require("run-sequence").use(gulp);

    // lint all the things!
    // this will fail the CI build but will not block starting the server.
    // your editor is expected to handle this in realtime during development.
    gulp.task("check", ["tslint", "tslint-gulp", "stylelint"]);

    // compile all the project source codes EXCEPT for docs webpack
    // (so we can run it in watch mode during development)
    gulp.task("compile", ["sass", "tsc", "copy"]);

    // generate docs data files
    gulp.task("docs", ["docs-interfaces", "docs-kss", "docs-versions", "docs-releases"]);

    // perform a full build of the code and then finish
    gulp.task("build", (done) => rs("clean", "compile", "bundle", "webpack-docs", done));

    // run test tasks in series to keep outputs separate
    gulp.task("test", (done) => rs("test-dist", "karma", "isotest", done));

    // compile code and start watching for development
    gulp.task("default", (done) => rs("clean", "compile", "docs", "watch", done));
};
