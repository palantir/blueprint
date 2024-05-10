/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, join } from "node:path";
import { cwd, env } from "node:process";

import { karmaConfig as webpackConfig } from "@blueprintjs/webpack-build-scripts";

// TODO: refactor to use `await import()`, requires breaking change to make this API async
// see https://nodejs.org/docs/latest-v20.x/api/esm.html#import-attributes
const require = createRequire(import.meta.url);
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

export default function createKarmaConfig(
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
            // Explicitly use an iframe, which is the Karma default. This is
            // required for document-level focus event handlers to run in Chrome
            // headless.
            //
            // Focus event handlers not firing in headless browser testing are a
            // common problem. Here's a comment describing the problem in
            // general.
            //
            // https://github.com/testing-library/user-event/issues/553#issuecomment-787453619
            useIframe: true,
        },
        files: [
            {
                included: true,
                pattern: require.resolve("normalize.css/normalize.css"),
                watched: false,
            },
            {
                included: false,
                pattern: join(dirname, "resources/**/*"),
                watched: false,
            },
            getCoreStylesheetPath(dirname),
            join(dirname, packageManifest.style),
            join(dirname, "test/index.ts"),
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
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true,
            stats: {
                children: false,
                chunks: false,
            },
        },
    };

    // enable JUnit reporter only if env variable is set (such as on Circle)
    if (env.JUNIT_REPORT_PATH) {
        // HACKHACK: this path doesn't work when this package is used outside this monorepo
        const outputDir = join(cwd(), "../..", env.JUNIT_REPORT_PATH, basename(dirname));
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
}

/**
 * @param {string} dirname
 * @returns string
 */
function getCoreStylesheetPath(dirname) {
    const localCorePath = join(dirname, "../core");
    if (existsSync(localCorePath)) {
        return join(localCorePath, coreManifest.style);
    } else {
        // resolves to "**/node_modules/@blueprintjs/core/lib/cjs/index.js"
        return join(require.resolve("@blueprintjs/core"), "../../../", coreManifest.style);
    }
}
