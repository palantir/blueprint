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
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { Button, Classes, Dialog, DialogBody, DialogFooter, type DialogProps } from "../../src";

const COMMON_PROPS: Partial<DialogProps> = {
    icon: "inbox",
    isOpen: true,
    title: "Dialog header",
    usePortal: false,
};

describe("<Dialog>", () => {
    it("renders its content correctly", () => {
        const dialog = mount(<Dialog {...COMMON_PROPS}>{renderDialogBodyAndFooter()}</Dialog>);
        [
            Classes.DIALOG,
            Classes.DIALOG_BODY,
            Classes.DIALOG_FOOTER,
            Classes.DIALOG_FOOTER_ACTIONS,
            Classes.DIALOG_HEADER,
            Classes.OVERLAY_BACKDROP,
        ].forEach(className => {
            assert.lengthOf(dialog.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("portalClassName appears on Portal", () => {
        const TEST_CLASS = "test-class";
        const dialog = mount(
            <Dialog {...COMMON_PROPS} usePortal={true} portalClassName={TEST_CLASS}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        assert.isDefined(document.querySelector(`.${Classes.PORTAL}.${TEST_CLASS}`));
        dialog.unmount();
    });

    it("renders contents to specified container correctly", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        mount(
            <Dialog {...COMMON_PROPS} usePortal={true} portalContainer={container}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        assert.lengthOf(container.getElementsByClassName(Classes.DIALOG), 1, `missing ${Classes.DIALOG}`);
        document.body.removeChild(container);
    });

    it("attempts to close when overlay backdrop element is moused down", () => {
        const onClose = spy();
        const dialog = mount(
            <Dialog {...COMMON_PROPS} onClose={onClose}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        dialog.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        assert.isTrue(onClose.calledOnce);
    });

    it("doesn't close when canOutsideClickClose=false and overlay backdrop element is moused down", () => {
        const onClose = spy();
        const dialog = mount(
            <Dialog {...COMMON_PROPS} canOutsideClickClose={false} onClose={onClose}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        dialog.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        assert.isTrue(onClose.notCalled);
    });

    it("doesn't close when canEscapeKeyClose=false and escape key is pressed", () => {
        const onClose = spy();
        const dialog = mount(
            <Dialog {...COMMON_PROPS} canEscapeKeyClose={false} onClose={onClose}>
                {renderDialogBodyAndFooter()}
            </Dialog>,
        );
        dialog.simulate("keydown", { key: "Escape" });
        assert.isTrue(onClose.notCalled);
    });

    it("supports overlay lifecycle props", () => {
        const onOpening = spy();
        mount(
            <Dialog {...COMMON_PROPS} onOpening={onOpening}>
                body
            </Dialog>,
        );
        assert.isTrue(onOpening.calledOnce);
    });

    describe("header", () => {
        it(`renders .${Classes.DIALOG_HEADER} if title prop is given`, () => {
            const dialog = mount(
                <Dialog {...COMMON_PROPS} title="Hello!">
                    dialog body
                </Dialog>,
            );
            assert.match(dialog.find(`.${Classes.DIALOG_HEADER}`).text(), /^Hello!/);
        });

        it(`renders close button if isCloseButtonShown={true}`, () => {
            const dialog = mount(
                <Dialog {...COMMON_PROPS} isCloseButtonShown={true}>
                    dialog body
                </Dialog>,
            );
            assert.lengthOf(dialog.find(`.${Classes.DIALOG_HEADER}`).find(Button), 1);

            dialog.setProps({ isCloseButtonShown: false });
            assert.lengthOf(dialog.find(`.${Classes.DIALOG_HEADER}`).find(Button), 0);
        });

        it("clicking close button triggers onClose", () => {
            const onClose = spy();
            const dialog = mount(
                <Dialog {...COMMON_PROPS} isCloseButtonShown={true} onClose={onClose}>
                    dialog body
                </Dialog>,
            );
            dialog.find(`.${Classes.DIALOG_HEADER}`).find(Button).simulate("click");
            assert.isTrue(onClose.calledOnce, "onClose not called");
        });
    });

    it("only adds its className in one location", () => {
        const dialog = mount(<Dialog {...COMMON_PROPS} className="foo" />);
        assert.lengthOf(dialog.find(".foo").hostNodes(), 1);
    });

    describe("accessibility features", () => {
        const mountDialog = (props: Partial<DialogProps>) => {
            return mount(
                <Dialog {...COMMON_PROPS} {...props}>
                    {renderDialogBodyAndFooter()}
                </Dialog>,
            );
        };

        it("renders with role={dialog}", () => {
            const dialog = mountDialog({ className: "check-role" });
            assert.equal(dialog.find(`.check-role`).hostNodes().prop("role"), "dialog", "missing dialog role!!");
        });

        it("renders with provided aria-labelledby and aria-described by from props", () => {
            const dialog = mountDialog({
                "aria-describedby": "dialog-description",
                "aria-labelledby": "dialog-title",
                className: "renders-with-props",
            });
            const dialogElement = dialog.find(`.renders-with-props`).hostNodes();
            assert.equal(dialogElement.prop("aria-labelledby"), "dialog-title");
            assert.equal(dialogElement.prop("aria-describedby"), "dialog-description");
        });

        it("uses title as default aria-labelledby", () => {
            const dialog = mountDialog({ className: "default-title", title: "Title by props" });
            // test existence here because id is generated
            assert.exists(dialog.find(".default-title").hostNodes().prop("aria-labelledby"));
        });

        it("does not apply default aria-labelledby if no title", () => {
            const dialog = mountDialog({ className: "no-default-if-no-title", title: null });
            // test existence here because id is generated
            assert.notExists(dialog.find(".no-default-if-no-title").hostNodes().prop("aria-labelledby"));
        });

        it("supports ref objects attached to container", done => {
            const containerRef = React.createRef<HTMLDivElement>();
            mountDialog({ containerRef });

            // wait for the whole lifecycle to run
            setTimeout(() => {
                assert.isTrue(containerRef.current?.classList.contains(Classes.DIALOG_CONTAINER));
                done();
            }, 0);
        });
    });

    // N.B. everything else about Dialog is tested by Overlay

    function renderDialogBodyAndFooter(): JSX.Element[] {
        return [
            <DialogBody key="body">
                <p id="dialog-description">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna alqua. Ut enim ad minimum veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </DialogBody>,
            <DialogFooter
                key="footer"
                actions={
                    <>
                        <Button text="Secondary" />
                        <Button className={Classes.INTENT_PRIMARY} type="submit" text="Primary" />
                    </>
                }
            />,
        ];
    }
});
