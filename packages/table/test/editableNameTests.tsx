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

import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { EditableText } from "@blueprintjs/core";
import { EditableName } from "../src/index";

describe("<EditableName>", () => {
    it("renders", () => {
        const elem = mount(<EditableName name="test-name-5000" />);
        expect(elem.find(EditableText).text()).to.equal("test-name-5000");
    });

    it("edits", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();
        const elem = mount(
            <EditableName name="test-name-5000" onCancel={onCancel} onChange={onChange} onConfirm={onConfirm} />,
        );

        // focus
        elem.find(EditableText).simulate("focus");

        // edit
        const input = elem
            .find(EditableText)
            .find("input")
            .simulate("change", { target: { value: "my-changed-name" } });

        expect(onChange.called).to.be.true;
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.false;
        expect(elem.find(EditableText).text()).to.equal("my-changed-name");

        // confirm
        input.simulate("blur");
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.true;
    });
});
