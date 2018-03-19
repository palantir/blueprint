/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
