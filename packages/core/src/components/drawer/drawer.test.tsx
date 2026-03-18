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

import { mount, type ReactWrapper } from "enzyme";

import { afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, Position } from "../../common";
import { Button } from "../button/buttons";

import { Drawer, type DrawerProps } from "./drawer";

describe("<Drawer>", () => {
    let drawer: ReactWrapper<DrawerProps, any>;
    let isMounted = false;
    const containerElement = document.createElement("div");
    document.documentElement.appendChild(containerElement);

    /**
     * Mount the `content` into `containerElement` and assign to local `wrapper` variable.
     * Use this method in this suite instead of Enzyme's `mount` method.
     */
    function mountDrawer(content: React.JSX.Element) {
        drawer = mount(content, { attachTo: containerElement });
        isMounted = true;
        return drawer;
    }

    afterEach(() => {
        if (isMounted) {
            // clean up wrapper after each test, if it was used
            drawer?.unmount();
            drawer?.detach();
            isMounted = false;
        }
    });

    it("renders its content correctly", () => {
        mountDrawer(
            <Drawer isOpen={true} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        [Classes.DRAWER, Classes.DRAWER_BODY, Classes.DRAWER_FOOTER, Classes.OVERLAY_BACKDROP].forEach(className => {
            expect(drawer.find(`.${className}`), `missing ${className}`).toHaveLength(1);
        });
    });

    describe("position", () => {
        describe("RIGHT", () => {
            it("position right, size becomes width", () => {
                mountDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.RIGHT} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(drawer.find(`.${Classes.DRAWER}`).prop("style")?.width).toBe(100);
            });

            it("position right, adds appropriate classes (default behavior)", () => {
                mountDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.RIGHT}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(drawer.find(`.${Classes.POSITION_RIGHT}`).exists()).toBe(true);
            });
        });

        describe("TOP", () => {
            it("position top, size becomes height", () => {
                mountDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.TOP} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(drawer.find(`.${Classes.DRAWER}`).prop("style")?.height).toBe(100);
            });

            it("position top, adds appropriate classes (vertical, reverse)", () => {
                mountDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.TOP}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(drawer.find(`.${Classes.POSITION_TOP}`).exists()).toBe(true);
            });
        });

        describe("BOTTOM", () => {
            it("position bottom, size becomes height", () => {
                mountDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.BOTTOM} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(drawer.find(`.${Classes.DRAWER}`).prop("style")?.height).toBe(100);
            });

            it("position bottom, adds appropriate classes (vertical)", () => {
                mountDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.BOTTOM}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(drawer.find(`.${Classes.POSITION_BOTTOM}`).exists()).toBe(true);
            });
        });

        describe("LEFT", () => {
            it("position left, size becomes width", () => {
                mountDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.LEFT} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(drawer.find(`.${Classes.DRAWER}`).prop("style")?.width).toBe(100);
            });

            it("position left, adds appropriate classes (reverse)", () => {
                mountDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.LEFT}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(drawer.find(`.${Classes.POSITION_LEFT}`).exists()).toBe(true);
            });
        });
    });

    it("size becomes width", () => {
        mountDrawer(
            <Drawer isOpen={true} usePortal={false} size={100}>
                {createDrawerContents()}
            </Drawer>,
        );
        expect(drawer.find(`.${Classes.DRAWER}`).prop("style")?.width).toBe(100);
    });

    it("portalClassName appears on Portal", () => {
        const TEST_CLASS = "test-class";
        mountDrawer(
            <Drawer isOpen={true} portalClassName={TEST_CLASS}>
                {createDrawerContents()}
            </Drawer>,
        );
        expect(document.querySelector(`.${Classes.PORTAL}.${TEST_CLASS}`)).toBeDefined();
    });

    it("renders contents to specified container correctly", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        mountDrawer(
            <Drawer isOpen={true} portalContainer={container}>
                {createDrawerContents()}
            </Drawer>,
        );
        drawer.unmount();
        document.body.removeChild(container);
        const onClose = vi.fn();
        mountDrawer(
            <Drawer isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        drawer.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("doesn't close when canOutsideClickClose=false and overlay backdrop element is moused down", () => {
        const onClose = vi.fn();
        mountDrawer(
            <Drawer canOutsideClickClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        drawer.find(`.${Classes.OVERLAY_BACKDROP}`).simulate("mousedown");
        expect(onClose).not.toHaveBeenCalled();
    });

    it("doesn't close when canEscapeKeyClose=false and escape key is pressed", () => {
        const onClose = vi.fn();
        mountDrawer(
            <Drawer canEscapeKeyClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        drawer.simulate("keydown", { key: "Escape" });
        expect(onClose).not.toHaveBeenCalled();
    });

    it("supports overlay lifecycle props", () => {
        const onOpening = vi.fn();
        mountDrawer(
            <Drawer isOpen={true} onOpening={onOpening}>
                body
            </Drawer>,
        );
        expect(onOpening).toHaveBeenCalledOnce();
    });

    describe("header", () => {
        it(`does not render .${Classes.DRAWER_HEADER} if title omitted`, () => {
            mountDrawer(
                <Drawer isOpen={true} usePortal={false}>
                    drawer body
                </Drawer>,
            );
            expect(drawer.find(`.${Classes.DRAWER_HEADER}`).exists()).toBe(false);
        });

        it(`renders .${Classes.DRAWER_HEADER} if title prop is given`, () => {
            mountDrawer(
                <Drawer isOpen={true} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            expect(drawer.find(`.${Classes.DRAWER_HEADER}`).text()).toMatch(/^Hello!/);
        });

        it(`renders close button if isCloseButtonShown={true}`, () => {
            mountDrawer(
                <Drawer isCloseButtonShown={true} isOpen={true} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            expect(drawer.find(`.${Classes.DRAWER_HEADER}`).find(Button)).toHaveLength(1);

            drawer.setProps({ isCloseButtonShown: false });
            expect(drawer.find(`.${Classes.DRAWER_HEADER}`).find(Button)).toHaveLength(0);
        });

        it("clicking close button triggers onClose", () => {
            const onClose = vi.fn();
            mountDrawer(
                <Drawer isCloseButtonShown={true} isOpen={true} onClose={onClose} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            drawer.find(`.${Classes.DRAWER_HEADER}`).find(Button).simulate("click");
            expect(onClose).toHaveBeenCalledOnce();
        });
    });

    it("only adds its className in one location", () => {
        mountDrawer(<Drawer className="foo" isOpen={true} title="title" usePortal={false} />);
        expect(drawer.find(".foo").hostNodes()).toHaveLength(1);
    });

    // everything else about Drawer is tested by Overlay

    function createDrawerContents(): React.JSX.Element[] {
        return [
            <div className={Classes.DRAWER_BODY} key={1}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna alqua. Ut enim ad minimum veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
            </div>,
            <div className={Classes.DRAWER_FOOTER} key={2}>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <Button text="Secondary" />
                    <Button className={Classes.INTENT_PRIMARY} type="submit" text="Primary" />
                </div>
            </div>,
        ];
    }
});
