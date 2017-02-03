/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp) => {
    const rs = require("run-sequence").use(gulp);

    // lint all the things!
    // this will fail the CI build but will not block starting the server.
    // your editor is expected to handle this in realtime during development.
    gulp.task("check", ["tslint", "sass-lint", "typescript-lint", "typescript-lint-docs"]);

    // compile all the project source codes EXCEPT for docs webpack
    // (so we can run it in watch mode during development)
    gulp.task("compile", ["sass-compile", "typescript-compile", "copy-files"]);

    // generate docs data files
    gulp.task("docs", ["docs-interfaces", "docs-kss", "docs-versions", "docs-releases"]);

    // perform a full build of the code and then finish
    gulp.task("build", (done) => rs("clean", "compile", "bundle", "webpack-compile-docs", done));

    // build code, run unit tests, terminate
    gulp.task("test", ["test-dist", "karma", "isotest"]);

    // compile code and start watching for development
    gulp.task("default", (done) => rs("clean", "compile", "docs", "watch", done));
};
