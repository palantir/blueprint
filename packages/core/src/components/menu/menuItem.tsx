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

import classNames from "classnames";
import * as React from "react";

import { CaretRight, SmallTick } from "@blueprintjs/icons";

import { Classes } from "../../common";
import { type ActionProps, DISPLAYNAME_PREFIX, removeNonHTMLProps } from "../../common/props";
import { clickElementOnKeyPress } from "../../common/utils";
import { Icon } from "../icon/icon";
import { Popover, type PopoverProps } from "../popover/popover";
import { Text } from "../text/text";
import { Menu, type MenuProps } from "./menu";

/**
 * Note that the HTML attributes supported by this component are spread to the nested `<a>` element, while the
 * `ref` is attached to the root `<li>` element. This is an unfortunate quirk in the API which we keep around
 * for backwards-compatibility.
 */
export interface MenuItemProps
    extends ActionProps<HTMLAnchorElement>,
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        React.RefAttributes<HTMLLIElement> {
    /** Item text, required for usability. */
    text: React.ReactNode;

    /**
     * Whether this item should appear _active_, often useful to
     * indicate keyboard focus. Note that this is distinct from _selected_
     * appearance, which has its own prop.
     */
    active?: boolean;

    /**
     * Children of this component will be rendered in a _submenu_
     * that appears in a popover when hovering or clicking on this item.
     *
     * Use `text` prop for the content of the menu item itself.
     */
    children?: React.ReactNode;

    /**
     * Whether this menu item is non-interactive. Enabling this prop will ignore `href`, `tabIndex`,
     * and mouse event handlers (in particular click, down, enter, leave).
     */
    disabled?: boolean;

    /**
     * Right-aligned label text content, useful for displaying hotkeys.
     *
     * This prop actually supports JSX elements, but TypeScript will throw an error because
     * `HTMLAttributes` only allows strings. Use `labelElement` to supply a JSX element in TypeScript.
     */
    label?: string;

    /**
     * A space-delimited list of class names to pass along to the right-aligned label wrapper element.
     */
    labelClassName?: string;

    /**
     * Right-aligned label content, useful for displaying hotkeys.
     */
    labelElement?: React.ReactNode;

    /**
     * Changes the ARIA `role` property structure of this MenuItem to accomodate for various
     * different `role`s of the parent Menu `ul` element.
     *
     * If `menuitem`, role structure becomes:
     *
     * `<li role="none"><a role="menuitem" /></li>`
     *
     * which is proper role structure for a `<ul role="menu"` parent (this is the default `role` of a `Menu`).
     *
     * If `listoption`, role structure becomes:
     *
     * `<li role="option"><a role={undefined} /></li>`
     *
     * which is proper role structure for a `<ul role="listbox"` parent, or a `<select>` parent.
     *
     * If `listitem`, role structure becomes:
     *
     * `<li role={undefined}><a role={undefined} /></li>`
     *
     * which can be used if this item is within a basic `<ul/>` (or `role="list"`) parent.
     *
     * If `none`, role structure becomes:
     *
     * `<li role="none"><a role={undefined} /></li>`
     *
     * which can be used if wrapping this item in a custom `<li>` parent.
     *
     * @default "menuitem"
     */
    roleStructure?: "menuitem" | "listoption" | "listitem" | "none";

    /**
     * Whether the text should be allowed to wrap to multiple lines.
     * If `false`, text will be truncated with an ellipsis when it reaches `max-width`.
     *
     * @default false
     */
    multiline?: boolean;

    /**
     * Props to spread to the submenu popover. Note that `content` and `minimal` cannot be
     * changed and `usePortal` defaults to `false` so all submenus will live in
     * the same container.
     */
    popoverProps?: Partial<Omit<PopoverProps, "content" | "minimal">>;

    /**
     * Whether this item should appear selected.
     * Defining this  will set the `aria-selected` attribute and apply a
     * "check" or "blank" icon on the item (unless the `icon` prop is set,
     * which always takes precedence).
     *
     * @default undefined
     */
    selected?: boolean;

    /**
     * Whether an enabled item without a submenu should automatically close its parent popover when clicked.
     *
     * @default true
     */
    shouldDismissPopover?: boolean;

    /**
     * Props to spread to the child `Menu` component if this item has a submenu.
     */
    submenuProps?: Partial<MenuProps>;

    /**
     * Name of the HTML tag that wraps the MenuItem.
     *
     * @default "a"
     */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * A space-delimited list of class names to pass along to the text wrapper element.
     */
    textClassName?: string;

    /**
     * HTML title to be passed to the <Text> component
     */
    htmlTitle?: string;
}

/**
 * Menu item component.
 *
 * @see https://blueprintjs.com/docs/#core/components/menu.menu-item
 */
