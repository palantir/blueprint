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

// tslint:disable max-classes-per-file

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { Classes, ContextMenu, ContextMenuTarget, Menu, MenuItem } from "../../src/index";

const MENU_ITEMS = [
    <MenuItem key="left" icon="align-left" text="Align Left" />,
    <MenuItem key="center" icon="align-center" text="Align Center" />,
    <MenuItem key="right" icon="align-right" text="Align Right" />,
];
const MENU = <Menu>{MENU_ITEMS}</Menu>;

describe("ContextMenu", () => {
    before(() => assert.isNull(getPopover()));
    afterEach(() => ContextMenu.hide());

    it("Decorator does not mutate the original class", () => {
        class TestComponent extends React.Component<{}, {}> {
            public render() {
                return <div />;
            }

            public renderContextMenu() {
                return MENU;
            }
        }

        const TargettedTestComponent = ContextMenuTarget(TestComponent);

        // it's not the same Component
        assert.notStrictEqual(TargettedTestComponent, TestComponent);
    });

    it("React renders ContextMenu", () => {
        ContextMenu.show(MENU, { left: 0, top: 0 });
        assertContextMenuWasRendered();
    });

    it("invokes onClose callback when menu closed", done => {
        ContextMenu.show(MENU, { left: 0, top: 0 }, done);
        ContextMenu.hide();
    });

    it("removes element from the DOM after closing", done => {
        ContextMenu.show(MENU, { left: 0, top: 0 });
        ContextMenu.hide();
        setTimeout(() => {
            assert.isTrue(document.querySelector(`.${Classes.CONTEXT_MENU}`) == null);
            done();
        }, 110);
    });

    it("does not invoke previous onClose callback", () => {
        const onClose = spy();
        ContextMenu.show(MENU, { left: 0, top: 0 }, onClose);
        ContextMenu.show(MENU, { left: 10, top: 10 });
        ContextMenu.hide();
        assert.isTrue(onClose.notCalled, "onClose was called");
    });

    describe("decorator", () => {
        it("is connected via `ContextMenuTarget`", () => {
            mount(<RightClickMe />).simulate("contextmenu");
            assertContextMenuWasRendered();
        });

        it("supports nesting targets", () => {
            const childItems = MENU_ITEMS.concat(<MenuItem key="child" text="child!" />);
            const rightClickMe = mount(
                <RightClickMe>
                    <RightClickMe items={childItems} />
                </RightClickMe>,
            );
            rightClickMe.simulate("contextmenu");
            assertContextMenuWasRendered();

            rightClickMe
                .find(RightClickMe)
                .last()
                .simulate("contextmenu");
            assertContextMenuWasRendered(childItems.length);
        });

        /* -- uncomment this test to confirm compilation failure -- */
        // it("TypeScript compilation fails if decorated class does not implement renderContextMenu", () => {
        //     @ContextMenuTarget
        //     return class TypeScriptFail extends React.Component<{}, {}> {
        //         public render() { return <article />; }
        //     }
        // });
    });
});

function getPopover() {
    return document.querySelector(`.${Classes.POPOVER}.${Classes.MINIMAL}`);
}

function assertContextMenuWasRendered(expectedLength = MENU_ITEMS.length) {
    const menu = document.querySelector(`.${Classes.CONTEXT_MENU}`);
    assert.isNotNull(menu);
    // popover is rendered in a Portal
    const popover = getPopover();
    assert.isNotNull(popover);
    const menuItems = popover.querySelectorAll(`.${Classes.MENU_ITEM}`);
    assert.lengthOf(menuItems, expectedLength);
}

@ContextMenuTarget
class RightClickMe extends React.Component<{ items?: JSX.Element[] }, {}> {
    public static defaultProps = {
        items: MENU_ITEMS,
    };

    public render() {
        return <div>{this.props.children}</div>;
    }

    public renderContextMenu() {
        return <Menu>{this.props.items}</Menu>;
    }
}
