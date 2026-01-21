/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { createBlueprintVitestConfig } from "@blueprintjs/test-commons/vitestConfig";

export default createBlueprintVitestConfig({
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    includeEnzyme: false,
});
