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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "chai";
import sinon from "sinon";

import { Menu } from "@blueprintjs/core";

import { Clipboard } from "../src/common/clipboard";
import { CopyCellsMenuItem, MenuContextImpl } from "../src/interactions/menus";
import { Regions } from "../src/regions";

describe("Menus", () => {
    describe("MenuContextImpl", () => {
        it("uses selected regions if clicked inside selection", () => {
            const context = new MenuContextImpl(Regions.cell(1, 1), [Regions.column(1)], 3, 3);
            expect(context.getRegions()).to.deep.equal([Regions.column(1)]);
            expect(context.getUniqueCells()).to.deep.equal([
                [0, 1],
                [1, 1],
                [2, 1],
            ]);
        });

        it("uses target cell if clicked outside selection", () => {
            const context = new MenuContextImpl(Regions.cell(1, 2), [Regions.column(1)], 3, 3);
            expect(context.getTarget()).to.deep.equal(Regions.cell(1, 2));
            expect(context.getSelectedRegions()).to.deep.equal([Regions.column(1)]);
            expect(context.getRegions()).to.deep.equal([Regions.cell(1, 2)]);
            expect(context.getUniqueCells()).to.deep.equal([[1, 2]]);
        });
    });

    describe("CopyCellsMenuItem", () => {
        const clipboardSpy = sinon.spy(Clipboard, "copyCells");

        after(() => {
            (Clipboard.copyCells as any).restore(); // a little sinon hackery
        });

        it("copies cells", async () => {
            const context = new MenuContextImpl(Regions.cell(1, 1), [Regions.column(1)], 3, 3);
            const getCellData = () => "X";
            render(
                <Menu>
                    <CopyCellsMenuItem context={context} getCellData={getCellData} text="Copy" />
                </Menu>,
            );
            const menuItem = screen.getByText("Copy");

            await userEvent.click(menuItem);

            expect(clipboardSpy.called).to.be.true;
            expect(clipboardSpy.lastCall.args).to.deep.equal([[["X"], ["X"], ["X"]]]);
        });
    });
});
