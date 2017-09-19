/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { Clipboard } from "../src/common/clipboard";

describe("Clipboard", () => {
    it("copies cells (disabled on phantom)", () => {
        const success = Clipboard.copyCells([["A", "B", "C"], ["D", "E", "F"]]);
        expect(success).to.be.false;
    });

    it("copies strings (disabled on phantom)", () => {
        const success = Clipboard.copyString(`
            Hello,
            World!
        `);
        expect(success).to.be.false;
    });
});
