/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as Classes from "../src/common/classes";
import { TableBody } from "../src/tableBody";

describe("TableBody", () => {

    it("cellClassNames", () => {
        expect(TableBody.cellClassNames(0, 0)).to.deep.equal([
          Classes.rowCellIndexClass(0),
          Classes.columnCellIndexClass(0),
        ]);
        expect(TableBody.cellClassNames(4096, 1024)).to.deep.equal([
          Classes.rowCellIndexClass(4096),
          Classes.columnCellIndexClass(1024),
        ]);
    });

});
