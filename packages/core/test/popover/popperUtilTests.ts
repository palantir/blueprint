/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

/* Copyright 2020 Palantir Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

import { BasePlacement } from "@popperjs/core";
import { expect } from "chai";

import { getAlignment, getOppositePlacement } from "../../src/components/popover/popperUtils";

describe("Popper utils", () => {
    it("getOppositePlacement returns opposite", () => {
        [
            ["top", "bottom"],
            ["left", "right"],
        ].map(([a, b]) => {
            expect(getOppositePlacement(a as BasePlacement)).to.equal(b);
            expect(getOppositePlacement(b as BasePlacement)).to.equal(a);
        });
    });

    it("getAlignment returns alignment", () => {
        expect(getAlignment("bottom-start")).to.equal("left");
        expect(getAlignment("top-end")).to.equal("right");
        expect(getAlignment("left")).to.equal("center");
    });
});
