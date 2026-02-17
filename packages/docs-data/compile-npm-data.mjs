#!/usr/bin/env node
/**
 * @license Copyright 2024 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates npm package metadata for packages/docs-app, without using @documentalist.
 */

// @ts-check

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import semver from "semver";

/** Library packages to collect npm metadata for. */
const LIBRARY_PACKAGES = ["core", "datetime", "datetime2", "icons", "select", "table", "labs"];

const monorepoRootDir = resolve(cwd(), "../../");
const generatedSrcDir = resolve(cwd(), "./src/generated");
const npmDataFilePath = join(generatedSrcDir, "npm-data.json");

console.info(`[docs-data] compiling npm metadata for: ${LIBRARY_PACKAGES.join(", ")}`);

try {
    if (!existsSync(generatedSrcDir)) {
        mkdirSync(generatedSrcDir);
    }
    await generateNpmData();
} catch (err) {
    console.error(`[docs-data] ERROR when generating npm-data.json:`);
    throw err;
}

console.info(`[docs-data] successfully generated npm-data.json`);

async function generateNpmData() {
    /** @type {Record<string, { name: string; version: string; versions: string[] }>} */
    const result = {};

    for (const pkg of LIBRARY_PACKAGES) {
        const packageJsonPath = resolve(monorepoRootDir, `packages/${pkg}/package.json`);
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        const { name, version } = packageJson;

        const versions = await fetchPublishedVersions(name);
        // Keep only the latest patch for each major version, sorted descending
        const filteredVersions = filterToLatestPerMajor(versions);

        result[name] = { name, version, versions: filteredVersions };
    }

    writeFileSync(npmDataFilePath, JSON.stringify(result, null, 2) + "\n");
}

/**
 * Fetch all published versions of a package from the npm registry.
 *
 * @param {string} packageName
 * @returns {Promise<string[]>}
 */
async function fetchPublishedVersions(packageName) {
    const url = `https://registry.npmjs.org/${packageName}`;
    const response = await fetch(url, {
        headers: { Accept: "application/vnd.npm.install-v1+json" },
    });

    if (!response.ok) {
        console.warn(`[docs-data] WARNING: could not fetch versions for ${packageName} (HTTP ${response.status})`);
        return [];
    }

    const data = await response.json();
    return Object.keys(data.versions ?? {});
}

/**
 * Filter a list of semver versions to keep only the latest patch release for each major version.
 * Returns versions sorted descending (highest first).
 *
 * @param {string[]} versions
 * @returns {string[]}
 */
function filterToLatestPerMajor(versions) {
    /** @type {Map<number, string>} */
    const majors = new Map();
    for (const version of versions) {
        // Skip pre-release versions
        if (semver.prerelease(version) != null) {
            continue;
        }
        const major = semver.major(version);
        if (!majors.has(major) || semver.gt(version, majors.get(major))) {
            majors.set(major, version);
        }
    }
    // Sorted descending (highest version first)
    return Array.from(majors.values()).reverse();
}
