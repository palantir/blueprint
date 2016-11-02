/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Clipboard } from "../src/common/clipboard";
import { expect } from "chai";

describe("Clipboard", () => {
    it("copies cells (disabled on phantom)", () => {
        const success = Clipboard.copyCells([
            ["A", "B", "C"],
            ["D", "E", "F"],
        ]);
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
