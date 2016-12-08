/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { TableBody } from "../src/tableBody";

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
