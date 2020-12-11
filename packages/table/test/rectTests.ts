/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Rect } from "../src/common/rect";

describe("Rect", () => {
    it("wraps AnyRects", () => {
        const anyRect: ClientRect = {
            height: 40,
            left: 20,
            top: 10,
            width: 30,
        } as any;

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

    it("equals", () => {
        const rect1 = new Rect(10, 20, 30, 40);
        const rect2 = new Rect(10, 20, 30, 40);
        const rect3 = new Rect(40, 30, 20, 10);

        expect(rect1.equals(rect2)).to.be.true;
        expect(rect2.equals(rect1)).to.be.true;
        expect(rect1.equals(rect3)).to.be.false;
        expect(rect3.equals(rect1)).to.be.false;
    });
});
