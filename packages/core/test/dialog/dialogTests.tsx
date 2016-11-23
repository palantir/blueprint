/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import * as Keys from "../../src/common/keys";
import { Classes, Dialog } from "../../src/index";

describe("<Dialog>", () => {
    it("renders its content correctly", () => {
        const dialog = mount(
            <Dialog inline={true} isOpen={true}>
                {createDialogContents()}
            </Dialog>,
        );
        [
            Classes.DIALOG,
            Classes.DIALOG_BODY,
            Classes.DIALOG_FOOTER,
            Classes.DIALOG_FOOTER_ACTIONS,
            Classes.DIALOG_HEADER,
            Classes.OVERLAY_BACKDROP,
        ].forEach((className) => {
            assert.lengthOf(dialog.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("attempts to close when .pt-overlay-backdrop element is moused down", () => {
        const onClose = sinon.spy();
        const dialog = mount(
            <Dialog inline={true} isOpen={true} onClose={onClose}>
                {createDialogContents()}
            </Dialog>,
        );
        dialog.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        assert.isTrue(onClose.calledOnce);
    });

    it("doesn't close when canOutsideClickClose=false and .pt-overlay-backdrop element is moused down", () => {
        const onClose = sinon.spy();
        const dialog = mount(
            <Dialog canOutsideClickClose={false} inline={true} isOpen={true} onClose={onClose}>
                {createDialogContents()}
            </Dialog>,
        );
        dialog.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        assert.isTrue(onClose.notCalled);
    });

    it("doesn't close when canEscapeKeyClose=false and escape key is pressed", () => {
        const onClose = sinon.spy();
        const dialog = mount(
            <Dialog canEscapeKeyClose={false} inline={true} isOpen={true} onClose={onClose}>
                {createDialogContents()}
            </Dialog>,
        );
        dialog.simulate("keydown", { which: Keys.ESCAPE });
        assert.isTrue(onClose.notCalled);
    });

    describe("header", () => {
        it(`renders .${Classes.DIALOG_HEADER} if title prop is given`, () => {
            const dialog = mount(
                <Dialog inline={true} isOpen={true} title="Hello!">
                    dialog body
                </Dialog>,
            );
            assert.strictEqual(dialog.find(`.${Classes.DIALOG_HEADER}`).text(), "Hello!");
        });

        it(`renders close button if isCloseButtonShown={true}`, () => {
            const dialog = mount(
                <Dialog inline={true} isCloseButtonShown={true} isOpen={true} title="Hello!">
                    dialog body
                </Dialog>,
            );
            assert.lengthOf(dialog.find(`.${Classes.DIALOG_CLOSE_BUTTON}`), 1);

            dialog.setProps({ isCloseButtonShown: false });
            assert.lengthOf(dialog.find(`.${Classes.DIALOG_CLOSE_BUTTON}`), 0);
        });

        it("clicking close button triggers onClose", () => {
            const onClose = sinon.spy();
            const dialog = mount(
                <Dialog inline={true} isCloseButtonShown={true} isOpen={true} onClose={onClose} title="Hello!">
                    dialog body
                </Dialog>,
            );
            dialog.find(`.${Classes.DIALOG_CLOSE_BUTTON}`).simulate("click");
            assert.isTrue(onClose.calledOnce, "onClose not called");
        });
    });

    it("only adds its className in one location", () => {
        const dialog = mount(<Dialog className="foo" inline={true} isOpen={true} title="title"/>);
        assert.lengthOf(dialog.find(".foo"), 1);
    });

    // everything else about Dialog is tested by Overlay

    function createDialogContents(): JSX.Element[] {
        return [
            <div className={Classes.DIALOG_HEADER} key={0}>
                <span className="pt-icon-large pt-icon-inbox"/>
                <h4>Dialog Header</h4>
            </div>,
            <div className={Classes.DIALOG_BODY} key={1}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna alqua. Ut enim ad minimum veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>,
            <div className={Classes.DIALOG_FOOTER} key={2}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <button type="button" className="pt-button">Secondary</button>
                    <button className="pt-button pt-intent-primary" type="submit">
                        Primary
                    </button>
                </div>
            </div>,
        ];
    }
});
