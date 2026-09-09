#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Compares each Blueprint Next stylesheet with its BP6 sibling.
 */

// @ts-check

import { spawnSync } from "node:child_process";
import { existsSync, globSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const monorepoRootDir = join(import.meta.dirname, "..");
const nextStylesheets = globSync("packages/core/src/**/*-next.scss", {
    cwd: monorepoRootDir,
}).sort();

let comparedCount = 0;
let missingBp6SiblingCount = 0;

for (const nextStylesheet of nextStylesheets) {
    const expectedBp6Stylesheet = nextStylesheet.replace(/-next\.scss$/, ".scss");
    const unprefixedBp6Stylesheet = expectedBp6Stylesheet.replace(/\/_([^/]+\.scss)$/, "/$1");
    const bp6Stylesheet = existsSync(join(monorepoRootDir, expectedBp6Stylesheet))
        ? expectedBp6Stylesheet
        : unprefixedBp6Stylesheet;
    const bp6StylesheetExists = existsSync(join(monorepoRootDir, bp6Stylesheet));

    if (!bp6StylesheetExists) {
        console.error(`${bp6Stylesheet} does not exist; comparing ${nextStylesheet} with /dev/null.`);
        missingBp6SiblingCount++;
    }

    const result = spawnSync(
        "git",
        [
            "diff",
            "--no-index",
            "--no-ext-diff",
            "--no-color",
            "--",
            bp6StylesheetExists ? bp6Stylesheet : "/dev/null",
            nextStylesheet,
        ],
        {
            cwd: monorepoRootDir,
            encoding: "utf8",
        },
    );

    if (result.error != null) {
        throw result.error;
    }
    if (result.status !== 0 && result.status !== 1) {
        process.stderr.write(result.stderr);
        process.exit(result.status ?? 2);
    }

    const outputPath = join(monorepoRootDir, nextStylesheet.replace(/\.scss$/, ".diff"));
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, result.stdout);
    comparedCount++;
}

console.info(
    `Wrote ${comparedCount} diffs next to their BP7 stylesheets; ${missingBp6SiblingCount} stylesheet had no BP6 sibling.`,
);
