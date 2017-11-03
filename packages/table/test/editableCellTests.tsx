/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import * as Classes from "../src/common/classes";
import { EditableCell } from "../src/index";
import { CellType, expectCellLoading } from "./cellTestUtils";
import { ElementHarness, ReactHarness } from "./harness";

describe("<EditableCell>", () => {
    const harness = new ReactHarness();

    afterEach(() => {
        harness.unmount();
    });

    after(() => {
        harness.destroy();
    });

    it("renders", () => {
        const elem = harness.mount(<EditableCell value="test-value-5000" />);
        expect(elem.find(`.${Classes.TABLE_TRUNCATED_TEXT}`).text()).to.equal("test-value-5000");
    });

    it("renders loading state", () => {
        const editableCellHarness = harness.mount(<EditableCell loading={true} value="test-value-5000" />);
        expectCellLoading(editableCellHarness.element.children[0], CellType.BODY_CELL);
    });

    it("renders new value if props.value changes", () => {
        const VALUE_1 = "foo";
        const VALUE_2 = "bar";

        const elem = mount(<EditableCell value={VALUE_1} />);
        expect(elem.find(`.${Classes.TABLE_TRUNCATED_TEXT}`).text()).to.equal(VALUE_1);

        elem.setProps({ value: VALUE_2 });
        expect(elem.find(`.${Classes.TABLE_TRUNCATED_TEXT}`).text()).to.equal(VALUE_2);
    });

    it("edits", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();
        const elem = harness.mount(
            <EditableCell value="test-value-5000" onCancel={onCancel} onChange={onChange} onConfirm={onConfirm} />,
        );

        // double click to edit
        doubleClickToEdit(elem);
        const input = getInput(elem);
        // TODO: throws JSON-stringify cyclic errors as of #1741; need to fix.
        // expect(input.element).to.equal(document.activeElement);

        // edit
        input.change("my-changed-value");
        expect(onChange.called).to.be.true;
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.false;
        expect(elem.find(".pt-editable-content").text()).to.equal("my-changed-value");

        // confirm
        input.blur();
        expect(onCancel.called).to.be.false;
        // TODO: onBlur isn't firing as of #1741; need to re-enable this test.
        // expect(onConfirm.called).to.be.true;
    });

    it("doesn't change edited value on non-value prop changes", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();
        const elem = harness.mount(
            <EditableCell value="test-value-5000" onCancel={onCancel} onChange={onChange} onConfirm={onConfirm} />,
        );

        // double click to edit
        doubleClickToEdit(elem);
        const input = getInput(elem);
        // TODO: throws JSON-stringify cyclic errors as of #1741; need to fix.
        // expect(input.element).to.equal(document.activeElement);

        // edit
        input.change("my-changed-value");
        expect(onChange.called).to.be.true;
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.false;
        expect(elem.find(".pt-editable-content").text()).to.equal("my-changed-value");

        harness.mount(
            <EditableCell value="test-value-5000" onCancel={onCancel} onChange={null} onConfirm={onConfirm} />,
        );
        expect(elem.find(".pt-editable-content").text()).to.equal("my-changed-value");

        // confirm
        input.blur();
        expect(onCancel.called).to.be.false;
        // TODO: onBlur isn't firing as of #1741; need to re-enable this test.
        // expect(onConfirm.called).to.be.true;
    });

    it("passes index prop to callbacks if index was provided", () => {
        const onCancelSpy = sinon.spy();
        const onChangeSpy = sinon.spy();
        const onConfirmSpy = sinon.spy();

        const CHANGED_VALUE = "my-changed-value";
        const ROW_INDEX = 17;
        const COLUMN_INDEX = 44;

        const elem = harness.mount(
            <EditableCell
                rowIndex={ROW_INDEX}
                columnIndex={COLUMN_INDEX}
                onCancel={onCancelSpy}
                onChange={onChangeSpy}
                onConfirm={onConfirmSpy}
            />,
        );

        doubleClickToEdit(elem);

        // edit
        const input = getInput(elem);
        input.change(CHANGED_VALUE);
        expect(onChangeSpy.firstCall.args).to.deep.equal([CHANGED_VALUE, ROW_INDEX, COLUMN_INDEX]);

        // confirm
        input.blur();
        // TODO: onBlur isn't firing as of #1741; need to re-enable this test.
        // expect(onConfirmSpy.firstCall.args).to.deep.equal([CHANGED_VALUE, ROW_INDEX, COLUMN_INDEX]);
    });

    function doubleClickToEdit(elem: ElementHarness) {
        elem
            .find(`.${Classes.TABLE_TRUNCATED_TEXT}`)
            .mouse("mousedown")
            .mouse("mouseup")
            .mouse("mousedown")
            .mouse("mouseup");
    }

    function getInput(elem: ElementHarness) {
        return elem.find(".pt-editable-input");
    }
});
