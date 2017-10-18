/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import { Direction } from "../../../src/common/direction";
import * as DirectionUtils from "../../../src/common/internal/directionUtils";

describe("DirectionUtils", () => {
    describe("directionToDelta", () => {
        it("returns correct delta for Direction.UP", () => {
            const delta = DirectionUtils.directionToDelta(Direction.UP);
            expect(delta).to.deep.equal({ rows: -1, cols: 0 });
        });

        it("returns correct delta for Direction.DOWN", () => {
            const delta = DirectionUtils.directionToDelta(Direction.DOWN);
            expect(delta).to.deep.equal({ rows: 1, cols: 0 });
        });

        it("returns correct delta for Direction.LEFT", () => {
            const delta = DirectionUtils.directionToDelta(Direction.LEFT);
            expect(delta).to.deep.equal({ rows: 0, cols: -1 });
        });

        it("returns correct delta for Direction.RIGHT", () => {
            const delta = DirectionUtils.directionToDelta(Direction.RIGHT);
            expect(delta).to.deep.equal({ rows: 0, cols: +1 });
        });
    });
});
