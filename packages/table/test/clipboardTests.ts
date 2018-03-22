/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";
import { Clipboard } from "../src/common/clipboard";

describe("Clipboard", () => {
    it("copies cells", () => {
        const success = Clipboard.copyCells([["A", "B", "C"], ["D", "E", "F"]]);
        expect(success).to.be.false;
    });

    it("copies strings", () => {
        const success = Clipboard.copyString(`
            Hello,
            World!
        `);
        expect(success).to.be.false;
    });
});
