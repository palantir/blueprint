/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
import classNames from "classnames";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { Menu, MenuItem } from "@blueprintjs/core";

import { Classes, ContextMenu2, ContextMenu2ContentProps, ContextMenu2Props, Popover2, Tooltip2 } from "../src";

const MENU_ITEMS = [
    <MenuItem key="left" icon="align-left" text="Align Left" />,
    <MenuItem key="center" icon="align-center" text="Align Center" />,
    <MenuItem key="right" icon="align-right" text="Align Right" />,
];
const MENU = <Menu>{MENU_ITEMS}</Menu>;
const TARGET_CLASSNAME = "test-target";

describe("ContextMenu2", () => {
    describe("basic usage", () => {
        it("renders children and Popover2", () => {
            const ctxMenu = mountTestMenu();
            assert.isTrue(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists());
            assert.isTrue(ctxMenu.find(Popover2).exists());
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            assert.isTrue(ctxMenu.find(Popover2).prop("isOpen"));
        });

        it("renders custom HTML tag if specified", () => {
            const ctxMenu = mountTestMenu({ tagName: "span" });
            assert.isTrue(ctxMenu.find(`span.${Classes.CONTEXT_MENU2}`).exists());
        });

        it("supports custom refs", () => {
            const ref = React.createRef<HTMLElement>();
            mountTestMenu({ className: "test-container", ref });
            assert.isDefined(ref.current);
            assert.isTrue(ref.current?.classList.contains("test-container"));
        });

        function mountTestMenu(props: Partial<ContextMenu2Props> = {}) {
            return mount(
                <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }} {...props}>
                    <div className={TARGET_CLASSNAME} />
                </ContextMenu2>,
            );
        }
    });

    describe("advanced usage (child render function API)", () => {
        it("renders children and Popover", () => {
            const ctxMenu = mountTestMenu();
            assert.isTrue(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists());
            assert.isTrue(ctxMenu.find(Popover2).exists());
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            assert.isTrue(ctxMenu.find(Popover2).prop("isOpen"));
        });

        it("handles context menu event, even if content is undefined", () => {
            const ctxMenu = mountTestMenu({ content: undefined });
            let clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            assert.strictEqual(clickedInfo.text().trim(), renderClickedInfo(undefined));
            openCtxMenu(ctxMenu);
            clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            assert.strictEqual(clickedInfo.text().trim(), renderClickedInfo({ left: 10, top: 10 }));
        });

        it("does not handle context menu event when disabled={true}", () => {
            const ctxMenu = mountTestMenu({ disabled: true });
            let clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            assert.strictEqual(clickedInfo.text().trim(), renderClickedInfo(undefined));
            openCtxMenu(ctxMenu);
            clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            assert.strictEqual(clickedInfo.text().trim(), renderClickedInfo(undefined));
        });

        function mountTestMenu(props?: Partial<ContextMenu2Props>) {
            return mount(
                <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }} {...props}>
                    {ctxMenuProps => (
                        <div
                            className={classNames(ctxMenuProps.className, TARGET_CLASSNAME)}
                            onContextMenu={ctxMenuProps.onContextMenu}
                        >
                            {ctxMenuProps.popover}
                            <span data-testid="content-clicked-info">
                                {renderClickedInfo(ctxMenuProps.contentProps.targetOffset)}
                            </span>
                        </div>
                    )}
                </ContextMenu2>,
            );
        }
    });

    describe("interacting with other components", () => {
        it("closes parent Tooltip2", () => {
            const wrappedCtxMenu = mount(
                <Tooltip2 content="hello">
                    <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <div className={TARGET_CLASSNAME} />
                    </ContextMenu2>
                </Tooltip2>,
            );

            openTooltip(wrappedCtxMenu);
            openCtxMenu(wrappedCtxMenu);
            assert.isTrue(
                wrappedCtxMenu.find(ContextMenu2).find(Popover2).prop("isOpen"),
                "ContextMenu2 popover should be open",
            );
            assert.lengthOf(wrappedCtxMenu.find(Classes.TOOLTIP2), 0, "Tooltip2 should be closed");
        });

        it("closes child Tooltip2", () => {
            const ctxMenu = mount(
                <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }}>
                    <Tooltip2 content="hello">
                        <div className={TARGET_CLASSNAME} />
                    </Tooltip2>
                </ContextMenu2>,
            );

            openTooltip(ctxMenu);
            openCtxMenu(ctxMenu);
            assert.isTrue(
                ctxMenu.find(ContextMenu2).find(Popover2).first().prop("isOpen"),
                "ContextMenu2 popover should be open",
            );
            assert.lengthOf(ctxMenu.find(Classes.TOOLTIP2), 0, "Tooltip2 should be closed");
        });

        function openTooltip(wrapper: ReactWrapper) {
            wrapper.find(`.${TARGET_CLASSNAME}`).simulate("mouseenter");
        }
    });

    function openCtxMenu(ctxMenu: ReactWrapper) {
        ctxMenu
            .find(`.${TARGET_CLASSNAME}`)
            .simulate("contextmenu", { defaultPrevented: false, clientX: 10, clientY: 10 })
            .update();
    }

    function renderClickedInfo(targetOffset: ContextMenu2ContentProps["targetOffset"]) {
        return targetOffset === undefined ? "" : `Clicked at (${targetOffset.left}, ${targetOffset.top})`;
    }
});
