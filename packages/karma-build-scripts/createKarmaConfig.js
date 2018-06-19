/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const path = require("path");
const webpack = require("webpack");
const coreManifest = require("../core/package.json");
const webpackBuildScripts = require("@blueprintjs/webpack-build-scripts");

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
    /** @type {KarmaOptions} */ { coverage = true, dirname, coverageExcludes, coverageOverrides }
) {
    const packageManifest = require(`${dirname}/package.json`);

    const config = {
        basePath: dirname,
        browserNoActivityTimeout: 100000,
        browsers: ["ChromeHeadless"],
        client: {
            useIframe: false,
        },
        coverageReporter: {
            check: {
                each: {
                    lines: COVERAGE_PERCENT,
                    statements: COVERAGE_PERCENT,
                    excludes: coverageExcludes,
                    overrides: coverageOverrides,
                },
            },
            includeAllSources: true,
            // save interim raw coverage report in memory. remapCoverage will output final report.
            type: "in-memory",
            watermarks: {
                lines: [COVERAGE_PERCENT, COVERAGE_PERCENT_HIGH],
                statements: [COVERAGE_PERCENT, COVERAGE_PERCENT_HIGH],
            },
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
            path.join(dirname, `../core/${coreManifest.style}`),
            path.join(dirname, packageManifest.style),
            path.join(dirname, "test/index.ts"),
        ],
        frameworks: ["mocha"],
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        port: KARMA_SERVER_PORT,
        preprocessors: {
            [path.join(dirname, "test/**/*.ts")]: "sourcemap",
            [path.join(dirname, "test/index.ts")]: ["webpack", "sourcemap"],
        },
        // define where to save final remapped coverage reports
        remapCoverageReporter: {
            'text-summary': null,
            html: './coverage/html',
            cobertura: './coverage/cobertura.xml'
        },
        reporters: ["mocha"],
        singleRun: true,
        webpack: Object.assign({}, webpackBuildScripts.karmaConfig, {
            entry: {
                testIndex: [
                    path.resolve(dirname, "test/index.ts"),
                ],
            },
        }),
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
        const outputDir = path.join(
            __dirname,
            "../..",
            process.env.JUNIT_REPORT_PATH,
            path.basename(dirname),
        );
        console.info(`Karma report will appear in ${outputDir}`);
        // disable mocha reporter on circle for HUGE performance increase
        config.reporters = ["dots", "junit"];
        config.junitReporter = {
            outputDir: outputDir,
            outputFile: "report.xml",
            useBrowserName: false,
        };
    }

    if (coverage) {
        // enable coverage. these plugins are already configured above.
        config.reporters.push("coverage", "remap-coverage");
    }

    return config;
};

