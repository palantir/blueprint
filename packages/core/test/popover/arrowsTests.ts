/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { CSSProperties } from "react";

import { Position } from "../../src/common/position";
import * as Arrows from "../../src/components/popover/arrows";

describe("Arrows", () => {
    const arrowSize = 14;
    const dimensions = { height: 24, width: 100 };
    const offsetX = (dimensions.width - arrowSize) / 2;
    // offsetY is not necessary because dimensions.height is too small for arrow + spacing so it
    // will always come out to Arrows.MIN_ARROW_SPACING. instead we compute shift in top margin.
    const marginTop = Arrows.MIN_ARROW_SPACING - (dimensions.height - arrowSize) / 2;

    describe("getPopoverTransformOrigin", () => {
        const origins: { [pos: number]: string } = {
            [Position.TOP]: undefined,
            [Position.TOP_LEFT]: `${offsetX}px bottom`,
            [Position.TOP_RIGHT]: `calc(100% - ${offsetX}px) bottom`,
            [Position.BOTTOM_RIGHT]: `calc(100% - ${offsetX}px) top`,
            [Position.RIGHT_TOP]: `left ${Arrows.MIN_ARROW_SPACING}px`,
            [Position.RIGHT_BOTTOM]: `left calc(100% - ${Arrows.MIN_ARROW_SPACING}px)`,
        };

        for (let key of Object.keys(origins)) {
            const position: Position = +key;
            const value: string = origins[position];
            it(`Position.${Position[position]} => ${value}`, () => {
                assert.deepEqual(Arrows.getPopoverTransformOrigin(position, arrowSize, dimensions), value);
            });
        }
    });

    describe("getArrowPositionStyles", () => {
        const styles: { [pos: number]: CSSProperties[] } = {
            [Position.TOP_LEFT]: [{ left: offsetX }, { marginLeft: -0 }],
            [Position.TOP_RIGHT]: [{ right: offsetX }, { marginLeft: 0 }],
            [Position.BOTTOM_RIGHT]: [{ right: offsetX }, { marginLeft: 0 }],
            [Position.RIGHT_TOP]: [{ top: Arrows.MIN_ARROW_SPACING }, { marginTop: -marginTop }],
            [Position.RIGHT_BOTTOM]: [{ bottom: Arrows.MIN_ARROW_SPACING }, { marginTop: marginTop }],
        };

        for (let key of Object.keys(styles)) {
            const position: Position = +key;
            it(`Position.${Position[position]}`, () => {
                const [expectedArrow, expectedContainer] = styles[position];
                const {arrow, container} =
                    Arrows.getArrowPositionStyles(position, arrowSize, false, dimensions, false);
                assert.deepEqual(arrow, expectedArrow, "incorrect arrow styles");
                assert.deepEqual(container, expectedContainer, "incorrect container styles");
            });
        }

        it("returns empty object for Position.TOP", () => {
            assert.deepEqual(Arrows.getArrowPositionStyles(Position.TOP, arrowSize, false, dimensions, false), {});
        });
    });
});
