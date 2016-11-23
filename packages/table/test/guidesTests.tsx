/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";
import * as React from "react";
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
        expect(guides.find(".bp-table-vertical-guide").element).to.not.exist;
        expect(guides.find(".bp-table-horizontal-guide").element).to.not.exist;
    });

    it("displays vertical guides", () => {
        const guides = harness.mount(
            <GuideLayer verticalGuides={[0, 10, 100]} />,
        );
        expect(guides.find(".bp-table-vertical-guide", 0).style().left).to.equal("0px");
        expect(guides.find(".bp-table-vertical-guide", 1).style().left).to.equal("10px");
        expect(guides.find(".bp-table-vertical-guide", 2).style().left).to.equal("100px");
        expect(guides.find(".bp-table-vertical-guide", 3).element).to.not.exist;
    });

    it("displays horizontal guides", () => {
        const guides = harness.mount(
            <GuideLayer horizontalGuides={[22, 33, 11]} />,
        );
        expect(guides.find(".bp-table-horizontal-guide", 0).style().top).to.equal("22px");
        expect(guides.find(".bp-table-horizontal-guide", 1).style().top).to.equal("33px");
        expect(guides.find(".bp-table-horizontal-guide", 2).style().top).to.equal("11px");
        expect(guides.find(".bp-table-horizontal-guide", 3).element).to.not.exist;
    });
});
