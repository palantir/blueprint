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
import * as React from "react";

import { Menu, MenuItem } from "@blueprintjs/core";

import { hideContextMenu, showContextMenu } from "../src";

const TEST_MENU_CLASS_NAME = "test-menu";
const MENU = (
    <Menu className={TEST_MENU_CLASS_NAME}>
        <MenuItem icon="align-left" text="Align Left" />,
        <MenuItem icon="align-center" text="Align Center" />,
        <MenuItem icon="align-right" text="Align Right" />,
    </Menu>
);

describe("showContextMenu() + hideContextMenu()", () => {
    afterEach(() => {
        hideContextMenu();
    });

    it("shows a menu with the imperative API", done => {
        showContextMenu({
            content: MENU,
            onOpened: () => {
                const ctxMenuElement = document.querySelectorAll(`.${TEST_MENU_CLASS_NAME}`);
                assert.isTrue(ctxMenuElement.length === 1);
                done();
            },
            targetOffset: {
                left: 10,
                top: 10,
            },
        });
    });

    it("hides a menu with the imperative API", done => {
        showContextMenu({
            content: MENU,
            onOpened: () => {
                hideContextMenu();
                setTimeout(() => {
                    const ctxMenuElement = document.querySelectorAll(`.${TEST_MENU_CLASS_NAME}`);
                    assert.isTrue(ctxMenuElement.length === 0);
                    done();
                });
            },
            targetOffset: {
                left: 10,
                top: 10,
            },
        });
    });
});
