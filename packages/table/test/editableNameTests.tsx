/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { EditableName } from "../src/index";
import { ReactHarness } from "./harness";
import { expect } from "chai";
import * as React from "react";

describe("<EditableName>", () => {
    let harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("renders", () => {
        const elem = harness.mount(<EditableName name="test-name-5000" />);
        expect(elem.find(".pt-editable-content").text()).to.equal("test-name-5000");
    });

    it("edits", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();
        const elem = harness.mount(<EditableName
            name="test-name-5000"
            onCancel={onCancel}
            onChange={onChange}
            onConfirm={onConfirm}
        />);

        // focus
        elem.find(".pt-editable-text").focus();

        // edit
        const input = elem.find(".pt-editable-input").change("my-changed-name");
        expect(onChange.called).to.be.true;
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.false;
        expect(elem.find(".pt-editable-content").text()).to.equal("my-changed-name");

        // confirm
        input.blur();
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.true;
    });
});
