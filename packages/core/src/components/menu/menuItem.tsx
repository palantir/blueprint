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

import classNames from "classnames";
import { Modifiers } from "popper.js";
import * as React from "react";

import { AbstractPureComponent2, Classes, Position } from "../../common";
import { DISPLAYNAME_PREFIX, ActionProps, LinkProps } from "../../common/props";
import { Icon } from "../icon/icon";
import { IPopoverProps, Popover, PopoverInteractionKind } from "../popover/popover";
import { Text } from "../text/text";
import { Menu } from "./menu";

// eslint-disable-next-line deprecation/deprecation
export type MenuItemProps = IMenuItemProps;
/** @deprecated use MenuItemProps */
export interface IMenuItemProps extends ActionProps, LinkProps {
    /** Item text, required for usability. */
    text: React.ReactNode;

    /**
     * Whether this item should render with an active appearance.
     * This is the same styling as the `:active` CSS element state.
     *
     * Note: in Blueprint 3.x, this prop was conflated with a "selected" appearance
     * when `intent` was undefined. For legacy purposes, we emulate this behavior in
     * Blueprint 4.x, so setting `active={true} intent={undefined}` is the same as
     * `selected={true}`. This prop will be removed in a future major version.
     *
     * @deprecated use `selected` prop
     */
    active?: boolean;

    /**
     * Children of this component will be rendered in a __submenu__ that appears when hovering or
     * clicking on this menu item.
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
     * Whether the text should be allowed to wrap to multiple lines.
     * If `false`, text will be truncated with an ellipsis when it reaches `max-width`.
     *
     * @default false
     */
    multiline?: boolean;

    /**
     * Props to spread to `Popover`. Note that `content` and `minimal` cannot be
     * changed and `usePortal` defaults to `false` so all submenus will live in
     * the same container.
     */
    popoverProps?: Partial<IPopoverProps>;

    /**
     * Whether this item should appear selected.
     */
    selected?: boolean;

    /**
     * Whether an enabled item without a submenu should automatically close its parent popover when clicked.
     *
     * @default true
     */
    shouldDismissPopover?: boolean;

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

export class MenuItem extends AbstractPureComponent2<MenuItemProps & React.AnchorHTMLAttributes<HTMLAnchorElement>> {
    public static defaultProps: MenuItemProps = {
        active: false,
        disabled: false,
        multiline: false,
        popoverProps: {},
        selected: false,
        shouldDismissPopover: true,
        text: "",
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.MenuItem`;

    public render() {
        const {
            // eslint-disable-next-line deprecation/deprecation
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
            selected,
            shouldDismissPopover,
            text,
            textClassName,
            tagName = "a",
            htmlTitle,
            ...htmlProps
        } = this.props;

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
                [Classes.SELECTED]: selected || (active && intentClass === undefined),
            },
            className,
        );

        const target = React.createElement(
            tagName,
            {
                tabIndex: 0,
                ...htmlProps,
                ...(disabled ? DISABLED_PROPS : {}),
                className: anchorClasses,
            },
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
            this.maybeRenderLabel(labelElement),
            hasSubmenu ? (
                <Icon className={Classes.MENU_SUBMENU_ICON} title="Open sub menu" icon="caret-right" />
            ) : undefined,
        );

        const liClasses = classNames({ [Classes.MENU_SUBMENU]: hasSubmenu });
        return <li className={liClasses}>{this.maybeRenderPopover(target, children)}</li>;
    }

    private maybeRenderLabel(labelElement?: React.ReactNode) {
        const { label, labelClassName } = this.props;
        if (label == null && labelElement == null) {
            return null;
        }
        return (
            <span className={classNames(Classes.MENU_ITEM_LABEL, labelClassName)}>
                {label}
                {labelElement}
            </span>
        );
    }

    private maybeRenderPopover(target: JSX.Element, children?: React.ReactNode) {
        if (children == null) {
            return target;
        }
        const { disabled, popoverProps } = this.props;
        return (
            /* eslint-disable-next-line deprecation/deprecation */
            <Popover
                autoFocus={false}
                captureDismiss={false}
                disabled={disabled}
                enforceFocus={false}
                hoverCloseDelay={0}
                interactionKind={PopoverInteractionKind.HOVER}
                modifiers={SUBMENU_POPOVER_MODIFIERS}
                position={Position.RIGHT_TOP}
                usePortal={false}
                {...popoverProps}
                content={<Menu>{children}</Menu>}
                minimal={true}
                popoverClassName={classNames(Classes.MENU_SUBMENU, popoverProps?.popoverClassName)}
                target={target}
            />
        );
    }
}

const SUBMENU_POPOVER_MODIFIERS: Modifiers = {
    // 20px padding - scrollbar width + a bit
    flip: { boundariesElement: "viewport", padding: 20 },
    // shift popover up 5px so MenuItems align
    offset: { offset: -5 },
    preventOverflow: { boundariesElement: "viewport", padding: 20 },
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
