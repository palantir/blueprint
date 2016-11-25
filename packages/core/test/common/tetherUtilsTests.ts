/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";

import { Position } from "../../src/common/position";
import * as TetherUtils from "../../src/common/tetherUtils";

describe("TetherUtils", () => {
    describe("getAttachmentClasses", () => {
        it("generates expected classes for Position.TOP", () => {
            assert.deepEqual(TetherUtils.getAttachmentClasses(Position.TOP), [
                "pt-tether-element-attached-bottom",
                "pt-tether-element-attached-center",
                "pt-tether-target-attached-top",
                "pt-tether-target-attached-center",
            ]);
        });

        it("generates expected classes for Position.RIGHT_BOTTOM", () => {
            assert.deepEqual(TetherUtils.getAttachmentClasses(Position.RIGHT_BOTTOM), [
                "pt-tether-element-attached-bottom",
                "pt-tether-element-attached-left",
                "pt-tether-target-attached-bottom",
                "pt-tether-target-attached-right",
            ]);
        });
    });
});
