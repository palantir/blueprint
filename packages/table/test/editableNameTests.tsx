/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { EditableName } from "../src/index";

describe("<EditableName>", () => {
    it("renders", () => {
        const elem = mount(<EditableName name="test-name-5000" />);
        expect(elem.find(".pt-editable-content").text()).to.equal("test-name-5000");
    });

    it("edits", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();
        const elem = mount(
            <EditableName name="test-name-5000" onCancel={onCancel} onChange={onChange} onConfirm={onConfirm} />,
        );

        // focus
        elem.find(".pt-editable-text").simulate("focus");

        // edit
        const input = elem.find(".pt-editable-input").simulate("change", { target: { value: "my-changed-name" } });
        expect(onChange.called).to.be.true;
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.false;
        expect(elem.find(".pt-editable-content").text()).to.equal("my-changed-name");

        // confirm
        input.simulate("blur");
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.true;
    });
});
