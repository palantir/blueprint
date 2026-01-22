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

import { render } from "@testing-library/react";
import { expect } from "chai";

import { Classes as CoreClasses, Intent } from "@blueprintjs/core";

import { Cell } from "../src/cell/cell";
import * as Classes from "../src/common/classes";

import { CellType, expectCellLoading } from "./cellTestUtils";
import { ElementHarness } from "./harness";

describe("Cell", () => {
    it("displays regular content", () => {
        const { container } = render(
            <Cell>
                <div className="inner">Purple</div>
            </Cell>,
        );
        const cell = new ElementHarness(container);
        expect(cell.find(".inner").text()).to.equal("Purple");
    });

    it("renders loading state", () => {
        const { container } = render(<Cell loading={true} />);
        const cellHarness = new ElementHarness(container);
        expectCellLoading(cellHarness.element!.children[0], CellType.BODY_CELL);
    });

    describe("uses intents for styling", () => {
        it("primary", () => {
            const { container } = render(<Cell intent={Intent.PRIMARY}>Primary</Cell>);
            const cell = new ElementHarness(container);
            expect(cell.find(`.${Classes.TABLE_CELL}.${CoreClasses.INTENT_PRIMARY}`).element).to.exist;
        });

        it("success", () => {
            const { container } = render(<Cell intent={Intent.SUCCESS}>Success</Cell>);
            const cell = new ElementHarness(container);
            expect(cell.find(`.${Classes.TABLE_CELL}.${CoreClasses.INTENT_SUCCESS}`).element).to.exist;
        });

        it("warning", () => {
            const { container } = render(<Cell intent={Intent.WARNING}>Warning</Cell>);
            const cell = new ElementHarness(container);
            expect(cell.find(`.${Classes.TABLE_CELL}.${CoreClasses.INTENT_WARNING}`).element).to.exist;
        });

        it("danger", () => {
            const { container } = render(<Cell intent={Intent.DANGER}>Dangerous</Cell>);
            const cell = new ElementHarness(container);
            expect(cell.find(`.${Classes.TABLE_CELL}.${CoreClasses.INTENT_DANGER}`).element).to.exist;
        });
    });
});
