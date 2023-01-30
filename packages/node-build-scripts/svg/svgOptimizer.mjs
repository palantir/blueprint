/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import deasync from "deasync";
// Note: we had issues with this approach using svgo v2.x, so for now we stick with v1.x
// With v2.x, some shapes within the icon SVGs would not get converted to paths correctly,
// resulting in invalid d="..." attributes rendered by the <Icon> component.
import SVGO from "svgo";

export const svgOptimizer = new SVGO({ plugins: [{ convertShapeToPath: { convertArcs: true } }] });

/**
 * @typedef {Object} OptimizedSvg
 * @property {string} data
 * @property {{ width: string, height: string }} info
 * @property {string | undefined} path
 */

/**
 * @param {string} src
 * @param {string} path
 * @returns {OptimizedSvg}
 */
export function optimizeSync(src, path) {
    let result;
    let done = false;

    svgOptimizer
        .optimize(src, { path })
        .then(optimizedSvg => {
            console.log("Got optimized SVG!", optimizedSvg);
            result = optimizedSvg;
            done = true;
        })
        .catch(err => {
            throw new Error(err);
        });

    deasync.loopWhile(() => !done);
    return result;
}
