/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";

import { Button, Toast } from "../../src/index";

describe("<Toast>", () => {
    it("renders only dismiss button by default", () => {
        const button = shallow(<Toast message="Hello World" />).find(Button);
        assert.lengthOf(button, 1);
        assert.strictEqual(button.prop("iconName"), "cross");
    });

    it("clicking dismiss button triggers onDismiss callback with `false`", () => {
        const handleDismiss = sinon.spy();
        shallow(<Toast message="Hello" onDismiss={handleDismiss} />)
            .find(Button).simulate("click");
        assert.isTrue(handleDismiss.calledOnce, "onDismiss not called once");
        assert.isTrue(handleDismiss.calledWith(false), "onDismiss not called with false");
    });

    it("renders action button when action string prop provided", () => {
        // pluralize cuz now there are two buttons
        const buttons = shallow(<Toast action={{ text: "Undo" }} message="hello world" />).find(Button);
        assert.lengthOf(buttons, 2);
        assert.equal(buttons.first().prop("text"), "Undo");
    });

    it("clicking action button triggers onClick callback", () => {
        const onClick = sinon.spy();
        shallow(<Toast action={{ onClick, text: "Undo" }} message="Hello" />)
            .find(Button).first().simulate("click");
        assert.isTrue(onClick.calledOnce, "action onClick not called once");
    });

    it("clicking action button also triggers onDismiss callback with `false`", () => {
        const handleDismiss = sinon.spy();
        shallow(<Toast message="Hello" onDismiss={handleDismiss} />)
            .find(Button).first().simulate("click");
        assert.isTrue(handleDismiss.calledOnce, "onDismiss not called once");
        assert.isTrue(handleDismiss.calledWith(false), "onDismiss not called with false");
    });

    describe("timeout", () => {
        let handleDismiss: Sinon.SinonSpy;
        beforeEach(() => handleDismiss = sinon.spy());

        it("calls onDismiss automatically after timeout expires with `true`", (done) => {
            // mounting for lifecycle methods to start timeout
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            setTimeout(() => {
                assert.isTrue(handleDismiss.calledOnce, "onDismiss not called once");
                assert.isTrue(handleDismiss.firstCall.args[0], "onDismiss not called with `true`");
                done();
            }, 20);
        });

        it("updating with timeout={0} cancels timeout", (done) => {
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />)
                .setProps({ timeout: 0 });
            setTimeout(() => {
                assert.isTrue(handleDismiss.notCalled, "onDismiss was called");
                done();
            }, 20);
        });

        it("updating timeout={0} with timeout={X} starts timeout", (done) => {
            mount(<Toast message="Hello" onDismiss={handleDismiss} timeout={0} />)
                .setProps({ timeout: 20 });
            setTimeout(() => {
                assert.isTrue(handleDismiss.calledOnce, "onDismiss not called once");
                assert.isTrue(handleDismiss.firstCall.args[0], "onDismiss not called with `true`");
                done();
            }, 20);
        });
    });
});
