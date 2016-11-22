/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Intent } from "@blueprintjs/core";
import { expect } from "chai";
import * as React from "react";

import { Cell } from "../src/cell/cell";
import { ReactHarness } from "./harness";

describe("Cell", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("displays regular content", () => {
        const cell = harness.mount(
            <Cell><div className="inner">Purple</div></Cell>,
        );
        expect(cell.find(".inner").text()).to.equal("Purple");
    });

    it("uses intents for styling", () => {
        const cell0 = harness.mount(<Cell intent={Intent.PRIMARY}>Dangerous</Cell>);
        expect(cell0.find(".bp-table-cell.pt-intent-primary").element).to.exist;

        const cell1 = harness.mount(<Cell intent={Intent.SUCCESS}>Dangerous</Cell>);
        expect(cell1.find(".bp-table-cell.pt-intent-success").element).to.exist;

        const cell2 = harness.mount(<Cell intent={Intent.WARNING}>Dangerous</Cell>);
        expect(cell2.find(".bp-table-cell.pt-intent-warning").element).to.exist;

        const cell3 = harness.mount(<Cell intent={Intent.DANGER}>Dangerous</Cell>);
        expect(cell3.find(".bp-table-cell.pt-intent-danger").element).to.exist;
    });
});
