/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const fs = require("fs");
const path = require("path");

const webpackBuildScripts = require("@blueprintjs/webpack-build-scripts");

const coreManifest = require("../core/package.json");

const COVERAGE_PERCENT = 80;
const COVERAGE_PERCENT_HIGH = 90;
const KARMA_SERVER_PORT = 9876;

/**
 * @typedef {Object} KarmaOptions
 * @property {string} dirname
 * @property {boolean} coverage
 * @property {string[]} coverageExcludes
 * @property {{ [glob: string]: object }} coverageOverrides
 */

module.exports = function createKarmaConfig(
    /** @type {KarmaOptions} */ { coverage = true, dirname, coverageExcludes, coverageOverrides },
) {
    const packageManifest = require(`${dirname}/package.json`);

    const config = {
        basePath: dirname,
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 100000,
        browsers: ["ChromeHeadless"],
        client: {
            useIframe: false,
        },
        files: [
            {
                included: true,
                pattern: require.resolve("normalize.css/normalize.css"),
                watched: false,
            },
            {
                included: false,
                pattern: path.join(dirname, "resources/**/*"),
                watched: false,
            },
            getCoreStylesheetPath(dirname),
            path.join(dirname, packageManifest.style),
            path.join(dirname, "test/index.ts"),
        ],
        frameworks: ["mocha", "webpack"],
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        plugins: [
            "karma-webpack",
            "karma-mocha",
            require("karma-coverage"),
            require("karma-helpful-reporter"),
            require("karma-junit-reporter"),
            "karma-sourcemap-loader",
            "karma-chrome-launcher",
        ],
        port: KARMA_SERVER_PORT,
        preprocessors: {
            "src/index.ts": ["coverage"],
            "test/index.ts": ["webpack", "sourcemap"],
        },
        reporters: ["helpful"],
        singleRun: true,
        webpack: webpackBuildScripts.karmaConfig,
        webpackMiddleware: {
            noInfo: true,
            stats: {
                children: false,
                chunks: false,
            },
        },
    };

    // enable JUnit reporter only if env variable is set (such as on Circle)
    if (process.env.JUNIT_REPORT_PATH) {
        const outputDir = path.join(__dirname, "../..", process.env.JUNIT_REPORT_PATH, path.basename(dirname));
        console.info(`Karma report will appear in ${outputDir}`);
        // disable other reporters on circle for performance boost
        config.reporters = ["dots", "junit"];
        config.junitReporter = {
            outputDir,
            outputFile: "report.xml",
            useBrowserName: false,
        };
    }

    if (coverage) {
        config.reporters.push("coverage");
        config.coverageReporter = {
            check: {
                each: {
                    lines: COVERAGE_PERCENT,
                    statements: COVERAGE_PERCENT,
                    excludes: coverageExcludes,
                    overrides: coverageOverrides,
                },
            },
            includeAllSources: true,
            dir: "./coverage",
            reporters: [
                // reporters not supporting the `file` property
                { type: "html", subdir: "html" },
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                { type: "cobertura", subdir: ".", file: "cobertura.txt" },
            ],
            watermarks: {
                lines: [COVERAGE_PERCENT, COVERAGE_PERCENT_HIGH],
                statements: [COVERAGE_PERCENT, COVERAGE_PERCENT_HIGH],
            },
        };
    }

    return config;
};

/**
 * @param {string} dirname
 * @returns string
 */
function getCoreStylesheetPath(dirname) {
    const localCorePath = path.join(dirname, "../core");
    if (fs.existsSync(localCorePath)) {
        return path.join(localCorePath, coreManifest.style);
    } else {
        // resolves to "**/node_modules/@blueprintjs/core/lib/cjs/index.js"
        return path.join(require.resolve("@blueprintjs/core"), "../../../", coreManifest.style);
    }
}
