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

import { render } from "@testing-library/react";
import { expect } from "chai";

import { Classes } from "@blueprintjs/core";

import { LoadableContent } from "../src/common/loadableContent";

import { ElementHarness } from "./harness";

describe("LoadableContent", () => {
    it("can render single child", () => {
        const someText = "some text";
        const { container } = render(
            <LoadableContent loading={false}>
                <span>{someText}</span>
            </LoadableContent>,
        );
        const loadableContentHarness = new ElementHarness(container);

        expect(loadableContentHarness.text()).to.equal(someText);
    });

    it("renders skeleton instead of child when loading", () => {
        const { container } = render(
            <LoadableContent loading={true}>
                <span>some text</span>
            </LoadableContent>,
        );
        const loadableContentHarness = new ElementHarness(container);
        const skeletonElement = loadableContentHarness.element!.children[0];

        expect(loadableContentHarness.text()).to.be.string("");
        expect(skeletonElement.children).to.be.empty;
        expect(skeletonElement.classList.contains(Classes.SKELETON));
    });
});
