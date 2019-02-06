/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import * as Keys from "../../src/common/keys";
import { Button, Classes, Drawer, H4, Icon } from "../../src/index";

describe("<Drawer>", () => {
    it("renders its content correctly", () => {
        const drawer = mount(
            <Drawer isOpen={true} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        [
            Classes.DRAWER,
            Classes.DRAWER_BODY,
            Classes.DRAWER_FOOTER,
            Classes.DRAWER_HEADER,
            Classes.OVERLAY_BACKDROP,
        ].forEach(className => {
            assert.lengthOf(drawer.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("portalClassName appears on Portal", () => {
        const TEST_CLASS = "test-class";
        const drawer = mount(
            <Drawer isOpen={true} portalClassName={TEST_CLASS}>
                {createDrawerContents()}
            </Drawer>,
        );
        assert.isDefined(document.querySelector(`.${Classes.PORTAL}.${TEST_CLASS}`));
        drawer.unmount();
    });

    it("renders contents to specified container correctly", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        mount(
            <Drawer isOpen={true} portalContainer={container}>
                {createDrawerContents()}
            </Drawer>,
        );
        document.body.removeChild(container);
        const onClose = spy();
        const drawer = mount(
            <Drawer isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        drawer.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        assert.isTrue(onClose.calledOnce);
    });

    it("doesn't close when canOutsideClickClose=false and overlay backdrop element is moused down", () => {
        const onClose = spy();
        const drawer = mount(
            <Drawer canOutsideClickClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        drawer.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        assert.isTrue(onClose.notCalled);
    });

    it("doesn't close when canEscapeKeyClose=false and escape key is pressed", () => {
        const onClose = spy();
        const drawer = mount(
            <Drawer canEscapeKeyClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        drawer.simulate("keydown", { which: Keys.ESCAPE });
        assert.isTrue(onClose.notCalled);
    });

    it("supports overlay lifecycle props", () => {
        const onOpening = spy();
        mount(
            <Drawer isOpen={true} onOpening={onOpening}>
                body
            </Drawer>,
        );
        assert.isTrue(onOpening.calledOnce);
    });

    describe("header", () => {
        it(`renders .${Classes.DRAWER_HEADER} if title prop is given`, () => {
            const drawer = mount(
                <Drawer isOpen={true} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            assert.match(drawer.find(`.${Classes.DRAWER_HEADER}`).text(), /^Hello!/);
        });

        it(`renders close button if isCloseButtonShown={true}`, () => {
            const drawer = mount(
                <Drawer isCloseButtonShown={true} isOpen={true} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            assert.lengthOf(drawer.find(`.${Classes.DRAWER_HEADER}`).find(Button), 1);

            drawer.setProps({ isCloseButtonShown: false });
            assert.lengthOf(drawer.find(`.${Classes.DRAWER_HEADER}`).find(Button), 0);
        });

        it("clicking close button triggers onClose", () => {
            const onClose = spy();
            const drawer = mount(
                <Drawer isCloseButtonShown={true} isOpen={true} onClose={onClose} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            drawer
                .find(`.${Classes.DRAWER_HEADER}`)
                .find(Button)
                .simulate("click");
            assert.isTrue(onClose.calledOnce, "onClose not called");
        });
    });

    it("only adds its className in one location", () => {
        const drawer = mount(<Drawer className="foo" isOpen={true} title="title" usePortal={false} />);
        assert.lengthOf(drawer.find(".foo").hostNodes(), 1);
    });

    // everything else about Drawer is tested by Overlay

    function createDrawerContents(): JSX.Element[] {
        return [
            <div className={Classes.DRAWER_HEADER} key={0}>
                <Icon icon="inbox" iconSize={Icon.SIZE_LARGE} />
                <H4>Drawer header</H4>
            </div>,
            <div className={Classes.DRAWER_BODY} key={1}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna alqua. Ut enim ad minimum veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </div>,
            <div className={Classes.DRAWER_FOOTER} key={2}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Secondary" />
                    <Button className={Classes.INTENT_PRIMARY} type="submit" text="Primary" />
                </div>
            </div>,
        ];
    }
});
