/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

import { createKarmaConfig } from "@blueprintjs/karma-build-scripts";

export default function (config) {
    const baseConfig = createKarmaConfig({
        coverage: false,
        dirname: __dirname,
    });
    config.set(baseConfig);
};