export const MenuItem: React.FC<MenuItemProps> = React.forwardRef<HTMLLIElement, MenuItemProps>((props, ref) => {
    const {
        active,
        className,
        children,
        disabled,
        icon,
        intent,
        labelClassName,
        labelElement,
        multiline,
        popoverProps,
        roleStructure = "menuitem",
        selected,
        shouldDismissPopover,
        submenuProps,
        text,
        textClassName,
        tagName = "a",
        htmlTitle,
        ...htmlProps
    } = props;

    const [liRole, targetRole, ariaSelected] =
        roleStructure === "listoption" // "listoption": parent has listbox role, or is a <select>
            ? [
                  "option",
                  undefined, // target should have no role
                  Boolean(selected), // aria-selected prop
              ]
            : roleStructure === "menuitem" // "menuitem": parent has menu role
            ? [
                  "none",
                  "menuitem",
                  undefined, // don't set aria-selected prop
              ]
            : roleStructure === "none" // "none": allows wrapping MenuItem in custom <li>
            ? [
                  "none",
                  undefined, // target should have no role
                  undefined, // don't set aria-selected prop
              ]
            : // roleStructure === "listitem"
              [
                  undefined, // needs no role prop, li is listitem by default
                  undefined,
                  undefined, // don't set aria-selected prop
              ];

    const isSelectable = roleStructure === "listoption";
    const isSelected = isSelectable && selected;
    const hasIcon = icon != null;
    const hasSubmenu = children != null;

    const intentClass = Classes.intentClass(intent);
    const anchorClasses = classNames(
        Classes.MENU_ITEM,
        intentClass,
        {
            [Classes.ACTIVE]: active,
            [Classes.DISABLED]: disabled,
            // prevent popover from closing when clicking on submenu trigger or disabled item
            [Classes.POPOVER_DISMISS]: shouldDismissPopover && !disabled && !hasSubmenu,
            [Classes.MENU_ITEM_IS_SELECTABLE]: isSelectable,
            [Classes.SELECTED]: isSelected,
        },
        className,
    );

    const maybeLabel =
        props.label == null && labelElement == null ? null : (
            <span className={classNames(Classes.MENU_ITEM_LABEL, labelClassName)}>
                {props.label}
                {labelElement}
            </span>
        );

    const target = React.createElement(
        tagName,
        {
            // for menuitems, onClick when enter key pressed doesn't take effect like it does for a button-- fix this
            onKeyDown: clickElementOnKeyPress(["Enter", " "]),
            // if hasSubmenu, must apply correct role and tabIndex to the outer popover target <span> instead of this target element
            role: hasSubmenu ? "none" : targetRole,
            tabIndex: hasSubmenu ? -1 : 0,
            ...removeNonHTMLProps(htmlProps),
            ...(disabled ? DISABLED_PROPS : {}),
            className: anchorClasses,
        },
        isSelected ? <SmallTick className={Classes.MENU_ITEM_SELECTED_ICON} /> : undefined,
        hasIcon ? (
            // wrap icon in a <span> in case `icon` is a custom element rather than a built-in icon identifier,
            // so that we always render this class
            <span className={Classes.MENU_ITEM_ICON}>
                <Icon icon={icon} aria-hidden={true} tabIndex={-1} />
            </span>
        ) : undefined,
        <Text className={classNames(Classes.FILL, textClassName)} ellipsize={!multiline} title={htmlTitle}>
            {text}
        </Text>,
        maybeLabel,
        hasSubmenu ? <CaretRight className={Classes.MENU_SUBMENU_ICON} title="Open sub menu" /> : undefined,
    );

    const liClasses = classNames({ [Classes.MENU_SUBMENU]: hasSubmenu });
    return (
        <li className={liClasses} ref={ref} role={liRole} aria-selected={ariaSelected}>
            {children == null ? (
                target
            ) : (
                <Popover
                    autoFocus={false}
                    captureDismiss={false}
                    disabled={disabled}
                    enforceFocus={false}
                    hoverCloseDelay={0}
                    interactionKind="hover"
                    modifiers={SUBMENU_POPOVER_MODIFIERS}
                    targetProps={{ role: targetRole, tabIndex: 0 }}
                    placement="right-start"
                    usePortal={false}
                    {...popoverProps}
                    content={<Menu {...submenuProps}>{children}</Menu>}
                    minimal={true}
                    popoverClassName={classNames(Classes.MENU_SUBMENU, popoverProps?.popoverClassName)}
                >
                    {target}
                </Popover>
            )}
        </li>
    );
});
MenuItem.defaultProps = {
    active: false,
    disabled: false,
    multiline: false,
    popoverProps: {},
    selected: undefined,
    shouldDismissPopover: true,
    text: "",
};
MenuItem.displayName = `${DISPLAYNAME_PREFIX}.MenuItem`;

const SUBMENU_POPOVER_MODIFIERS: PopoverProps["modifiers"] = {
    // 20px padding - scrollbar width + a bit
    flip: { options: { rootBoundary: "viewport", padding: 20 }, enabled: true },
    // shift popover up 5px so MenuItems align
    offset: { options: { offset: [-5, 0] }, enabled: true },
    preventOverflow: { options: { rootBoundary: "viewport", padding: 20 }, enabled: true },
};

// props to ignore when disabled
const DISABLED_PROPS: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: undefined,
    onClick: undefined,
    onMouseDown: undefined,
    onMouseEnter: undefined,
    onMouseLeave: undefined,
    tabIndex: -1,
};
