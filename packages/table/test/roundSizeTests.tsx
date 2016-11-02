/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { RoundSize } from "../src/common/roundSize";
import { ReactHarness } from "./harness";
import { expect } from "chai";

describe("RoundSize", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("displays regular content", () => {
        const rounded = harness.mount((
            <RoundSize>
                <div className="inner" style={{height: "20px", width: "30px"}}>...</div>
            </RoundSize>
        ));
        const inner = rounded.find(".inner").bounds();
        expect(inner.width).to.equal(30);

        const outer = rounded.find(".bp-table-rounded-layout").bounds();
        expect(outer.width).to.equal(30);
    });

    it("rounds irregular content", () => {
        const rounded = harness.mount((
            <RoundSize>
                <div className="inner" style={{height: "20px", width: "30.5px"}}>...</div>
            </RoundSize>
        ));
        const inner = rounded.find(".inner").bounds();
        expect(inner.width).to.equal(30.5);

        const outer = rounded.find(".bp-table-rounded-layout").bounds();
        expect(outer.width).to.equal(31);
    });
});
