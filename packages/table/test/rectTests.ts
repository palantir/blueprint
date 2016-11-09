/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Rect } from "../src/common/rect";
import { expect } from "chai";

describe("Rect", () => {
    it("wraps AnyRects", () => {
        const anyRect = {
            height: 40,
            left: 20,
            top: 10,
            width: 30,
        } as ClientRect;

        const rect = Rect.union(anyRect, anyRect);
        expect(rect).to.be.instanceof(Rect);
        expect(rect.top).to.equal(10);
    });

    it("produces styles", () => {
        const rect = new Rect(20, 10, 30, 40);
        expect(rect.style().position).to.equal("absolute");
        expect(rect.sizeStyle().width).to.equal("30px");
    });

    it("unions", () => {
        const rect = Rect.union(new Rect(0, 0, 10, 10), new Rect(5, 5, 30, 1));
        expect(rect.top).to.equal(0);
        expect(rect.left).to.equal(0);
        expect(rect.width).to.equal(35);
        expect(rect.height).to.equal(10);
    });

    it("checks containment", () => {
        const rect = new Rect(20, 10, 30, 40);
        expect(rect.containsX(19)).to.be.false;
        expect(rect.containsX(20)).to.be.true;
        expect(rect.containsX(30)).to.be.true;
        expect(rect.containsX(50)).to.be.true;
        expect(rect.containsX(51)).to.be.false;

        expect(rect.containsY(9)).to.be.false;
        expect(rect.containsY(10)).to.be.true;
        expect(rect.containsY(30)).to.be.true;
        expect(rect.containsY(50)).to.be.true;
        expect(rect.containsY(51)).to.be.false;
    });
});
