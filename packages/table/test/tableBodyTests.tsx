/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { TableBody } from "../src/tableBody";
import { expect } from "chai";

describe("TableBody", () => {

    it("cellClassNames", () => {
        expect(TableBody.cellClassNames(0, 0)).to.deep.equal([
          "bp-table-cell-row-0",
          "bp-table-cell-col-0",
        ]);
        expect(TableBody.cellClassNames(4096, 1024)).to.deep.equal([
          "bp-table-cell-row-4096",
          "bp-table-cell-col-1024",
        ]);
    });

});
