/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import deasync from "deasync";
// Note: we had issues with this approach using svgo v2.x, so for now we stick with v1.x
// With v2.x, some shapes within the icon SVGs would not get converted to paths correctly,
// resulting in invalid d="..." attributes rendered by the <Icon> component.
import SVGO from "svgo";

export const svgOptimizer = new SVGO({ plugins: [{ convertShapeToPath: { convertArcs: true } }] });

export const optimizeSync = deasync(optimizeAsync);

/**
 * @typedef {Object} OptimizedSvg
 * @property {string} data
 * @property {{ width: string, height: string }} info
 * @property {string | undefined} path
 */

/**
 * @param {string} src
 * @param {(error: any, optimizedSvg: OptimizedSvg) => void} cb
 */
function optimizeAsync(src, cb) {
    svgOptimizer
        .optimize(src)
        .then(function (result) {
            return cb(null, result);
        })
        .catch(cb);
}
