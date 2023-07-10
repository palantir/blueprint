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

import { dispatchMouseEvent } from "@blueprintjs/test-commons";

import { Classes, hideContextMenu, Menu, MenuItem, showContextMenu, Utils } from "../../src";

// use a unique ID to avoid collisons with other tests
const MENU_CLASSNAME = Utils.uniqueId("test-menu");
const MENU = (
    <Menu className={MENU_CLASSNAME}>
        <MenuItem icon="align-left" text="Align Left" />
        <MenuItem icon="align-center" text="Align Center" />
        <MenuItem icon="align-right" text="Align Right" />
    </Menu>
);
const DEFAULT_CONTEXT_MENU_POPOVER_PROPS = {
    content: MENU,
    targetOffset: {
        left: 10,
        top: 10,
    },
    transitionDuration: 0,
};

function assertMenuState(isOpen = true) {
    const ctxMenuElement = document.querySelectorAll<HTMLElement>(`.${MENU_CLASSNAME}`);
    if (isOpen) {
        assert.isTrue(ctxMenuElement.length === 1, "Expected menu to be rendered on the page");
        assert.isNotNull(ctxMenuElement[0].closest(`.${Classes.OVERLAY_OPEN}`), "Expected overlay to be open");
    } else {
        if (ctxMenuElement.length > 0) {
            assert.isNull(ctxMenuElement[0].closest(`.${Classes.OVERLAY_OPEN}`), "Expected overlay to be closed");
        }
    }
}

function dismissContextMenu() {
    const backdrop = document.querySelector<HTMLElement>(`.${Classes.CONTEXT_MENU_BACKDROP}`);
    if (backdrop != null) {
        dispatchMouseEvent(backdrop, "mousedown");
    }
}

describe("showContextMenu() + hideContextMenu()", () => {
    let containerElement: HTMLElement | undefined;

    before(() => {
        // create an element on the page with non-zero dimensions so that we can trigger a context menu above it
        containerElement = document.createElement("div");
        containerElement.setAttribute("style", "width: 100px; height: 100px;");
        document.body.appendChild(containerElement);
    });

    beforeEach(() => {
        assertMenuState(false);
    });

    after(() => {
        containerElement?.remove();
    });

    it("shows a menu with the imperative API", done => {
        showContextMenu({
            ...DEFAULT_CONTEXT_MENU_POPOVER_PROPS,
            onOpened: () =>
                // defer assertions until the next animation frame; otherwise, this might throw an error
                // inside the <TransitionGroup>, which may throw off test debugging
                requestAnimationFrame(() => {
                    assertMenuState(true);
                    // important: close menu for the next test
                    dismissContextMenu();
                    done();
                }),
        });
    });

    describe("hides a menu", () => {
        it("by clicking on the backdrop (when onClose prop is defined)", done => {
            const handleClose = () =>
                requestAnimationFrame(() => {
                    assertMenuState(false);
                    done();
                });

            showContextMenu({
                ...DEFAULT_CONTEXT_MENU_POPOVER_PROPS,
                onClose: handleClose,
                onOpened: () =>
                    requestAnimationFrame(() => {
                        dismissContextMenu();
                    }),
            });
        });

        it("via hideContextMenu()", done => {
            showContextMenu({
                ...DEFAULT_CONTEXT_MENU_POPOVER_PROPS,
                onOpened: () =>
                    // defer assertions until the next animation frame
                    requestAnimationFrame(() => {
                        hideContextMenu();
                        assertMenuState(false);
                        done();
                    }),
            });
        });
    });
});
