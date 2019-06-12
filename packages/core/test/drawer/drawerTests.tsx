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
import { spy, stub } from "sinon";

import { DRAWER_ANGLE_POSITIONS_ARE_CASTED, DRAWER_VERTICAL_IS_IGNORED } from "../../src/common/errors";
import * as Keys from "../../src/common/keys";
import { Button, Classes, Drawer, Position } from "../../src/index";

describe("<Drawer>", () => {
    it("renders its content correctly", () => {
        const drawer = mount(
            <Drawer isOpen={true} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        [Classes.DRAWER, Classes.DRAWER_BODY, Classes.DRAWER_FOOTER, Classes.OVERLAY_BACKDROP].forEach(className => {
            assert.lengthOf(drawer.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    describe("position", () => {
        it("casts angle positions into pure positions (with console warning)", () => {
            const warnSpy = stub(console, "warn");

            const drawerTop = mount(
                <Drawer isOpen={true} usePortal={false} position={Position.TOP} size={100}>
                    {createDrawerContents()}
                </Drawer>,
            );
            const drawerLeft = mount(
                <Drawer isOpen={true} usePortal={false} position={Position.LEFT} size={100}>
                    {createDrawerContents()}
                </Drawer>,
            );
            const drawerTopRight = mount(
                <Drawer isOpen={true} usePortal={false} position={Position.TOP_RIGHT} size={100}>
                    {createDrawerContents()}
                </Drawer>,
            );
            const drawerTopLeft = mount(
                <Drawer isOpen={true} usePortal={false} position={Position.TOP_LEFT} size={100}>
                    {createDrawerContents()}
                </Drawer>,
            );
            const drawerLeftTop = mount(
                <Drawer isOpen={true} usePortal={false} position={Position.LEFT_TOP} size={100}>
                    {createDrawerContents()}
                </Drawer>,
            );

            assert.isTrue(
                drawerTop.find(`.${Classes.DRAWER}`).equals(drawerTopRight.find(`.${Classes.DRAWER}`).getElement()),
            );
            assert.isTrue(
                drawerTop.find(`.${Classes.DRAWER}`).equals(drawerTopLeft.find(`.${Classes.DRAWER}`).getElement()),
            );
            assert.isFalse(
                drawerTop.find(`.${Classes.DRAWER}`).equals(drawerLeftTop.find(`.${Classes.DRAWER}`).getElement()),
            );
            assert.isTrue(
                drawerLeft.find(`.${Classes.DRAWER}`).equals(drawerLeftTop.find(`.${Classes.DRAWER}`).getElement()),
            );

            assert.isTrue(warnSpy.alwaysCalledWith(DRAWER_ANGLE_POSITIONS_ARE_CASTED));
            warnSpy.restore();
        });

        it("overrides vertical (with console warning)", () => {
            const warnSpy = stub(console, "warn");

            const drawerLeft = mount(
                <Drawer isOpen={true} usePortal={false} vertical={true} position={Position.LEFT} size={100}>
                    {createDrawerContents()}
                </Drawer>,
            );

            // vertical size becomes height (opposite test)
            assert.equal(drawerLeft.find(`.${Classes.DRAWER}`).prop("style").width, 100);
            // vertical adds class (opposite test)
            assert.isFalse(drawerLeft.find(`.${Classes.VERTICAL}`).exists());

            assert.isTrue(warnSpy.alwaysCalledWith(DRAWER_VERTICAL_IS_IGNORED));
            warnSpy.restore();
        });

        describe("RIGHT", () => {
            it("position right is default", () => {
                const drawerDefault = mount(
                    <Drawer isOpen={true} usePortal={false} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                const drawerRight = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.RIGHT} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.equal(
                    drawerDefault.find(`.${Classes.DRAWER}`).prop("style").width,
                    drawerRight.find(`.${Classes.DRAWER}`).prop("style").width,
                );
                assert.equal(
                    drawerDefault.find(`.${Classes.DRAWER}`).prop("style").height,
                    drawerRight.find(`.${Classes.DRAWER}`).prop("style").height,
                );
            });

            it("position right, size becomes width", () => {
                const drawer = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.RIGHT} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.equal(drawer.find(`.${Classes.DRAWER}`).prop("style").width, 100);
            });

            it("position right, adds appropriate classes (default behavior)", () => {
                const drawer = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.RIGHT}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.isTrue(drawer.find(`.${Classes.POSITION_RIGHT}`).exists());
            });
        });

        describe("TOP", () => {
            it("position top, size becomes height", () => {
                const drawer = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.TOP} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.equal(drawer.find(`.${Classes.DRAWER}`).prop("style").height, 100);
            });

            it("position top, adds appropriate classes (vertical, reverse)", () => {
                const drawer = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.TOP}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.isTrue(drawer.find(`.${Classes.POSITION_TOP}`).exists());
            });
        });

        describe("BOTTOM", () => {
            it("position bottom, size becomes height", () => {
                const drawer = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.BOTTOM} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.equal(drawer.find(`.${Classes.DRAWER}`).prop("style").height, 100);
            });

            it("position bottom, adds appropriate classes (vertical)", () => {
                const drawer = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.BOTTOM}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.isTrue(drawer.find(`.${Classes.POSITION_BOTTOM}`).exists());
            });
        });

        describe("LEFT", () => {
            it("position left, size becomes width", () => {
                const drawer = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.LEFT} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.equal(drawer.find(`.${Classes.DRAWER}`).prop("style").width, 100);
            });

            it("position left, adds appropriate classes (reverse)", () => {
                const drawer = mount(
                    <Drawer isOpen={true} usePortal={false} position={Position.LEFT}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                assert.isTrue(drawer.find(`.${Classes.POSITION_LEFT}`).exists());
            });
        });
    });

    it("size becomes width", () => {
        const drawer = mount(
            <Drawer isOpen={true} usePortal={false} size={100}>
                {createDrawerContents()}
            </Drawer>,
        );
        assert.equal(drawer.find(`.${Classes.DRAWER}`).prop("style").width, 100);
    });

    it("vertical size becomes height", () => {
        const drawer = mount(
            <Drawer isOpen={true} usePortal={false} size={100} vertical={true}>
                {createDrawerContents()}
            </Drawer>,
        );
        assert.equal(drawer.find(`.${Classes.DRAWER}`).prop("style").height, 100);
    });

    it("vertical adds class", () => {
        const drawer = mount(
            <Drawer isOpen={true} usePortal={false} vertical={true}>
                {createDrawerContents()}
            </Drawer>,
        );
        assert.isTrue(drawer.find(`.${Classes.VERTICAL}`).exists());
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
        it(`does not render .${Classes.DRAWER_HEADER} if title omitted`, () => {
            const drawer = mount(
                <Drawer isOpen={true} usePortal={false}>
                    drawer body
                </Drawer>,
            );
            assert.isFalse(drawer.find(`.${Classes.DRAWER_HEADER}`).exists());
        });

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
