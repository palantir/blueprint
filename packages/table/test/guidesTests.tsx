/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
import * as Classes from "../src/common/classes";
import { GuideLayer } from "../src/layers/guides";
import { ReactHarness } from "./harness";

describe("Guides", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("defaults to no guides", () => {
        const guides = harness.mount(
            <GuideLayer/>,
        );
        expect(guides.find(`.${Classes.TABLE_VERTICAL_GUIDE}`).element).to.not.exist;
        expect(guides.find(`.${Classes.TABLE_HORIZONTAL_GUIDE}`).element).to.not.exist;
    });

    it("displays vertical guides", () => {
        const guides = harness.mount(
            <GuideLayer verticalGuides={[0, 10, 100]} />,
        );
        // TODO: Fix guide positioning logic now that reordering guides are in the picture
        // expect(guides.find(`.${Classes.TABLE_VERTICAL_GUIDE}`, 0).style().left).to.equal("0px");
        // expect(guides.find(`.${Classes.TABLE_VERTICAL_GUIDE}`, 1).style().left).to.equal("10px");
        // expect(guides.find(`.${Classes.TABLE_VERTICAL_GUIDE}`, 2).style().left).to.equal("100px");
        expect(guides.find(`.${Classes.TABLE_VERTICAL_GUIDE}`, 3).element).to.not.exist;
    });

    it("displays horizontal guides", () => {
        const guides = harness.mount(
            <GuideLayer horizontalGuides={[22, 33, 11]} />,
        );
        expect(guides.find(`.${Classes.TABLE_HORIZONTAL_GUIDE}`, 0).style().top).to.equal("22px");
        expect(guides.find(`.${Classes.TABLE_HORIZONTAL_GUIDE}`, 1).style().top).to.equal("33px");
        expect(guides.find(`.${Classes.TABLE_HORIZONTAL_GUIDE}`, 2).style().top).to.equal("11px");
        expect(guides.find(`.${Classes.TABLE_HORIZONTAL_GUIDE}`, 3).element).to.not.exist;
    });
});
