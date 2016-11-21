/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { expect } from "chai";
import * as React from "react";
import { EditableCell } from "../src/index";
import { ReactHarness } from "./harness";

describe("<EditableCell>", () => {
    let harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("renders", () => {
        const elem = harness.mount(<EditableCell value="test-value-5000" />);
        expect(elem.find(".pt-editable-content").text()).to.equal("test-value-5000");
    });

    it("edits", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();
        const elem = harness.mount(<EditableCell
            value="test-value-5000"
            onCancel={onCancel}
            onChange={onChange}
            onConfirm={onConfirm}
        />);

        // double click to edit
        elem.find(".pt-editable-content")
            .mouse("mousedown")
            .mouse("mouseup")
            .mouse("mousedown")
            .mouse("mouseup");
        const input = elem.find(".pt-editable-input");
        expect(input.element).to.equal(document.activeElement);

        // edit
        input.change("my-changed-value");
        expect(onChange.called).to.be.true;
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.false;
        expect(elem.find(".pt-editable-content").text()).to.equal("my-changed-value");

        // confirm
        input.blur();
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.true;
    });
});
