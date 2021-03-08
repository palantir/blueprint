/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { expect } from "chai";
import * as React from "react";

import { Classes } from "@blueprintjs/core";

import { LoadableContent } from "../src/common/loadableContent";
import { ReactHarness } from "./harness";

describe("LoadableContent", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("can render single child", () => {
        const someText = "some text";
        const loadableContentHarness = harness.mount(
            <LoadableContent loading={false}>
                <span>{someText}</span>
            </LoadableContent>,
        );

        expect(loadableContentHarness.element.textContent).to.equal(someText);
    });

    it("renders skeleton instead of child when loading", () => {
        const loadableContentHarness = harness.mount(
            <LoadableContent loading={true}>
                <span>some text</span>
            </LoadableContent>,
        );
        const skeletonElement = loadableContentHarness.element.children[0];

        expect(loadableContentHarness.element.textContent).to.be.string("");
        expect(skeletonElement.children.length).to.equal(0);
        expect(skeletonElement.classList.contains(Classes.SKELETON));
    });
});
