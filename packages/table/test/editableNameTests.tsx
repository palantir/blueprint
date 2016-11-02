/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { EditableName } from "../src/index";
import { ReactHarness } from "./harness";
import { expect } from "chai";

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
