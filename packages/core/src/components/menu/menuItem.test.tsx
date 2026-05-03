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

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { assert, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Popover } from "../popover/popover";
import { PopoverInteractionKind } from "../popover/popoverProps";

import { MenuItem } from "./menuItem";

describe("MenuItem", () => {
    it("basic rendering", () => {
        const { container } = render(<MenuItem icon="graph" text="Graph" />);
        expect(container.querySelector(`.${Classes.MENU_ITEM_ICON}`)).not.toBeNull();
        expect(container.textContent).toContain("Graph");
    });

    it("supports HTML props", () => {
        const mouseHandler = vi.fn();
        const keyHandler = vi.fn();
        const { container } = render(
            <MenuItem text="text" onClick={mouseHandler} onKeyDown={keyHandler} onMouseMove={mouseHandler} />,
        );
        const anchor = container.querySelector("a")!;
        fireEvent.click(anchor);
        fireEvent.keyDown(anchor, { key: "a" });
        fireEvent.mouseMove(anchor);
        expect(mouseHandler).toHaveBeenCalledTimes(2);
        expect(keyHandler).toHaveBeenCalledOnce();
    });

    it("children appear in submenu", () => {
        render(
            <MenuItem
                icon="style"
                text="Style"
                popoverProps={{ isOpen: true, transitionDuration: 0, usePortal: false }}
            >
                <MenuItem icon="bold" text="Bold" />
                <MenuItem icon="italic" text="Italic" />
                <MenuItem icon="underline" text="Underline" />
            </MenuItem>,
        );
        const items = document.querySelectorAll(`.${Classes.MENU_ITEM}`);
        // 1 root + 3 submenu items
        expect(items.length).toBeGreaterThanOrEqual(4);
    });

    it("default role prop structure is correct for a menuitem that is a an item of a ul with role=menu", () => {
        const { container } = render(<MenuItem text="Roles" />);
        assert.equal(container.querySelector("li")?.getAttribute("role"), "none");
        assert.equal(container.querySelector("a")?.getAttribute("role"), "menuitem");
    });

    it("can set roleStructure to change role prop structure to that of a listbox or select item", () => {
        const { container } = render(<MenuItem text="Roles" roleStructure="listoption" />);
        assert.equal(container.querySelector("li")?.getAttribute("role"), "option");
        assert.isNull(container.querySelector("a")?.getAttribute("role"));
    });

    it("can set roleStructure to change role prop structure to that of a list item", () => {
        const { container } = render(<MenuItem text="Roles" roleStructure="listitem" />);
        assert.isNull(container.querySelector("li")?.getAttribute("role"));
        assert.isNull(container.querySelector("a")?.getAttribute("role"));
    });

    it('can set roleStructure to change role prop structure to void li role (set role="none")', () => {
        const { container } = render(<MenuItem text="Roles" roleStructure="none" />);
        assert.equal(container.querySelector("li")?.getAttribute("role"), "none");
        assert.isNull(container.querySelector("a")?.getAttribute("role"));
    });

    it("disabled MenuItem will not show its submenu", () => {
        const { container } = render(
            <MenuItem disabled={true} icon="style" text="Style">
                <MenuItem icon="bold" text="Bold" />
            </MenuItem>,
        );
        // try opening — should not produce a portal popover
        fireEvent.mouseEnter(container.querySelector(`.${Classes.POPOVER_TARGET}`)!);
        expect(document.querySelector(`.${Classes.POPOVER}`)).toBeNull();
    });

    it("disabled MenuItem blocks mouse listeners", () => {
        const mouseSpy = vi.fn();
        const { container } = render(
            <MenuItem disabled={true} text="disabled" onClick={mouseSpy} onMouseEnter={mouseSpy} />,
        );
        const li = container.querySelector("li")!;
        fireEvent.click(li);
        fireEvent.mouseEnter(li);
        fireEvent.click(li);
        expect(mouseSpy).not.toHaveBeenCalled();
    });

    it("clicking MenuItem triggers onClick prop", () => {
        const onClick = vi.fn();
        const { container } = render(<MenuItem text="Graph" onClick={onClick} />);
        fireEvent.click(container.querySelector("a")!);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("pressing enter on MenuItem triggers onClick prop", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<MenuItem text="Graph" onClick={onClick} />);
        const menuItem = screen.getByRole("menuitem");
        menuItem.focus();
        await user.keyboard("{Enter}");
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("clicking disabled MenuItem does not trigger onClick prop", () => {
        const onClick = vi.fn();
        const { container } = render(<MenuItem disabled={true} text="Graph" onClick={onClick} />);
        fireEvent.click(container.querySelector("a")!);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("shouldDismissPopover=false prevents a clicked MenuItem from closing the Popover automatically", () => {
        const handleClose = vi.fn();
        const menu = <MenuItem text="Graph" shouldDismissPopover={false} />;
        const { container } = render(
            <Popover content={menu} isOpen={true} onInteraction={handleClose} usePortal={false}>
                <Button />
            </Popover>,
        );
        fireEvent.click(container.querySelector(`.${Classes.MENU_ITEM}`)!);
        expect(handleClose).not.toHaveBeenCalled();
    });

    it("submenuProps are forwarded to the Menu", () => {
        const submenuProps = { "aria-label": "test-menu" };
        render(
            <MenuItem
                icon="style"
                text="Style"
                submenuProps={submenuProps}
                popoverProps={{ isOpen: true, transitionDuration: 0, usePortal: false }}
            >
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        const submenu = document.querySelector(`.${Classes.MENU}[aria-label="test-menu"]`);
        expect(submenu).not.toBeNull();
    });

    it("popoverProps (except content) are forwarded to Popover", () => {
        const popoverProps = {
            content: "CUSTOM_CONTENT",
            interactionKind: PopoverInteractionKind.CLICK,
            popoverClassName: "CUSTOM_POPOVER_CLASS_NAME",
        };
        const { container } = render(
            <MenuItem icon="style" text="Style" popoverProps={popoverProps}>
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        fireEvent.click(container.querySelector(`.${Classes.POPOVER_TARGET}`)!);
        const popover = document.querySelector(`.${popoverProps.popoverClassName}`);
        expect(popover).not.toBeNull();
        // content prop should NOT be honored — submenu children win
        expect(popover?.textContent).not.toBe(popoverProps.content);
    });

    it("multiline prop determines if long content is ellipsized", () => {
        const { container, rerender } = render(
            <MenuItem multiline={false} text="multiline prop determines if long content is ellipsized." />,
        );
        function hasOverflow() {
            const text = container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`);
            return text != null;
        }
        assert.isTrue(hasOverflow());
        rerender(<MenuItem multiline={true} text="multiline prop determines if long content is ellipsized." />);
        assert.isFalse(hasOverflow());
    });

    it(`label and labelElement are rendered in .${Classes.MENU_ITEM_LABEL}`, () => {
        const { container } = render(
            <MenuItem text="text" label="label text" labelElement={<article>label element</article>} />,
        );
        const label = container.querySelector(`.${Classes.MENU_ITEM_LABEL}`)!;
        assert.match(label.textContent ?? "", /^label text/);
        assert.strictEqual(label.querySelector("article")?.textContent, "label element");
    });

    it("renders icon with aria-hidden attribute on wrapper span", () => {
        const { container } = render(<MenuItem icon="graph" text="Graph" />);
        const iconWrapper = container.querySelector(`.${Classes.MENU_ITEM_ICON}`);
        assert.strictEqual(iconWrapper?.getAttribute("aria-hidden"), "true");
    });

    it("renders custom icon element with aria-hidden attribute on wrapper span", () => {
        const customIcon = <span className="custom-icon">Custom</span>;
        const { container } = render(<MenuItem icon={customIcon} text="Custom" />);
        const iconWrapper = container.querySelector(`.${Classes.MENU_ITEM_ICON}`);
        assert.strictEqual(iconWrapper?.getAttribute("aria-hidden"), "true");
    });

    describe("tabIndex behavior", () => {
        it("MenuItem without submenu has tabIndex={0} when enabled", () => {
            const { container } = render(<MenuItem text="Item" />);
            const anchor = container.querySelector("a");
            assert.strictEqual(anchor?.getAttribute("tabindex"), "0");
        });

        it("MenuItem without submenu has tabIndex={-1} when disabled", () => {
            const { container } = render(<MenuItem text="Item" disabled={true} />);
            const anchor = container.querySelector("a");
            assert.strictEqual(anchor?.getAttribute("tabindex"), "-1");
        });

        it("MenuItem with submenu has focusable Popover target when enabled", () => {
            const { container } = render(
                <MenuItem text="Parent">
                    <MenuItem text="Child" />
                </MenuItem>,
            );
            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);
            assert.strictEqual(popoverTarget?.getAttribute("tabindex"), "0");
        });

        it("MenuItem with submenu has tabIndex={-1} on inner anchor element", () => {
            const { getByText } = render(
                <MenuItem text="Parent">
                    <MenuItem text="Child" />
                </MenuItem>,
            );
            const textElement = getByText("Parent");
            const anchor = textElement.closest("a");
            assert.strictEqual(anchor?.getAttribute("tabindex"), "-1");
        });

        it("MenuItem with disabled submenu is not focusable", () => {
            const { container, getByText } = render(
                <MenuItem text="Parent" disabled={true}>
                    <MenuItem text="Child" />
                </MenuItem>,
            );
            const parentElement = getByText("Parent");
            const parentAnchor = parentElement.closest("a");
            assert.strictEqual(parentAnchor?.getAttribute("tabindex"), "-1");

            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);
            assert.isNotNull(popoverTarget);
        });

        it("MenuItem without submenu preserves custom tabIndex", () => {
            const { container } = render(<MenuItem text="Item" tabIndex={3} />);
            const anchor = container.querySelector("a");
            assert.strictEqual(anchor?.getAttribute("tabindex"), "3");
        });
    });
});
