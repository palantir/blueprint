/*
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

// @ts-check

/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require("@yarnpkg/types");

/**
 * @typedef {import("@yarnpkg/types").Yarn.Constraints.Context} Context
 */

/**
 * Packages which we need to ensure the declared version range is fixed for backwards-compatibility.
 */
const FIXED_DEPENDENCY_RANGES = {
    // newer versions of classnames require esModuleInterop, see https://github.com/palantir/blueprint/pull/5687
    classnames: "^2.3.1",
    // 2.29.0+ has some potential bundle size regressions, and we are due to upgrade to 3.0 soon anyway
    "date-fns": "^2.28.0",
};

/**
 * Packages which are allowed to exist as dependencies of various packages with different version ranges.
 */
const EXCLUDED_FROM_CONSISTENCY_CHECK = new Set([
    // we support multiple versions of react-day-picker: v7 in datetime and v8 in datetime2
    "react-day-picker",
    // tooling packages declare a wider dependency range in 'dependencies' & 'peerDependencies' than our local 'devDependencies'
    "typescript",
    ...Object.keys(FIXED_DEPENDENCY_RANGES),
]);

function enforceSpecificDependencyRanges({ Yarn }) {
    for (const [ident, range] of Object.entries(FIXED_DEPENDENCY_RANGES)) {
        for (const dependency of Yarn.dependencies({ ident })) {
            dependency.update(range);
        }
    }
}

/**
 * This rule will enforce that a workspace MUST depend on the same version of
 * a dependency as the one used by the other workspaces.
 *
 * @see https://yarnpkg.com/features/constraints#restrict-dependencies-between-workspaces
 * @param {Context} context
 */
function enforceConsistentDependenciesAcrossTheProject({ Yarn }) {
    for (const dependency of Yarn.dependencies()) {
        if (EXCLUDED_FROM_CONSISTENCY_CHECK.has(dependency.ident)) {
            continue;
        }

        if (dependency.type === `peerDependencies`) {
            continue;
        }

        for (const otherDependency of Yarn.dependencies({ ident: dependency.ident })) {
            if (otherDependency.type === `peerDependencies`) {
                continue;
            }

            dependency.update(otherDependency.range);
        }
    }
}

module.exports = defineConfig({
    async constraints(ctx) {
        enforceSpecificDependencyRanges(ctx);
        enforceConsistentDependenciesAcrossTheProject(ctx);
    },
});
