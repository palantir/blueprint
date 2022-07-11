/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";
import * as sinon from "sinon";

import { Classes as CoreClasses, Intent, Keys } from "@blueprintjs/core";
import { Classes, VirtualizedTable, VirtualizedTableProps } from "../src";

describe("<VirtualizedTable>", () => {
    let testsContainerElement: Element;
    let virtualizedTable: VirtualizedTable;

    before(() => {
        // this is essentially what TestUtils.renderIntoDocument does
        testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
    });

    beforeEach(() => {});

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(testsContainerElement);
    });

    function renderVirtualizedTable(props?: Partial<VirtualizedTableProps>) {
        virtualizedTable = ReactDOM.render<VirtualizedTableProps>(
            <VirtualizedTable {...props} />, // onChange={onVirtualizedTableChange}
            testsContainerElement,
        ) as VirtualizedTable;
    }

    it("renders its contents", () => {
        assert.lengthOf(document.getElementsByClassName(Classes.VIRTUALIZED_TABLE), 0);

        renderVirtualizedTable();
        assert.lengthOf(document.getElementsByClassName(Classes.VIRTUALIZED_TABLE), 1);
    });
});
