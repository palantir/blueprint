/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, it } from "vitest";

import { getIconPaths } from "./allPaths";
import { Icons } from "./iconLoader";

describe("IconLoader", () => {
    it("is compatible with getIconPaths", () => {
        Icons.loadAll({
            loader: async (name, size) => getIconPaths(name, size),
        });
    });
});
