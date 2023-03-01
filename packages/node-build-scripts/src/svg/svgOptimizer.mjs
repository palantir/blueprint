/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// Note: we had issues with this approach using svgo v2.x, so for now we stick with v1.x
// With v2.x, some shapes within the icon SVGs would not get converted to paths correctly,
// resulting in invalid d="..." attributes rendered by the <Icon> component.
import SVGO from "svgo";

export const svgOptimizer = new SVGO({ plugins: [{ convertShapeToPath: { convertArcs: true } }] });
