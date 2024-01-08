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
import { type EnzymePropSelector, mount, type ReactWrapper } from "enzyme";
import * as React from "react";
import { type SinonSpy, spy } from "sinon";

import { CheckboxCard, Classes, RadioCard, RadioGroup, SwitchCard } from "../../src";

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

    describe("CheckboxCard", () => {
        it("is left-aligned by default", () => {
            const wrapper = mount(<CheckboxCard />, { attachTo: testsContainerElement });
            assert.isTrue(
                wrapper.find(`.${Classes.CONTROL}.${Classes.ALIGN_LEFT}`).exists(),
                "expected left alignment",
            );
        });
    });

    describe("RadioCard", () => {
        it("works like a Radio component inside a RadioGroup", () => {
            const changeSpy = spy();
            const group = mount(
                <RadioGroup onChange={changeSpy}>
                    <RadioCard value="one" label="One" />
                    <RadioCard value="two" label="Two" />
                </RadioGroup>,
            );
            findInput(group, { value: "one" }).simulate("change");
            findInput(group, { value: "two" }).simulate("change");
            assert.equal(changeSpy.callCount, 2);
        });
    });

    function findInput(wrapper: ReactWrapper<any, any>, props: EnzymePropSelector) {
        return wrapper.find("input").filter(props);
    }
});
