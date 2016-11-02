/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Utils } from "../src";
import { Grid } from "../src/common/grid";
import { Locator } from "../src/locator";
import { ElementHarness, ReactHarness } from "./harness";
import { expect } from "chai";

describe("Locator", () => {
    const harness = new ReactHarness();
    const test10s = Utils.times(10, () => 10);
    const test20s = Utils.times(10, () => 20);
    const grid = new Grid(test10s, test20s);
    let locator: Locator;
    let divs: ElementHarness;
    beforeEach(() => {
        divs = harness.mount(
            <div className="table-wrapper">
                <div className="body">
                    <div className="body-client">B</div>
                </div>
            </div>
        );
        locator = new Locator(
            divs.find(".table-wrapper").element as HTMLElement,
            divs.find(".body").element as HTMLElement,
            grid
        );
    });

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("constructs", () => {
        // noop
    });

    it("locates a column", () => {
        const left = divs.find(".body").bounds().left;
        expect(locator.convertPointToColumn(left + 10)).to.equal(0);
        expect(locator.convertPointToColumn(left + 30)).to.equal(1);
        expect(locator.convertPointToColumn(-1000)).to.equal(-1);
    });

    it("locates a row", () => {
        const top = divs.find(".body").bounds().top;
        expect(locator.convertPointToRow(top + 5)).to.equal(0);
        expect(locator.convertPointToRow(top + 15)).to.equal(1);
        expect(locator.convertPointToRow(-1000)).to.equal(-1);
    });
});
