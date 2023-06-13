/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { Icons } from "../src/iconLoader";
import { getIconPaths } from "../src/iconPaths";

describe("IconLoader", () => {
    it("is compatible with getIconPaths", () => {
        Icons.loadAll({
            loader: async (name, size) => getIconPaths(name, size),
        });
    });
});
