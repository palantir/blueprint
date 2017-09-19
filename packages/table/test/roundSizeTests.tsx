/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import * as Classes from "../src/common/classes";
import { RoundSize } from "../src/common/roundSize";
import { ReactHarness } from "./harness";

describe("RoundSize", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("displays regular content", () => {
        const rounded = harness.mount(
            <RoundSize>
                <div className="inner" style={{ height: "20px", width: "30px" }}>
                    ...
                </div>
            </RoundSize>,
        );
        const inner = rounded.find(".inner").bounds();
        expect(inner.width).to.equal(30);

        const outer = rounded.find(`.${Classes.TABLE_ROUNDED_LAYOUT}`).bounds();
        expect(outer.width).to.equal(30);
    });

    it("rounds irregular content", () => {
        const rounded = harness.mount(
            <RoundSize>
                <div className="inner" style={{ height: "20px", width: "30.5px" }}>
                    ...
                </div>
            </RoundSize>,
        );
        const inner = rounded.find(".inner").bounds();
        expect(inner.width).to.equal(30.5);

        const outer = rounded.find(`.${Classes.TABLE_ROUNDED_LAYOUT}`).bounds();
        expect(outer.width).to.equal(31);
    });
});
