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

import { fireEvent, render, type RenderResult } from "@testing-library/react";

import { afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, Position } from "../../common";
import { Button } from "../button/buttons";

import { Drawer } from "./drawer";

describe("<Drawer>", () => {
    let result: RenderResult | undefined;

    afterEach(() => {
        result?.unmount();
        result = undefined;
        // Clean up any portal artifacts left in document.body
        document.querySelectorAll(`.${Classes.PORTAL}`).forEach(el => el.remove());
    });

    function renderDrawer(content: React.JSX.Element) {
        result = render(content);
        return result;
    }

    function findInDocument(selector: string): HTMLElement | null {
        // Drawer renders into a portal by default, but with usePortal={false} it stays in container.
        return document.querySelector<HTMLElement>(selector);
    }

    function findAllInDocument(selector: string): HTMLElement[] {
        return Array.from(document.querySelectorAll<HTMLElement>(selector));
    }

    it("renders its content correctly", () => {
        renderDrawer(
            <Drawer isOpen={true} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        [Classes.DRAWER, Classes.DRAWER_BODY, Classes.DRAWER_FOOTER, Classes.OVERLAY_BACKDROP].forEach(className => {
            expect(findAllInDocument(`.${className}`), `missing ${className}`).toHaveLength(1);
        });
    });

    describe("position", () => {
        describe("RIGHT", () => {
            it("position right, size becomes width", () => {
                renderDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.RIGHT} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(findInDocument(`.${Classes.DRAWER}`)?.style.width).toBe("100px");
            });

            it("position right, adds appropriate classes (default behavior)", () => {
                renderDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.RIGHT}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(findInDocument(`.${Classes.POSITION_RIGHT}`)).not.toBeNull();
            });
        });

        describe("TOP", () => {
            it("position top, size becomes height", () => {
                renderDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.TOP} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(findInDocument(`.${Classes.DRAWER}`)?.style.height).toBe("100px");
            });

            it("position top, adds appropriate classes (vertical, reverse)", () => {
                renderDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.TOP}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(findInDocument(`.${Classes.POSITION_TOP}`)).not.toBeNull();
            });
        });

        describe("BOTTOM", () => {
            it("position bottom, size becomes height", () => {
                renderDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.BOTTOM} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(findInDocument(`.${Classes.DRAWER}`)?.style.height).toBe("100px");
            });

            it("position bottom, adds appropriate classes (vertical)", () => {
                renderDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.BOTTOM}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(findInDocument(`.${Classes.POSITION_BOTTOM}`)).not.toBeNull();
            });
        });

        describe("LEFT", () => {
            it("position left, size becomes width", () => {
                renderDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.LEFT} size={100}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(findInDocument(`.${Classes.DRAWER}`)?.style.width).toBe("100px");
            });

            it("position left, adds appropriate classes (reverse)", () => {
                renderDrawer(
                    <Drawer isOpen={true} usePortal={false} position={Position.LEFT}>
                        {createDrawerContents()}
                    </Drawer>,
                );
                expect(findInDocument(`.${Classes.POSITION_LEFT}`)).not.toBeNull();
            });
        });
    });

    it("size becomes width", () => {
        renderDrawer(
            <Drawer isOpen={true} usePortal={false} size={100}>
                {createDrawerContents()}
            </Drawer>,
        );
        expect(findInDocument(`.${Classes.DRAWER}`)?.style.width).toBe("100px");
    });

    it("portalClassName appears on Portal", () => {
        const TEST_CLASS = "test-class";
        renderDrawer(
            <Drawer isOpen={true} portalClassName={TEST_CLASS}>
                {createDrawerContents()}
            </Drawer>,
        );
        expect(document.querySelector(`.${Classes.PORTAL}.${TEST_CLASS}`)).not.toBeNull();
    });

    it("renders contents to specified container correctly", () => {
        const portalContainer = document.createElement("div");
        document.body.appendChild(portalContainer);
        renderDrawer(
            <Drawer isOpen={true} portalContainer={portalContainer}>
                {createDrawerContents()}
            </Drawer>,
        );
        result?.unmount();
        result = undefined;
        document.body.removeChild(portalContainer);

        const onClose = vi.fn();
        renderDrawer(
            <Drawer isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        fireEvent.mouseDown(findInDocument(`.${Classes.OVERLAY_BACKDROP}`)!);
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("doesn't close when canOutsideClickClose=false and overlay backdrop element is moused down", () => {
        const onClose = vi.fn();
        renderDrawer(
            <Drawer canOutsideClickClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        fireEvent.mouseDown(findInDocument(`.${Classes.OVERLAY_BACKDROP}`)!);
        expect(onClose).not.toHaveBeenCalled();
    });

    it("doesn't close when canEscapeKeyClose=false and escape key is pressed", () => {
        const onClose = vi.fn();
        renderDrawer(
            <Drawer canEscapeKeyClose={false} isOpen={true} onClose={onClose} usePortal={false}>
                {createDrawerContents()}
            </Drawer>,
        );
        fireEvent.keyDown(findInDocument(`.${Classes.OVERLAY}`)!, { key: "Escape" });
        expect(onClose).not.toHaveBeenCalled();
    });

    it("supports overlay lifecycle props", () => {
        const onOpening = vi.fn();
        renderDrawer(
            <Drawer isOpen={true} onOpening={onOpening}>
                body
            </Drawer>,
        );
        expect(onOpening).toHaveBeenCalledOnce();
    });

    describe("header", () => {
        it(`does not render .${Classes.DRAWER_HEADER} if title omitted`, () => {
            renderDrawer(
                <Drawer isOpen={true} usePortal={false}>
                    drawer body
                </Drawer>,
            );
            expect(findInDocument(`.${Classes.DRAWER_HEADER}`)).toBeNull();
        });

        it(`renders .${Classes.DRAWER_HEADER} if title prop is given`, () => {
            renderDrawer(
                <Drawer isOpen={true} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            expect(findInDocument(`.${Classes.DRAWER_HEADER}`)?.textContent).toMatch(/^Hello!/);
        });

        it(`renders close button if isCloseButtonShown={true}`, () => {
            const { rerender } = renderDrawer(
                <Drawer isCloseButtonShown={true} isOpen={true} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            expect(findInDocument(`.${Classes.DRAWER_HEADER}`)!.querySelectorAll("button")).toHaveLength(1);

            rerender(
                <Drawer isCloseButtonShown={false} isOpen={true} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            expect(findInDocument(`.${Classes.DRAWER_HEADER}`)!.querySelectorAll("button")).toHaveLength(0);
        });

        it("clicking close button triggers onClose", () => {
            const onClose = vi.fn();
            renderDrawer(
                <Drawer isCloseButtonShown={true} isOpen={true} onClose={onClose} title="Hello!" usePortal={false}>
                    drawer body
                </Drawer>,
            );
            const closeButton = findInDocument(`.${Classes.DRAWER_HEADER} button`)!;
            fireEvent.click(closeButton);
            expect(onClose).toHaveBeenCalledOnce();
        });
    });

    it("only adds its className in one location", () => {
        renderDrawer(<Drawer className="foo" isOpen={true} title="title" usePortal={false} />);
        expect(findAllInDocument(".foo")).toHaveLength(1);
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
