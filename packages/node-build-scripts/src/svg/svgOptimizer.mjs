/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { optimize } from "svgo";

/**
 * Keep the legacy `svgOptimizer.optimize()` surface used by callsites.
 */
export const svgOptimizer = {
    async optimize(svg, config = {}) {
        return optimize(svg, config);
    },
};
