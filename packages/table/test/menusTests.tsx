/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Menu } from "@blueprintjs/core";
import { expect } from "chai";
import * as React from "react";
import * as sinon from "sinon";

import { Clipboard } from "../src/common/clipboard";
import { CopyCellsMenuItem, MenuContext } from "../src/interactions/menus";
import { Regions } from "../src/regions";
import { ReactHarness } from "./harness";

describe("Menus", () => {
    describe("MenuContext", () => {
        it("uses selected regions if clicked inside selection", () => {
            const context = new MenuContext(Regions.cell(1, 1), [Regions.column(1)], 3, 3);
            expect(context.getRegions()).to.deep.equal([Regions.column(1)]);
            expect(context.getUniqueCells()).to.deep.equal([[0, 1], [1, 1], [2, 1]]);
        });

        it("uses target cell if clicked outside selection", () => {
            const context = new MenuContext(Regions.cell(1, 2), [Regions.column(1)], 3, 3);
            expect(context.getTarget()).to.deep.equal(Regions.cell(1, 2));
            expect(context.getSelectedRegions()).to.deep.equal([Regions.column(1)]);
            expect(context.getRegions()).to.deep.equal([Regions.cell(1, 2)]);
            expect(context.getUniqueCells()).to.deep.equal([[1, 2]]);
        });
    });

    describe("CopyCellsMenuItem", () => {
        const harness = new ReactHarness();
        const clipboardSpy = sinon.spy(Clipboard, "copyCells");

        afterEach(() => {
            harness.unmount();
        });

        after(() => {
            harness.destroy();
            (Clipboard.copyCells as any).restore(); // a little sinon hackery
        });

        it("copies cells", () => {
            const context = new MenuContext(Regions.cell(1, 1), [Regions.column(1)], 3, 3);
            const getCellData = () => "X";
            const onCopySpy = sinon.spy();
            const menu = harness.mount(
                <Menu>
                    <CopyCellsMenuItem context={context} getCellData={getCellData} onCopy={onCopySpy} text="Copy" />
                </Menu>,
            );

            menu.find("a.pt-menu-item").mouse("click");
            expect(clipboardSpy.called).to.be.true;
            expect(clipboardSpy.lastCall.args).to.deep.equal([[["X"], ["X"], ["X"]]]);
            expect(onCopySpy.called).to.be.true;
            expect(onCopySpy.lastCall.args[0]).to.be.false;
        });
    });
});
