/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { IOptionProps } from "../../src/common/props";
import { HTMLSelect } from "../../src/components/html-select/htmlSelect";

describe("<HtmlSelect>", () => {
    const emptyHandler = () => true;

    it("renders options strings", () => {
        const options = mount(<HTMLSelect onChange={emptyHandler} options={["a", "b"]} />).find("option");
        assert.equal(options.at(0).text(), "a");
        assert.equal(options.at(1).text(), "b");
    });

    it("renders options props", () => {
        const OPTIONS: IOptionProps[] = [
            { value: "a" },
            { value: "b", className: "foo" },
            { value: "c", disabled: true },
            { value: "d", label: "Dog" },
        ];
        const options = mount(<HTMLSelect onChange={emptyHandler} options={OPTIONS} />).find("option");
        assert.equal(options.at(0).text(), "a", "value");
        assert.isTrue(options.at(1).hasClass("foo"), "className");
        assert.isTrue(options.at(2).prop("disabled"), "disabled");
        assert.equal(options.at(3).text(), "Dog", "label");
    });
});
