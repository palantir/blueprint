/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import { Regions } from "../src/";
import { DragReorderable } from "../src/interactions/reorderable";
import { ReactHarness } from "./harness";

describe("DragReorderable", () => {
    const harness = new ReactHarness();
    const children = (
        <div className="single-child">
            <div className="reorderable">Zero</div>
            <div className="reorderable">One</div>
            <div className="reorderable">Two</div>
            <div className="reorderable">Three</div>
            <div className="reorderable">Four</div>
        </div>
    );

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("[placeholder test to pass coverage threshold]", () => {
        const onSelection = sinon.spy();
        const locateClick = sinon.stub().returns(Regions.column(0));
        const locateDrag = sinon.stub();
        const onReorder = sinon.stub();
        const onReorderPreview = sinon.stub();

        const reorderable = harness.mount(
            <DragReorderable
                locateClick={locateClick}
                locateDrag={locateDrag}
                onReorder={onReorder}
                onReorderPreview={onReorderPreview}
                onSelection={onSelection}
                selectedRegions={[Regions.column(0)]}
                toRegion={toFullColumnRegion}
            >
                {children}
            </DragReorderable>,
        );

        reorderable.find(".reorderable", 0).mouse("mousedown").mouse("mousemove").mouse("mouseup");
        expect(onReorderPreview.called).to.be.true;
        expect(onReorder.called).to.be.true;
        expect(onSelection.called).to.be.true;
    });

    function toFullColumnRegion(index1: number, index2?: number) {
        return Regions.column(index1, index2);
    }
});
