/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import * as ReactDOM from "react-dom";

import * as Classes from "../../src/common/classes";
import { IToaster, Toaster } from "../../src/index";

describe("Toaster", () => {
    let testsContainerElement: HTMLElement;
    let toaster: IToaster;

    before(() => {
        testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
        toaster = Toaster.create({}, testsContainerElement);
    });

    afterEach(() => {
        toaster.clear();
        ReactDOM.unmountComponentAtNode(testsContainerElement);
    });

    it("does not attach .pt-toast-container to body on script load", () => {
        assert.lengthOf(document.getElementsByClassName(Classes.TOAST_CONTAINER), 0, "unexpected toast container");
    });

    it("show() renders toast immediately", () => {
        toaster.show({
            message: "Hello world",
        });
        assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
        assert.isNotNull(document.query(`.${Classes.TOAST_CONTAINER}.${Classes.OVERLAY_OPEN}`));
    });

    it("multiple show()s renders them all", () => {
        toaster.show({ message: "one" });
        toaster.show({ message: "two" });
        toaster.show({ message: "six" });
        assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
    });

    it("update() updates existing toast", () => {
        const key = toaster.show({ message: "one" });
        assert.deepEqual(toaster.getToasts()[0].message, "one");
        toaster.update(key, { message: "two" });
        assert.lengthOf(toaster.getToasts(), 1, "expected 1 toast");
        assert.deepEqual(toaster.getToasts()[0].message, "two");
    });

    it("dismiss() removes just the toast in question", () => {
        toaster.show({ message: "one" });
        const key = toaster.show({ message: "two" });
        toaster.show({ message: "six" });
        toaster.dismiss(key);
        assert.deepEqual(toaster.getToasts().map((t) => t.message), ["six", "one"]);
    });

    it("clear() removes all toasts", () => {
        toaster.show({ message: "one" });
        toaster.show({ message: "two" });
        toaster.show({ message: "six" });
        assert.lengthOf(toaster.getToasts(), 3, "expected 3 toasts");
        toaster.clear();
        assert.lengthOf(toaster.getToasts(), 0, "expected 0 toasts");
    });

    it("action onClick callback invoked when action clicked", () => {
        const onClick = sinon.spy();
        toaster.show({
            action: { onClick, text: "action" },
            message: "message",
            timeout: 0,
        });
        const action = document.queryAll(`.${Classes.TOAST} .${Classes.BUTTON}`)[0] as HTMLElement;
        action.click();
        assert.isTrue(onClick.calledOnce, "expected onClick to be called once");
    });

    it("onDismiss callback invoked when close button clicked", () => {
        const handleDismiss = sinon.spy();
        toaster.show({
            message: "dismiss",
            onDismiss: handleDismiss,
            timeout: 0,
        });
        const dismiss = document.queryAll(`.${Classes.TOAST} .${Classes.BUTTON}`)[0] as HTMLElement;
        dismiss.click();
        assert.isTrue(handleDismiss.calledOnce);
    });

    it("onDismiss callback invoked on toaster.dismiss()", () => {
        const onDismiss = sinon.spy();
        const key = toaster.show({ message: "dismiss me", onDismiss });
        toaster.dismiss(key);
        assert.isTrue(onDismiss.calledOnce, "onDismiss not called");
    });

    it("onDismiss callback invoked on toaster.clear()", () => {
        const onDismiss = sinon.spy();
        toaster.show({ message: "dismiss me", onDismiss });
        toaster.clear();
        assert.isTrue(onDismiss.calledOnce, "onDismiss not called");
    });
});
