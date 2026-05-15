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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Popover } from "../popover/popover";

import { MenuItem } from "./menuItem";

describe("MenuItem", () => {
    it("basic rendering", () => {
        render(<MenuItem icon="graph" text="Graph" />);
        const menuItem = screen.getByRole("menuitem", { name: "Graph" });
        expect(menuItem.querySelector(`.${Classes.ICON}`)).toBeInTheDocument();
    });

    it("supports HTML props", async () => {
        const user = userEvent.setup();
        const onClickSpy = vi.fn();
        const onKeyDownSpy = vi.fn();
        render(<MenuItem text="text" onClick={onClickSpy} onKeyDown={onKeyDownSpy} />);
        const menuItem = screen.getByRole("menuitem", { name: "text" });

        await user.click(menuItem);
        expect(onClickSpy).toHaveBeenCalledOnce();
        expect(onKeyDownSpy).not.toHaveBeenCalled();

        await user.keyboard("{Enter}");
        expect(onKeyDownSpy).toHaveBeenCalledOnce();
    });

    it("children appear in submenu", () => {
        const { container } = render(
            <MenuItem icon="style" text="Style" popoverProps={{ isOpen: true }}>
                <MenuItem icon="bold" text="Bold" />
                <MenuItem icon="italic" text="Italic" />
                <MenuItem icon="underline" text="Underline" />
            </MenuItem>,
        );
        // parent + 3 children
        expect(container.querySelectorAll(`.${Classes.MENU_ITEM}`)).toHaveLength(4);
    });

    it("default role prop structure is correct for a menuitem that is an item of a ul with role=menu", () => {
        const { container } = render(<MenuItem text="Roles" />);
        const li = container.querySelector("li");
        expect(li).toHaveAttribute("role", "none");
        expect(screen.getByRole("menuitem")).toBeInTheDocument();
    });

    it("can set roleStructure to change role prop structure to that of a listbox or select item", () => {
        const { container } = render(<MenuItem text="Roles" roleStructure="listoption" />);
        const li = container.querySelector("li");
        expect(li).toHaveAttribute("role", "option");
        const anchor = container.querySelector("a");
        expect(anchor).not.toBeNull();
        expect(anchor!).not.toHaveAttribute("role");
    });

    it("can set roleStructure to change role prop structure to that of a list item", () => {
        const { container } = render(<MenuItem text="Roles" roleStructure="listitem" />);
        const li = container.querySelector("li");
        expect(li).not.toHaveAttribute("role");
        const anchor = container.querySelector("a");
        expect(anchor).not.toBeNull();
        expect(anchor!).not.toHaveAttribute("role");
    });

    it('can set roleStructure to change role prop structure to void li role (set role="none")', () => {
        const { container } = render(<MenuItem text="Roles" roleStructure="none" />);
        const li = container.querySelector("li");
        expect(li).toHaveAttribute("role", "none");
        const anchor = container.querySelector("a");
        expect(anchor).not.toBeNull();
        expect(anchor!).not.toHaveAttribute("role");
    });

    it("disabled MenuItem will not show its submenu", () => {
        const { container } = render(
            <MenuItem disabled={true} icon="style" text="Style">
                <MenuItem icon="bold" text="Bold" />
                <MenuItem icon="italic" text="Italic" />
                <MenuItem icon="underline" text="Underline" />
            </MenuItem>,
        );
        // When disabled, the Popover target's anchor should be aria-disabled
        const parentAnchor = container.querySelector(`.${Classes.MENU_ITEM}.${Classes.DISABLED}`);
        expect(parentAnchor).toBeInTheDocument();
    });

    it("disabled MenuItem blocks mouse listeners", async () => {
        const user = userEvent.setup();
        const mouseSpy = vi.fn();
        render(<MenuItem disabled={true} text="disabled" onClick={mouseSpy} onMouseEnter={mouseSpy} />);
        const anchor = screen.getByText("disabled").closest("a");
        expect(anchor).not.toBeNull();
        await user.click(anchor!);
        expect(mouseSpy).not.toHaveBeenCalled();
    });

    it("clicking MenuItem triggers onClick prop", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<MenuItem text="Graph" onClick={onClick} />);
        await user.click(screen.getByRole("menuitem"));
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

    it("clicking disabled MenuItem does not trigger onClick prop", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<MenuItem disabled={true} text="Graph" onClick={onClick} />);
        const anchor = screen.getByText("Graph").closest("a");
        expect(anchor).not.toBeNull();
        await user.click(anchor!);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("shouldDismissPopover=false prevents a clicked MenuItem from closing the Popover automatically", async () => {
        const user = userEvent.setup();
        const handleClose = vi.fn();
        const menu = <MenuItem text="Graph" shouldDismissPopover={false} />;
        render(
            <Popover content={menu} isOpen={true} onInteraction={handleClose} usePortal={false}>
                <Button />
            </Popover>,
        );
        await user.click(screen.getByRole("menuitem", { name: "Graph" }));
        expect(handleClose).not.toHaveBeenCalled();
    });

    it("submenuProps are forwarded to the Menu", () => {
        render(
            <MenuItem
                icon="style"
                text="Style"
                submenuProps={{ "aria-label": "test-menu" }}
                popoverProps={{ isOpen: true }}
            >
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        expect(screen.getByRole("menu", { name: "test-menu" })).toBeInTheDocument();
    });

    it("popoverProps (except content) are forwarded to Popover", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <MenuItem
                icon="style"
                text="Style"
                popoverProps={{
                    interactionKind: "click",
                    popoverClassName: "CUSTOM_POPOVER_CLASS_NAME",
                }}
            >
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        // Click to open (interactionKind is "click")
        await user.click(screen.getByText("Style"));
        // popoverClassName should be applied
        const popover = container.querySelector(".CUSTOM_POPOVER_CLASS_NAME");
        expect(popover).toBeInTheDocument();
        // content should NOT be overridden — the submenu should still render
        expect(screen.getByText("one")).toBeInTheDocument();
    });

    it("multiline prop determines if long content is ellipsized", () => {
        const { container, rerender } = render(
            <MenuItem multiline={false} text="multiline prop determines if long content is ellipsized." />,
        );
        expect(container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`)).toBeInTheDocument();
        rerender(<MenuItem multiline={true} text="multiline prop determines if long content is ellipsized." />);
        expect(container.querySelector(`.${Classes.TEXT_OVERFLOW_ELLIPSIS}`)).toBeNull();
    });

    it(`label and labelElement are rendered in .${Classes.MENU_ITEM_LABEL}`, () => {
        const { container } = render(
            <MenuItem text="text" label="label text" labelElement={<article>label element</article>} />,
        );
        const label = container.querySelector(`.${Classes.MENU_ITEM_LABEL}`);
        expect(label).not.toBeNull();
        expect(label!).toHaveTextContent(/^label text/);
        expect(screen.getByText("label element")).toBeInTheDocument();
    });

    it("renders icon with aria-hidden attribute on wrapper span", () => {
        const { container } = render(<MenuItem icon="graph" text="Graph" />);
        const iconWrapper = container.querySelector(`.${Classes.MENU_ITEM_ICON}`);
        expect(iconWrapper).not.toBeNull();
        expect(iconWrapper!).toHaveAttribute("aria-hidden", "true");
    });

    it("renders custom icon element with aria-hidden attribute on wrapper span", () => {
        const customIcon = <span className="custom-icon">Custom</span>;
        const { container } = render(<MenuItem icon={customIcon} text="Custom" />);
        const iconWrapper = container.querySelector(`.${Classes.MENU_ITEM_ICON}`);
        expect(iconWrapper).not.toBeNull();
        expect(iconWrapper!).toHaveAttribute("aria-hidden", "true");
    });

    describe("tabIndex behavior", () => {
        it("MenuItem without submenu has tabIndex={0} when enabled", () => {
            const { container } = render(<MenuItem text="Item" />);
            const anchor = container.querySelector("a");
            expect(anchor).toHaveAttribute("tabindex", "0");
        });

        it("MenuItem without submenu has tabIndex={-1} when disabled", () => {
            const { container } = render(<MenuItem text="Item" disabled={true} />);
            const anchor = container.querySelector("a");
            expect(anchor).toHaveAttribute("tabindex", "-1");
        });

        it("MenuItem with submenu has focusable Popover target when enabled", () => {
            const { container } = render(
                <MenuItem text="Parent">
                    <MenuItem text="Child" />
                </MenuItem>,
            );
            // The Popover target wrapper should be focusable
            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);
            expect(popoverTarget).toHaveAttribute("tabindex", "0");
        });

        it("MenuItem with submenu has tabIndex={-1} on inner anchor element", () => {
            render(
                <MenuItem text="Parent">
                    <MenuItem text="Child" />
                </MenuItem>,
            );
            // The inner anchor should NOT be focusable when there's a submenu
            const anchor = screen.getByText("Parent").closest("a");
            expect(anchor).toHaveAttribute("tabindex", "-1");
        });

        it("MenuItem with disabled submenu is not focusable", () => {
            const { container } = render(
                <MenuItem text="Parent" disabled={true}>
                    <MenuItem text="Child" />
                </MenuItem>,
            );
            const parentAnchor = screen.getByText("Parent").closest("a");
            expect(parentAnchor).toHaveAttribute("tabindex", "-1");

            // When disabled, the Popover target should still exist
            const popoverTarget = container.querySelector(`.${Classes.POPOVER_TARGET}`);
            expect(popoverTarget).not.toBeNull();
        });

        it("MenuItem without submenu preserves custom tabIndex", () => {
            const { container } = render(<MenuItem text="Item" tabIndex={3} />);
            const anchor = container.querySelector("a");
            expect(anchor).toHaveAttribute("tabindex", "3");
        });
    });
});
