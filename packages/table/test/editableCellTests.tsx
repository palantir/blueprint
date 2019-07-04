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

import { Classes } from "@blueprintjs/core";
import * as TableClasses from "../src/common/classes";
import { EditableCell } from "../src/index";
import { CellType, expectCellLoading } from "./cellTestUtils";

describe("<EditableCell>", () => {
    it("renders", () => {
        const elem = mount(<EditableCell value="test-value-5000" />);
        expect(elem.find(`.${TableClasses.TABLE_TRUNCATED_TEXT}`).text()).to.equal("test-value-5000");
    });

    it("renders loading state", () => {
        const editableCellHarness = mount(<EditableCell loading={true} value="test-value-5000" />);
        expectCellLoading(editableCellHarness.first().getDOMNode(), CellType.BODY_CELL);
    });

    it("renders new value if props.value changes", () => {
        const VALUE_1 = "foo";
        const VALUE_2 = "bar";

        const elem = mount(<EditableCell value={VALUE_1} />);
        expect(elem.find(`.${TableClasses.TABLE_TRUNCATED_TEXT}`).text()).to.equal(VALUE_1);

        elem.setProps({ value: VALUE_2 });
        expect(elem.find(`.${TableClasses.TABLE_TRUNCATED_TEXT}`).text()).to.equal(VALUE_2);
    });

    it("edits", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();

        const elem = mount(
            <EditableCell value="test-value-5000" onCancel={onCancel} onChange={onChange} onConfirm={onConfirm} />,
        );

        // start editing
        elem.setState({ isEditing: true, dirtyValue: "test-value-5000" });
        const input = elem.find("input");
        expect(input.length).to.equal(1);

        // make changes
        input.simulate("change", { target: { value: "new-text" } });
        expect(onChange.called).to.be.true;
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.false;
        expect(elem.text()).to.equal("new-text");

        // confirm
        input.simulate("blur");
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.true;
    });

    it("changes value state on non-value prop changes", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();

        const elem = mount(
            <EditableCell value="test-value-5000" onCancel={onCancel} onChange={onChange} onConfirm={onConfirm} />,
        );

        // start editing
        elem.setState({ isEditing: true, dirtyValue: "test-value-5000" });
        const input = elem.find(`.${TableClasses.TABLE_EDITABLE_TEXT} input`);
        expect(input.length).to.equal(1);

        // make changes
        input.simulate("change", { target: { value: "new-text" } });
        expect(onChange.called).to.be.true;
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.false;
        expect(elem.text()).to.equal("new-text");

        // confirm
        input.simulate("blur");
        expect(onCancel.called).to.be.false;
        expect(onConfirm.called).to.be.true;
        // cell shows user-entered text until re-render
        expect(elem.text()).to.equal("new-text");

        // set non-value prop, forces EditableCell update
        elem.setProps({ onChange: null });
        // value resets to prop
        expect(elem.text()).to.equal("test-value-5000");
    });

    it("passes index prop to callbacks if index was provided", () => {
        const onCancelSpy = sinon.spy();
        const onChangeSpy = sinon.spy();
        const onConfirmSpy = sinon.spy();

        const CHANGED_VALUE = "my-changed-value";
        const ROW_INDEX = 17;
        const COLUMN_INDEX = 44;

        const elem = mount(
            <EditableCell
                rowIndex={ROW_INDEX}
                columnIndex={COLUMN_INDEX}
                onCancel={onCancelSpy}
                onChange={onChangeSpy}
                onConfirm={onConfirmSpy}
            />,
        );

        // start editing
        elem.setState({ isEditing: true, dirtyValue: "" });

        // change value
        elem.find("input").simulate("change", { target: { value: CHANGED_VALUE } });
        expect(onChangeSpy.firstCall.args).to.deep.equal([CHANGED_VALUE, ROW_INDEX, COLUMN_INDEX]);

        // confirm
        elem.find("input").simulate("blur");
        expect(onChangeSpy.firstCall.args).to.deep.equal([CHANGED_VALUE, ROW_INDEX, COLUMN_INDEX]);
    });

    it("defaults to no wrapText", () => {
        const elem = mount(<EditableCell />);
        expect(elem.find(`.${TableClasses.TABLE_NO_WRAP_TEXT}`).exists()).to.be.true;
    });

    it("wraps text when wrapText is true", () => {
        const elem = mount(<EditableCell wrapText={true} />);
        expect(elem.find(`.${TableClasses.TABLE_NO_WRAP_TEXT}`).exists()).to.be.false;
    });

    it("Passes editableTextProps to inner EditableText", () => {
        const onCancel = sinon.spy();
        const onChange = sinon.spy();
        const onConfirm = sinon.spy();

        const elem = mount(
            <EditableCell
                value="test-value-5000"
                onCancel={onCancel}
                onChange={onChange}
                onConfirm={onConfirm}
                editableTextProps={{
                    className: "input-only-class",
                    maxLength: 345,
                    value: "ignore this",
                }}
            />,
        );

        // start editing
        elem.setState({ isEditing: true, dirtyValue: "test-value-5000" });
        const input = elem.find("input");
        // input props that EditableCell does not care about should pass through unchanged
        expect(input.prop("maxLength")).to.equal(345);
        expect(elem.find(`.${Classes.EDITABLE_TEXT}`).prop("className")).to.contain("input-only-class");

        // But special values should be overridden by EditableCell
        expect(input.prop("value")).to.equal("test-value-5000");
    });
});
