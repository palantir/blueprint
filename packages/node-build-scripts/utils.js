/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// @ts-check
const path = require("path");

/**
 * @param {string} dirName name of directory containing XML file.
 * @param {string} fileName name of XML file (defaults to current directory name).
 */
function junitReportPath(dirName, fileName = path.basename(process.cwd())) {
    return path.join(
        __dirname,
        "../..",
        process.env.JUNIT_REPORT_PATH,
        dirName,
        `${fileName}.xml`,
    );
}

module.exports = { junitReportPath }
