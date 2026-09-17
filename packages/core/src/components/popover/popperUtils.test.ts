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

import type { BasePlacement } from "@popperjs/core";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { getAlignment, getOppositePlacement, getTransformOrigin } from "./popperUtils";

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

    it("getAlignment returns vertical keywords on the y axis", () => {
        expect(getAlignment("left-start", "y")).to.equal("top");
        expect(getAlignment("right-end", "y")).to.equal("bottom");
        expect(getAlignment("right", "y")).to.equal("center");
    });

    describe("getTransformOrigin", () => {
        it("points at the target's edge for unaligned placements", () => {
            expect(getTransformOrigin("top", undefined)).to.equal("center bottom");
            expect(getTransformOrigin("bottom", undefined)).to.equal("center top");
            expect(getTransformOrigin("left", undefined)).to.equal("right center");
            expect(getTransformOrigin("right", undefined)).to.equal("left center");
        });

        it("points at the target's corner for aligned top/bottom placements", () => {
            expect(getTransformOrigin("bottom-start", undefined)).to.equal("left top");
            expect(getTransformOrigin("bottom-end", undefined)).to.equal("right top");
            expect(getTransformOrigin("top-start", undefined)).to.equal("left bottom");
            expect(getTransformOrigin("top-end", undefined)).to.equal("right bottom");
        });

        // regression test: these used to produce invalid CSS like "right left", which browsers
        // drop entirely, causing the popover to scale out of its own center
        it("uses vertical keywords for aligned left/right placements", () => {
            expect(getTransformOrigin("left-start", undefined)).to.equal("right top");
            expect(getTransformOrigin("left-end", undefined)).to.equal("right bottom");
            expect(getTransformOrigin("right-start", undefined)).to.equal("left top");
            expect(getTransformOrigin("right-end", undefined)).to.equal("left bottom");
        });

        it("offsets by half the arrow size when an arrow is present", () => {
            expect(getTransformOrigin("bottom-start", { left: "20px", top: "0px" })).to.equal("35px top");
            expect(getTransformOrigin("left-start", { left: "0px", top: "12px" })).to.equal("right 27px");
        });
    });
});
