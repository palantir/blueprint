/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { getIconPaths } from "../src/allPaths";
import { Icons } from "../src/iconLoader";

describe("IconLoader", () => {
    it("is compatible with getIconPaths", () => {
        Icons.loadAll({
            loader: async (name, size) => getIconPaths(name, size),
        });
    });
});
