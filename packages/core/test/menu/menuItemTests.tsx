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
import type { ReactWrapper, ShallowWrapper } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { dispatchTestKeyboardEvent, mountTest, shallowTest } from "@blueprintjs/test-commons";

import {
    Button,
    Classes,
    Icon,
    MenuItem,
    type MenuItemProps,
    type MenuProps,
    Popover,
    PopoverInteractionKind,
    Text,
} from "../../src";

describe("MenuItem", () => {
    it("basic rendering", () => {
        using shallow = shallowTest(<MenuItem icon="graph" text="Graph" />);
        assert.isTrue(shallow.wrapper.find(Icon).exists());
        assert.strictEqual(findText(shallow.wrapper).text(), "Graph");
    });

    it("supports HTML props", () => {
        const mouseHandler = (_event: React.MouseEvent<HTMLElement>) => false;
        const keyHandler = (_event: React.KeyboardEvent<HTMLElement>) => false;
        using shallow = shallowTest(
            <MenuItem text="text" onClick={mouseHandler} onKeyDown={keyHandler} onMouseMove={mouseHandler} />,
        );
        const item = shallow.wrapper.find("a");
        assert.strictEqual(item.prop("onClick"), mouseHandler);
        assert.strictEqual(item.prop("onKeyDown"), keyHandler);
        assert.strictEqual(item.prop("onMouseMove"), mouseHandler);
    });

    it("children appear in submenu", () => {
        using shallow = shallowTest(
            <MenuItem icon="style" text="Style">
                <MenuItem icon="bold" text="Bold" />
                <MenuItem icon="italic" text="Italic" />
                <MenuItem icon="underline" text="Underline" />
            </MenuItem>,
        );
        const submenu = findSubmenu(shallow.wrapper);
        assert.lengthOf(submenu.props.children, 3);
    });

    it("default role prop structure is correct for a menuitem that is a an item of a ul with role=menu", () => {
        using mount = mountTest(<MenuItem text="Roles" />);
        assert.equal(mount.wrapper.find("li").prop("role"), "none");
        assert.equal(mount.wrapper.find("a").prop("role"), "menuitem");
    });

    it("can set roleStructure to change role prop structure to that of a listbox or select item", () => {
        using mount = mountTest(<MenuItem text="Roles" roleStructure="listoption" />);
        assert.equal(mount.wrapper.find("li").prop("role"), "option");
        assert.equal(mount.wrapper.find("a").prop("role"), undefined);
    });

    it("can set roleStructure to change role prop structure to that of a list item", () => {
        using mount = mountTest(<MenuItem text="Roles" roleStructure="listitem" />);
        assert.equal(mount.wrapper.find("li").prop("role"), undefined);
        assert.equal(mount.wrapper.find("a").prop("role"), undefined);
    });

    it('can set roleStructure to change role prop structure to void li role (set role="none")', () => {
        using mount = mountTest(<MenuItem text="Roles" roleStructure="none" />);
        assert.equal(mount.wrapper.find("li").prop("role"), "none");
        assert.equal(mount.wrapper.find("a").prop("role"), undefined);
    });

    it("disabled MenuItem will not show its submenu", () => {
        using shallow = shallowTest(
            <MenuItem disabled={true} icon="style" text="Style">
                <MenuItem icon="bold" text="Bold" />
                <MenuItem icon="italic" text="Italic" />
                <MenuItem icon="underline" text="Underline" />
            </MenuItem>,
        );
        assert.isTrue(shallow.wrapper.find(Popover).prop("disabled"));
    });

    it("disabled MenuItem blocks mouse listeners", () => {
        const mouseSpy = spy();
        using mount = mountTest(
            <MenuItem disabled={true} text="disabled" onClick={mouseSpy} onMouseEnter={mouseSpy} />,
        );
        mount.wrapper.simulate("click").simulate("mouseenter").simulate("click");
        assert.strictEqual(mouseSpy.callCount, 0);
    });

    it("clicking MenuItem triggers onClick prop", () => {
        const onClick = spy();
        using shallow = shallowTest(<MenuItem text="Graph" onClick={onClick} />);
        shallow.wrapper.find("a").simulate("click");
        assert.isTrue(onClick.calledOnce);
    });

    it("pressing enter on MenuItem triggers onClick prop", () => {
        const testsContainerElement = document.createElement("div");
        document.documentElement.appendChild(testsContainerElement);
        const onClick = spy();
        using mount = mountTest(<MenuItem text="Graph" onClick={onClick} />, { attachTo: testsContainerElement });
        dispatchTestKeyboardEvent(mount.wrapper.find("a").getDOMNode(), "keydown", "Enter");
        assert.isTrue(onClick.calledOnce);
    });

    it("clicking disabled MenuItem does not trigger onClick prop", () => {
        const onClick = spy();
        using shallow = shallowTest(<MenuItem disabled={true} text="Graph" onClick={onClick} />);
        shallow.wrapper.find("a").simulate("click");
        assert.isTrue(onClick.notCalled);
    });

    it("shouldDismissPopover=false prevents a clicked MenuItem from closing the Popover automatically", () => {
        const handleClose = spy();
        const menu = <MenuItem text="Graph" shouldDismissPopover={false} />;
        using mount = mountTest(
            <Popover content={menu} isOpen={true} onInteraction={handleClose} usePortal={false}>
                <Button />
            </Popover>,
        );
        mount.wrapper.find(MenuItem).find("a").simulate("click");
        assert.isTrue(handleClose.notCalled);
    });

    it("submenuProps are forwarded to the Menu", () => {
        const submenuProps = { "aria-label": "test-menu" };
        using shallow = shallowTest(
            <MenuItem icon="style" text="Style" submenuProps={submenuProps}>
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        const submenu = findSubmenu(shallow.wrapper);
        assert.strictEqual(submenu.props["aria-label"], submenuProps["aria-label"]);
    });

    it("popoverProps (except content) are forwarded to Popover", () => {
        // Ensures that popover props are passed to Popover component, except content property
        const popoverProps = {
            content: "CUSTOM_CONTENT",
            interactionKind: PopoverInteractionKind.CLICK,
            popoverClassName: "CUSTOM_POPOVER_CLASS_NAME",
        };
        using shallow = shallowTest(
            <MenuItem icon="style" text="Style" popoverProps={popoverProps}>
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        const wrapper = shallow.wrapper;
        assert.strictEqual(wrapper.find(Popover).prop("interactionKind"), popoverProps.interactionKind);
        assert.notStrictEqual(
            wrapper.find(Popover).prop("popoverClassName")!.indexOf(popoverProps.popoverClassName),
            0,
        );
        assert.notStrictEqual(wrapper.find(Popover).prop("content"), popoverProps.content);
    });

    it("multiline prop determines if long content is ellipsized", () => {
        using mount = mountTest(
            <MenuItem multiline={false} text="multiline prop determines if long content is ellipsized." />,
        );
        function assertOverflow(expected: boolean) {
            assert.strictEqual(findText(mount.wrapper).hasClass(Classes.TEXT_OVERFLOW_ELLIPSIS), expected);
        }

        assertOverflow(true);
        mount.wrapper.setProps({ multiline: true });
        assertOverflow(false);
    });

    it(`label and labelElement are rendered in .${Classes.MENU_ITEM_LABEL}`, () => {
        using shallow = shallowTest(
            <MenuItem text="text" label="label text" labelElement={<article>label element</article>} />,
        );
        const label = shallow.wrapper.find(`.${Classes.MENU_ITEM_LABEL}`);
        assert.match(label.text(), /^label text/);
        assert.strictEqual(label.find("article").text(), "label element");
    });
});

function findSubmenu(wrapper: ShallowWrapper<any, any>) {
    return wrapper.find(Popover).prop("content") as React.ReactElement<
        MenuProps & { children: Array<React.ReactElement<MenuItemProps>> }
    >;
}

function findText(wrapper: ShallowWrapper | ReactWrapper) {
    return wrapper.find(Text).children();
}
