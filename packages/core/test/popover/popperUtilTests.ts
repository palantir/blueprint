/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";
import { Data, Placement, Position } from "popper.js";
import { arrowOffsetModifier, getAlignment, getOppositePosition } from "../../src/components/popover/popperUtils";

describe("Popper utils", () => {
    it("getOppositePosition returns opposite", () => {
        [["top", "bottom"], ["left", "right"]].map(([a, b]) => {
            expect(getOppositePosition(a as Position)).to.equal(b);
            expect(getOppositePosition(b as Position)).to.equal(a);
        });
    });

    it("getAlignment returns alignment", () => {
        expect(getAlignment("bottom-start")).to.equal("left");
        expect(getAlignment("top-end")).to.equal("right");
        expect(getAlignment("left")).to.equal("center");
    });

    describe("arrow offset modifier shifts away from popover", () => {
        it("right", () => {
            const { offsets: { popper, arrow } } = arrowOffsetModifier(getPopperData("right"), {});
            expect(popper.left).to.be.greaterThan(arrow.left);
        });

        it("left", () => {
            const { offsets: { popper, arrow } } = arrowOffsetModifier(getPopperData("left"), {});
            expect(popper.left).to.be.lessThan(arrow.left);
        });

        function getPopperData(placement: Placement) {
            // minimal data fields necessary for modifier implementation
            // tslint:disable-next-line:no-object-literal-type-assertion
            return {
                arrowElement: { clientWidth: 20 },
                offsets: {
                    arrow: { top: 0, left: 0 },
                    popper: { top: 0, left: 0, width: 20, height: 20 },
                },
                placement,
            } as Data;
        }
    });
});
