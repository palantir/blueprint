/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { Button, Classes, Icon, MenuProps, Text } from "@blueprintjs/core";

import { MenuItem2, MenuItem2Props, Popover2, Popover2InteractionKind } from "../src";

describe("MenuItem2", () => {
    it("basic rendering", () => {
        const wrapper = shallow(<MenuItem2 icon="graph" text="Graph" />);
        assert.isTrue(wrapper.find(Icon).exists());
        assert.strictEqual(findText(wrapper).text(), "Graph");
    });

    it("supports HTML props", () => {
        const func = () => false;
        const item = shallow(<MenuItem2 text="text" onClick={func} onKeyDown={func} onMouseMove={func} />).find("a");
        assert.strictEqual(item.prop("onClick"), func);
        assert.strictEqual(item.prop("onKeyDown"), func);
        assert.strictEqual(item.prop("onMouseMove"), func);
    });

    it("children appear in submenu", () => {
        const wrapper = shallow(
            <MenuItem2 icon="style" text="Style">
                <MenuItem2 icon="bold" text="Bold" />
                <MenuItem2 icon="italic" text="Italic" />
                <MenuItem2 icon="underline" text="Underline" />
            </MenuItem2>,
        );
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, 3);
    });

    it("default role prop structure is correct for a menuitem that is a an item of a ul with role=menu", () => {
        const wrapper = mount(<MenuItem2 text="Roles" />);
        assert.equal(wrapper.find("li").prop("role"), "none");
        assert.equal(wrapper.find("a").prop("role"), "menuitem");
    });

    it("can set roleStructure to change role prop structure to that of a listbox or select item", () => {
        const wrapper = mount(<MenuItem2 text="Roles" roleStructure="listoption" />);
        assert.equal(wrapper.find("li").prop("role"), "option");
        assert.equal(wrapper.find("a").prop("role"), undefined);
    });

    it("can set roleStructure to change role prop structure to have no roles", () => {
        const wrapper = mount(<MenuItem2 text="Roles" roleStructure="none" />);
        assert.equal(wrapper.find("li").prop("role"), undefined);
        assert.equal(wrapper.find("a").prop("role"), undefined);
    });

    it("disabled MenuItem2 will not show its submenu", () => {
        const wrapper = shallow(
            <MenuItem2 disabled={true} icon="style" text="Style">
                <MenuItem2 icon="bold" text="Bold" />
                <MenuItem2 icon="italic" text="Italic" />
                <MenuItem2 icon="underline" text="Underline" />
            </MenuItem2>,
        );
        assert.isTrue(wrapper.find(Popover2).prop("disabled"));
    });

    it("disabled MenuItem2 blocks mouse listeners", () => {
        const mouseSpy = spy();
        mount(<MenuItem2 disabled={true} text="disabled" onClick={mouseSpy} onMouseEnter={mouseSpy} />)
            .simulate("click")
            .simulate("mouseenter")
            .simulate("click");
        assert.strictEqual(mouseSpy.callCount, 0);
    });

    it("clicking MenuItem2 triggers onClick prop", () => {
        const onClick = spy();
        shallow(<MenuItem2 text="Graph" onClick={onClick} />)
            .find("a")
            .simulate("click");
        assert.isTrue(onClick.calledOnce);
    });

    it("clicking disabled MenuItem2 does not trigger onClick prop", () => {
        const onClick = spy();
        shallow(<MenuItem2 disabled={true} text="Graph" onClick={onClick} />)
            .find("a")
            .simulate("click");
        assert.isTrue(onClick.notCalled);
    });

    it("shouldDismissPopover=false prevents a clicked MenuItem2 from closing the Popover2 automatically", () => {
        const handleClose = spy();
        const menu = <MenuItem2 text="Graph" shouldDismissPopover={false} />;
        const wrapper = mount(
            <Popover2 content={menu} isOpen={true} onInteraction={handleClose} usePortal={false}>
                <Button />
            </Popover2>,
        );
        wrapper.find(MenuItem2).find("a").simulate("click");
        assert.isTrue(handleClose.notCalled);
    });

    it("submenuProps are forwarded to the Menu", () => {
        const submenuProps = { "aria-label": "test-menu" };
        const wrapper = shallow(
            <MenuItem2 icon="style" text="Style" submenuProps={submenuProps}>
                <MenuItem2 text="one" />
                <MenuItem2 text="two" />
            </MenuItem2>,
        );
        const submenu = findSubmenu(wrapper);
        assert.strictEqual(submenu.props["aria-label"], submenuProps["aria-label"]);
    });

    it("popoverProps (except content) are forwarded to Popover2", () => {
        // Ensures that popover props are passed to Popover2 component, except content property
        const popoverProps = {
            content: "CUSTOM_CONTENT",
            interactionKind: Popover2InteractionKind.CLICK,
            popoverClassName: "CUSTOM_POPOVER_CLASS_NAME",
        };
        const wrapper = shallow(
            <MenuItem2 icon="style" text="Style" popoverProps={popoverProps}>
                <MenuItem2 text="one" />
                <MenuItem2 text="two" />
            </MenuItem2>,
        );
        assert.strictEqual(wrapper.find(Popover2).prop("interactionKind"), popoverProps.interactionKind);
        assert.notStrictEqual(
            wrapper.find(Popover2).prop("popoverClassName")!.indexOf(popoverProps.popoverClassName),
            0,
        );
        assert.notStrictEqual(wrapper.find(Popover2).prop("content"), popoverProps.content);
    });

    it("multiline prop determines if long content is ellipsized", () => {
        const wrapper = mount(
            <MenuItem2 multiline={false} text="multiline prop determines if long content is ellipsized." />,
        );
        function assertOverflow(expected: boolean) {
            assert.strictEqual(findText(wrapper).hasClass(Classes.TEXT_OVERFLOW_ELLIPSIS), expected);
        }

        assertOverflow(true);
        wrapper.setProps({ multiline: true });
        assertOverflow(false);
    });

    it(`label and labelElement are rendered in .${Classes.MENU_ITEM_LABEL}`, () => {
        const wrapper = shallow(
            <MenuItem2 text="text" label="label text" labelElement={<article>label element</article>} />,
        );
        const label = wrapper.find(`.${Classes.MENU_ITEM_LABEL}`);
        assert.match(label.text(), /^label text/);
        assert.strictEqual(label.find("article").text(), "label element");
    });
});

function findSubmenu(wrapper: ShallowWrapper<any, any>) {
    return wrapper.find(Popover2).prop("content") as React.ReactElement<
        MenuProps & { children: Array<React.ReactElement<MenuItem2Props>> }
    >;
}

function findText(wrapper: ShallowWrapper | ReactWrapper) {
    return wrapper.find(Text).children();
}
