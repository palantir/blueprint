/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { spy, stub } from "sinon";

import { MENU_WARN_CHILDREN_SUBMENU_MUTEX } from "../../src/common/errors";
import {
    Button,
    Classes,
    Icon,
    IMenuItemProps,
    IMenuProps,
    IPopoverProps,
    Menu,
    MenuDivider,
    MenuItem,
    Popover,
    PopoverInteractionKind,
} from "../../src/index";

describe("MenuItem", () => {
    it("React renders MenuItem", () => {
        const wrapper = shallow(<MenuItem iconName="graph" text="Graph" />);
        assert.lengthOf(wrapper.find(Icon), 1);
        assert.match(wrapper.text(), /Graph$/);
    });

    it("children appear in submenu", () => {
        const wrapper = shallow(
            <MenuItem iconName="style" text="Style">
                <MenuItem iconName="bold" text="Bold" />
                <MenuItem iconName="italic" text="Italic" />
                <MenuItem iconName="underline" text="Underline" />
            </MenuItem>,
        );
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, 3);
    });

    it("submenu props appear as MenuItems in submenu", () => {
        const items: IMenuItemProps[] = [
            { iconName: "align-left", text: "Align Left" },
            { iconName: "align-center", text: "Align Center" },
            { iconName: "align-right", text: "Align Right" },
        ];
        const wrapper = shallow(<MenuItem iconName="align-left" text="Alignment" submenu={items} />);
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, items.length);
    });

    it("disabled MenuItem will not show its submenu", () => {
        const wrapper = shallow(
            <MenuItem disabled={true} iconName="style" text="Style">
                <MenuItem iconName="bold" text="Bold" />
                <MenuItem iconName="italic" text="Italic" />
                <MenuItem iconName="underline" text="Underline" />
            </MenuItem>,
        );
        assert.isTrue(wrapper.find(Popover).prop("disabled"));
    });

    it("renders children if given children and submenu", () => {
        const warnSpy = stub(console, "warn");
        const wrapper = shallow(
            <MenuItem iconName="style" text="Style" submenu={[{ text: "foo" }]}>
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, 2);
        assert.isTrue(warnSpy.alwaysCalledWith(MENU_WARN_CHILDREN_SUBMENU_MUTEX));
        warnSpy.restore();
    });

    it("Clicking MenuItem triggers onClick prop", () => {
        const onClick = spy();
        shallow(<MenuItem text="Graph" onClick={onClick} />)
            .find("a")
            .simulate("click");
        assert.isTrue(onClick.calledOnce);
    });

    it("Clicking disabled MenuItem does not trigger onClick prop", () => {
        const onClick = spy();
        shallow(<MenuItem disabled={true} text="Graph" onClick={onClick} />)
            .find("a")
            .simulate("click");
        assert.isTrue(onClick.notCalled);
    });

    it("shouldDismissPopover=false prevents a clicked MenuItem from closing the Popover automatically", () => {
        const handleClose = spy();
        const menu = <MenuItem text="Graph" shouldDismissPopover={false} />;
        const wrapper = mount(
            <Popover content={menu} isOpen={true} onInteraction={handleClose}>
                <Button />
            </Popover>,
        );
        wrapper
            .find(MenuItem)
            .find("a")
            .simulate("click");
        assert.isTrue(handleClose.notCalled);
    });

    it("popoverProps (except content) are forwarded to Popover", () => {
        // Ensures that popover props are passed to Popover component, except content property
        const popoverProps: Partial<IPopoverProps> = {
            content: "CUSTOM_CONTENT",
            interactionKind: PopoverInteractionKind.CLICK,
            popoverClassName: "CUSTOM_POPOVER_CLASS_NAME",
        };
        const wrapper = shallow(
            <MenuItem iconName="style" text="Style" popoverProps={popoverProps}>
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        assert.strictEqual(wrapper.find(Popover).prop("interactionKind"), popoverProps.interactionKind);
        assert.notStrictEqual(
            wrapper
                .find(Popover)
                .prop("popoverClassName")
                .indexOf(popoverProps.popoverClassName),
            0,
        );
        assert.notStrictEqual(wrapper.find(Popover).prop("content"), popoverProps.content);
    });
});

describe("MenuDivider", () => {
    it("React renders MenuDivider", () => {
        const divider = shallow(<MenuDivider />);
        assert.isTrue(divider.hasClass(Classes.MENU_DIVIDER));
    });

    it("React renders MenuDivider with title", () => {
        const divider = shallow(<MenuDivider title="Subject" />);
        assert.isFalse(divider.hasClass(Classes.MENU_DIVIDER));
        assert.isTrue(divider.hasClass(Classes.MENU_HEADER));
        assert.strictEqual(divider.text(), "Subject");
    });
});

describe("Menu", () => {
    it("React renders Menu with children", () => {
        const menu = shallow(
            <Menu>
                <MenuItem iconName="graph" text="Graph" />
            </Menu>,
        );
        assert.isTrue(menu.hasClass(Classes.MENU));
        assert.lengthOf(menu.find(MenuItem), 1);
    });
});

function findSubmenu(wrapper: ShallowWrapper<any, any>) {
    return wrapper.find(Popover).prop("content") as React.ReactElement<
        IMenuProps & { children: Array<React.ReactElement<IMenuItemProps>> }
    >;
}
