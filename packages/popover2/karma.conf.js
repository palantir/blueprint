/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 */

import { createKarmaConfig } from "@blueprintjs/karma-build-scripts";

export default function (config) {
    const baseConfig = createKarmaConfig({
        dirname: __dirname,
        coverageExcludes: ["src/popover2Arrow.tsx"],
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
