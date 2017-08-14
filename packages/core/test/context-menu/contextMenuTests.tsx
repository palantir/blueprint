/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { Classes, ContextMenu, ContextMenuTarget, Menu, MenuItem } from "../../src/index";

const MENU_ITEMS = [
    <MenuItem key="left" iconName="align-left" text="Align Left" />,
    <MenuItem key="center" iconName="align-center" text="Align Center" />,
    <MenuItem key="right" iconName="align-right" text="Align Right" />,
];
const MENU = <Menu>{MENU_ITEMS}</Menu>;

describe("ContextMenu", () => {
    before(() => assert.isNull(getPopover()));
    afterEach(() => ContextMenu.hide());

    it("React renders ContextMenu", () => {
        ContextMenu.show(MENU, { left: 0, top: 0 });
        assertContextMenuWasRendered();
    });

    it("invokes onClose callback when menu closed", () => {
        const onClose = sinon.spy();
        ContextMenu.show(MENU, { left: 0, top: 0 }, onClose);
        ContextMenu.hide();
        assert.isTrue(onClose.calledOnce, "onClose not called");
    });

    it("does not invoke previous onClose callback", () => {
        const onClose = sinon.spy();
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

            rightClickMe.find(RightClickMe).last().simulate("contextmenu");
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
    return document.query(`.${Classes.POPOVER}.${Classes.MINIMAL}`);
}

function assertContextMenuWasRendered(expectedLength = MENU_ITEMS.length) {
    const menu = document.query(`.${Classes.CONTEXT_MENU}`);
    assert.isNotNull(menu);
    // popover is rendered in a Portal
    const popover = getPopover();
    assert.isNotNull(popover);
    const menuItems = popover.queryAll(`.${Classes.MENU_ITEM}`);
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
