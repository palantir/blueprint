/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes as CoreClasses, Intent } from "@blueprintjs/core";
import { expect } from "chai";
import * as React from "react";

import { Cell } from "../src/cell/cell";
import * as Classes from "../src/common/classes";
import { CellType, expectCellLoading } from "./cellTestUtils";
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
            <Cell>
                <div className="inner">Purple</div>
            </Cell>,
        );
        expect(cell.find(".inner").text()).to.equal("Purple");
    });

    it("renders loading state", () => {
        const cellHarness = harness.mount(<Cell loading={true} />);
        expectCellLoading(cellHarness.element.children[0], CellType.BODY_CELL);
    });

    it("uses intents for styling", () => {
        const cell0 = harness.mount(<Cell intent={Intent.PRIMARY}>Dangerous</Cell>);
        expect(cell0.find(`.${Classes.TABLE_CELL}.${CoreClasses.INTENT_PRIMARY}`).element).to.exist;

        const cell1 = harness.mount(<Cell intent={Intent.SUCCESS}>Dangerous</Cell>);
        expect(cell1.find(`.${Classes.TABLE_CELL}.${CoreClasses.INTENT_SUCCESS}`).element).to.exist;

        const cell2 = harness.mount(<Cell intent={Intent.WARNING}>Dangerous</Cell>);
        expect(cell2.find(`.${Classes.TABLE_CELL}.${CoreClasses.INTENT_WARNING}`).element).to.exist;

        const cell3 = harness.mount(<Cell intent={Intent.DANGER}>Dangerous</Cell>);
        expect(cell3.find(`.${Classes.TABLE_CELL}.${CoreClasses.INTENT_DANGER}`).element).to.exist;
    });
});
