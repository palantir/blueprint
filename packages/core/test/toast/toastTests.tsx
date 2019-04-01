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

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import { SinonSpy, spy } from "sinon";

import { AnchorButton, Button, Toast } from "../../src/index";

describe("<Toast>", () => {
    it("renders only dismiss button by default", () => {
        const { action, dismiss } = wrap(<Toast message="Hello World" />);
        assert.lengthOf(action, 0);
        assert.lengthOf(dismiss, 1);
        assert.strictEqual(dismiss.prop("icon"), "cross");
    });

    it("clicking dismiss button triggers onDismiss callback with `false`", () => {
        const handleDismiss = spy();
        wrap(<Toast message="Hello" onDismiss={handleDismiss} />).dismiss.simulate("click");
        assert.isTrue(handleDismiss.calledOnce, "onDismiss not called once");
        assert.isTrue(handleDismiss.calledWith(false), "onDismiss not called with false");
    });

    it("renders action button when action string prop provided", () => {
        // pluralize cuz now there are two buttons
        const { action } = wrap(<Toast action={{ text: "Undo" }} message="hello world" />);
        assert.lengthOf(action, 1);
        assert.equal(action.prop("text"), "Undo");
    });

    it("clicking action button triggers onClick callback", () => {
        const onClick = spy();
        wrap(<Toast action={{ onClick, text: "Undo" }} message="Hello" />).action.simulate("click");
        assert.isTrue(onClick.calledOnce, "action onClick not called once");
    });

    it("clicking action button also triggers onDismiss callback with `false`", () => {
        const handleDismiss = spy();
        wrap(<Toast action={{ text: "Undo" }} message="Hello" onDismiss={handleDismiss} />).action.simulate("click");
        assert.isTrue(handleDismiss.calledOnce, "onDismiss not called once");
        assert.isTrue(handleDismiss.calledWith(false), "onDismiss not called with false");
    });

    function wrap(toast: JSX.Element) {
        const root = shallow(toast);
        return {
            action: root.find(AnchorButton),
            dismiss: root.find(Button),
            root,
        };
    }

    describe("timeout", () => {
        let handleDismiss: SinonSpy;
        beforeEach(() => (handleDismiss = spy()));

        it("calls onDismiss automatically after timeout expires with `true`", done => {
            // mounting for lifecycle methods to start timeout
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            setTimeout(() => {
                assert.isTrue(handleDismiss.calledOnce, "onDismiss not called once");
                assert.isTrue(handleDismiss.firstCall.args[0], "onDismiss not called with `true`");
                done();
            }, 20);
        });

        it("updating with timeout={0} cancels timeout", done => {
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />).setProps({ timeout: 0 });
            setTimeout(() => {
                assert.isTrue(handleDismiss.notCalled, "onDismiss was called");
                done();
            }, 20);
        });

        it("updating timeout={0} with timeout={X} starts timeout", done => {
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={0} />).setProps({ timeout: 20 });
            setTimeout(() => {
                assert.isTrue(handleDismiss.calledOnce, "onDismiss not called once");
                assert.isTrue(handleDismiss.firstCall.args[0], "onDismiss not called with `true`");
                done();
            }, 20);
        });
    });
});
