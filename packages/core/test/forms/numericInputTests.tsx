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

import { assert } from "chai";
import { mount } from "enzyme";
import { spy } from "sinon";
import * as React from "react";

import { NumericInput } from "../../src";

describe("<NumericInput>", () => {
    it("Initial state should be empty string", () => {
        const wrapper = mount(<NumericInput />);
        const input = wrapper.find("input");

        assert.strictEqual(input.prop("value"), "");
    });

    it("Should handle increment up to 21 decimal digits", () => {
        const changeSpy = spy();
        const wrapper = mount(
            <NumericInput
                onValueChange={changeSpy}
                value={0}
                stepSize={0.000000000000000001}
                minorStepSize={0.000000000000000001}
            />,
        );
        const input = wrapper.find("input");

        console.log(input.simulate("keydown", { key: "ArrowUp" }));

        assert.isTrue(changeSpy.calledWith(0.000000000000000001));
    });
});
