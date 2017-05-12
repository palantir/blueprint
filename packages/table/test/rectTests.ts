/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import { Rect } from "../src/common/rect";

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

    it("union", () => {
        const rect = Rect.union(new Rect(0, 0, 10, 10), new Rect(5, 5, 30, 1));
        expect(rect.top).to.equal(0);
        expect(rect.left).to.equal(0);
        expect(rect.width).to.equal(35);
        expect(rect.height).to.equal(10);
    });

    it("containsX", () => {
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

    it("equals", () => {
        const rect = new Rect(20, 10, 30, 40);

        const equalRect = new Rect(20, 10, 30, 40);
        const diffLeftRect = new Rect(19, 10, 30, 40);
        const diffRightRect = new Rect(20, 9, 30, 40);
        const diffWidthRect = new Rect(20, 10, 29, 40);
        const diffHeightRect = new Rect(20, 10, 30, 39);

        expect(rect.equals(equalRect)).to.be.true;
        expect(rect.equals(diffLeftRect)).to.be.false;
        expect(rect.equals(diffRightRect)).to.be.false;
        expect(rect.equals(diffWidthRect)).to.be.false;
        expect(rect.equals(diffHeightRect)).to.be.false;
    });
});
