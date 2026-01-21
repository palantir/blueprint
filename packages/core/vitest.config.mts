/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { createBlueprintVitestConfig } from "@blueprintjs/test-commons/vitestConfig";

export default createBlueprintVitestConfig({
    include: ["test/**/*Tests.{ts,tsx}"],
});
