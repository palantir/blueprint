/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
