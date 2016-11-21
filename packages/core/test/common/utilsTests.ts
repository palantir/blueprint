
/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { Utils } from "../../src";

describe("Utils", () => {
    it("arrayLengthCompare", () => {
        assert.isAbove(Utils.arrayLengthCompare([1, 2], []), 0);
        assert.strictEqual(Utils.arrayLengthCompare([1, 2], [1, 2]), 0);
        assert.isBelow(Utils.arrayLengthCompare([], [1, 2]), 0);

        assert.isAbove(Utils.arrayLengthCompare([1]), 0);
        assert.strictEqual(Utils.arrayLengthCompare(), 0);
        assert.isBelow(Utils.arrayLengthCompare(undefined, [1]), 0);
    });

    it("clamp", () => {
        assert.strictEqual(Utils.clamp(10, 0, 20), 10, "value between min/max");
        assert.strictEqual(Utils.clamp(0, 10, 20), 10, "value below min");
        assert.strictEqual(Utils.clamp(40, 0, 20), 20, "value above max");
        assert.throws(() => Utils.clamp(0, 20, 10), /less than/);
    });
});
