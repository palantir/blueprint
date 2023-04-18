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

import {
    AbstractPureComponent2,
    ActionProps,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    Icon,
    IElementRefProps,
    LinkProps,
    Menu,
    MenuProps,
    removeNonHTMLProps,
    Text,
    Utils,
} from "@blueprintjs/core";

import * as Classes from "./classes";
import { Popover2, Popover2Props } from "./popover2";

// eslint-disable-next-line deprecation/deprecation
export interface MenuItem2Props extends ActionProps, LinkProps, IElementRefProps<HTMLLIElement> {
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
     * `<li role="none"`
     *     `<a role="menuitem"`
     *
     * which is proper role structure for a `<ul role="menu"` parent (this is the default `role` of a `Menu`).
     *
     * If `listoption`, role structure becomes:
     *
     * `<li role="option"`
     *     `<a role=undefined`
     *
     * which is proper role structure for a `<ul role="listbox"` parent, or a `<select>` parent.
     *
     * If `listitem`, role structure becomes:
     *
     * `<li role=undefined`
     *     `<a role=undefined`
     *
     * which can be used if this item is within a basic `<ul/>` (or `role="list"`) parent.
     *
     * If `none`, role structure becomes:
     *
     * `<li role="none"`
     *     `<a role=undefined`
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
    popoverProps?: Partial<Omit<Popover2Props, "content" | "minimal">>;

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
 * Menu item (v2) component.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/menu-item2
 */
export class MenuItem2 extends AbstractPureComponent2<MenuItem2Props & React.AnchorHTMLAttributes<HTMLAnchorElement>> {
    public static defaultProps: MenuItem2Props = {
        active: false,
        disabled: false,
        multiline: false,
        popoverProps: {},
        selected: undefined,
        shouldDismissPopover: true,
        text: "",
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.MenuItem2`;

    public render() {
        const {
            active,
            className,
            children,
            disabled,
            elementRef,
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
        } = this.props;

        const [liRole, targetRole, icon, ariaSelected] =
            roleStructure === "listoption" // "listoption": parent has listbox role, or is a <select>
                ? [
                      "option",
                      undefined, // target should have no role
                      this.props.icon ?? (selected === undefined ? undefined : selected ? "small-tick" : "blank"),
                      Boolean(selected), // aria-selected prop
                  ]
                : roleStructure === "menuitem" // "menuitem": parent has menu role
                ? [
                      "none",
                      "menuitem",
                      this.props.icon,
                      undefined, // don't set aria-selected prop
                  ]
                : roleStructure === "none" // "none": allows wrapping MenuItem in custom <li>
                ? [
                      "none",
                      undefined, // target should have no role
                      this.props.icon,
                      undefined, // don't set aria-selected prop
                  ]
                : // roleStructure === "listitem"
                  [
                      undefined, // needs no role prop, li is listitem by default
                      undefined,
                      this.props.icon,
                      undefined, // don't set aria-selected prop
                  ];

        const hasIcon = icon != null;
        const hasSubmenu = children != null;

        const intentClass = CoreClasses.intentClass(intent);
        const anchorClasses = classNames(
            CoreClasses.MENU_ITEM,
            intentClass,
            {
                [CoreClasses.ACTIVE]: active,
                [CoreClasses.DISABLED]: disabled,
                // prevent popover from closing when clicking on submenu trigger or disabled item
                [Classes.POPOVER2_DISMISS]: shouldDismissPopover && !disabled && !hasSubmenu,
                [CoreClasses.SELECTED]: active && intentClass === undefined,
            },
            className,
        );

        const target = React.createElement(
            tagName,
            {
                // for menuitems, onClick when enter key pressed doesn't take effect like it does for a button-- fix this
                onKeyDown: Utils.clickElementOnKeyPress(["Enter", " "]),
                // if hasSubmenu, must apply correct role and tabIndex to the outer Popover2 target <span> instead of this target element
                role: hasSubmenu ? "none" : targetRole,
                tabIndex: hasSubmenu ? -1 : 0,
                ...removeNonHTMLProps(htmlProps),
                ...(disabled ? DISABLED_PROPS : {}),
                className: anchorClasses,
            },
            hasIcon ? (
                // wrap icon in a <span> in case `icon` is a custom element rather than a built-in icon identifier,
                // so that we always render this class
                <span className={CoreClasses.MENU_ITEM_ICON}>
                    <Icon icon={icon} aria-hidden={true} tabIndex={-1} />
                </span>
            ) : undefined,
            <Text className={classNames(CoreClasses.FILL, textClassName)} ellipsize={!multiline} title={htmlTitle}>
                {text}
            </Text>,
            this.maybeRenderLabel(labelElement),
            hasSubmenu ? <Icon className={CoreClasses.MENU_SUBMENU_ICON} icon="caret-right" /> : undefined,
        );

        const liClasses = classNames({ [CoreClasses.MENU_SUBMENU]: hasSubmenu });
        return (
            <li className={liClasses} ref={elementRef} role={liRole} aria-selected={ariaSelected}>
                {this.maybeRenderPopover(target, { role: targetRole, tabIndex: 0 }, children)}
            </li>
        );
    }

    private maybeRenderLabel(labelElement?: React.ReactNode) {
        const { label, labelClassName } = this.props;
        if (label == null && labelElement == null) {
            return null;
        }
        return (
            <span className={classNames(CoreClasses.MENU_ITEM_LABEL, labelClassName)}>
                {label}
                {labelElement}
            </span>
        );
    }

    private maybeRenderPopover(
        target: JSX.Element,
        popoverTargetProps: Popover2Props["targetProps"],
        children?: React.ReactNode,
    ) {
        if (children == null) {
            return target;
        }
        const { disabled, popoverProps, submenuProps } = this.props;
        return (
            <Popover2
                autoFocus={false}
                captureDismiss={false}
                disabled={disabled}
                enforceFocus={false}
                hoverCloseDelay={0}
                interactionKind="hover"
                modifiers={SUBMENU_POPOVER_MODIFIERS}
                targetProps={popoverTargetProps}
                placement="right-start"
                usePortal={false}
                {...popoverProps}
                content={<Menu {...submenuProps}>{children}</Menu>}
                minimal={true}
                popoverClassName={classNames(CoreClasses.MENU_SUBMENU, popoverProps?.popoverClassName)}
            >
                {target}
            </Popover2>
        );
    }
}

const SUBMENU_POPOVER_MODIFIERS: Popover2Props["modifiers"] = {
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
