/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import { spy, SinonSpy } from "sinon";

import { SwitchCard } from "../../src";

describe("ControlCard", () => {
    let testsContainerElement: HTMLElement | undefined;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        testsContainerElement?.remove();
    });

    describe("SwitchCard", () => {
        const handleControlChangeSpy = spy() as SinonSpy<[React.FormEvent<HTMLInputElement>], void>;

        beforeEach(() => {
            handleControlChangeSpy.resetHistory();
        });

        it("clicking on label element toggles switch state", () => {
            const wrapper = mount(<SwitchCard defaultChecked={false} onChange={handleControlChangeSpy} />, {
                attachTo: testsContainerElement,
            });
            wrapper.find("input").simulate("change");
            assert.isTrue(handleControlChangeSpy.calledOnce, "expected onChange to be called");
        });
    });
});
