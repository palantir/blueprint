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
import React from "react";

import { ContextMenu, ContextMenuChildrenProps, ContextMenuProps, Menu, MenuItem, Popover } from "../../src";

const MENU_ITEMS = [
    <MenuItem key="left" icon="align-left" text="Align Left" />,
    <MenuItem key="center" icon="align-center" text="Align Center" />,
    <MenuItem key="right" icon="align-right" text="Align Right" />,
];
const MENU = <Menu>{MENU_ITEMS}</Menu>;
const TARGET_CLASSNAME = "test-target";

describe("ContextMenu", () => {
    describe("basic usage", () => {
        it("renders children and Popover", () => {
            const ctxMenu = mountTestMenu();
            assert.isTrue(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists());
            assert.isTrue(ctxMenu.find(Popover).exists());
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            assert.isTrue(ctxMenu.find(Popover).prop("isOpen"));
        });

        function mountTestMenu(props: Partial<ContextMenuProps> = {}) {
            return mount(
                <ContextMenu content={MENU} transitionDuration={0} {...props}>
                    <div className={TARGET_CLASSNAME} />
                </ContextMenu>,
            );
        }
    });

    describe("advanced usage", () => {
        it("renders children and Popover", () => {
            const ctxMenu = mountTestMenu();
            assert.isTrue(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists());
            assert.isTrue(ctxMenu.find(Popover).exists());
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            assert.isTrue(ctxMenu.find(Popover).prop("isOpen"));
        });

        function mountTestMenu() {
            return mount(
                <ContextMenu content={MENU} transitionDuration={0}>
                    {(props: ContextMenuChildrenProps) => (
                        <div
                            className={classNames(props.className, TARGET_CLASSNAME)}
                            onContextMenu={props.onContextMenu}
                            ref={props.ref}
                        />
                    )}
                </ContextMenu>,
            );
        }
    });

    function openCtxMenu(ctxMenu: ReactWrapper) {
        ctxMenu
            .find(`.${TARGET_CLASSNAME}`)
            .simulate("contextmenu", { defaultPrevented: false, clientX: 10, clientY: 10 })
            .update();
    }
});
