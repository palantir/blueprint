/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { Alert, Button, Classes, Icon, Intent } from "../../src/index";

const NOOP: () => any = () => undefined;

describe("<Alert>", () => {
    it("renders its content correctly", () => {
        const wrapper = shallow(
            <Alert
                className="test-class"
                isOpen={true}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onConfirm={NOOP}
                onCancel={NOOP}
            >
                <p>Are you sure you want to delete this file?</p>
                <p>There is no going back.</p>
            </Alert>,
        );

        assert.lengthOf(wrapper.find(`.${Classes.ALERT}.test-class`), 1);
        assert.lengthOf(wrapper.find(`.${Classes.ALERT_BODY}`), 1);
        assert.lengthOf(wrapper.find(`.${Classes.ALERT_CONTENTS}`), 1);
        assert.lengthOf(wrapper.find(`.${Classes.ALERT_FOOTER}`), 1);
    });

    it("renders the icon correctly", () => {
        const wrapper = shallow(
            <Alert iconName="warning-sign" isOpen={true} confirmButtonText="Delete" onConfirm={NOOP}>
                <p>Are you sure you want to delete this file?</p>
                <p>There is no going back.</p>
            </Alert>,
        );

        assert.lengthOf(wrapper.find(Icon), 1);
    });

    describe("confirm button", () => {
        let wrapper: ShallowWrapper<any, any>;
        let onConfirm: Sinon.SinonSpy;

        beforeEach(() => {
            onConfirm = sinon.spy();
            wrapper = shallow(
                <Alert
                    iconName="warning-sign"
                    intent={Intent.PRIMARY}
                    isOpen={true}
                    confirmButtonText="Delete"
                    onConfirm={onConfirm}
                >
                    <p>Are you sure you want to delete this file?</p>
                    <p>There is no going back.</p>
                </Alert>,
            );
        });

        it("text is confirmButtonText", () => {
            assert.equal(wrapper.find(Button).prop("text"), "Delete");
        });

        it("intent inherited from prop", () => {
            assert.equal(wrapper.find(Button).prop("intent"), Intent.PRIMARY);
        });

        it("onClick triggered on click", () => {
            wrapper.find(Button).simulate("click");
            assert.isTrue(onConfirm.calledOnce);
        });
    });

    describe("cancel button", () => {
        let wrapper: ShallowWrapper<any, any>;
        let onCancel: Sinon.SinonSpy;
        let cancelButton: ShallowWrapper<any, any>;

        beforeEach(() => {
            onCancel = sinon.spy();
            wrapper = shallow(
                <Alert
                    iconName="warning-sign"
                    intent={Intent.PRIMARY}
                    isOpen={true}
                    cancelButtonText="Cancel"
                    confirmButtonText="Delete"
                    onCancel={onCancel}
                    onConfirm={NOOP}
                >
                    <p>Are you sure you want to delete this file?</p>
                    <p>There is no going back.</p>
                </Alert>,
            );
            cancelButton = wrapper.find(Button).last();
        });

        it("text is cancelButtonText", () => {
            assert.equal(cancelButton.prop("text"), "Cancel");
        });

        it("intent is undefined", () => {
            assert.isUndefined(cancelButton.prop("intent"));
        });

        it("onClick triggered on click", () => {
            cancelButton.simulate("click");
            assert.isTrue(onCancel.calledOnce);
        });
    });
});
