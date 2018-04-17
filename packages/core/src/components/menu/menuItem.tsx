/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Modifiers } from "popper.js";
import * as Classes from "../../common/classes";
import { Position } from "../../common/position";
import { IActionProps, ILinkProps } from "../../common/props";
import { Icon } from "../icon/icon";
import { IPopoverProps, Popover, PopoverInteractionKind } from "../popover/popover";
import { Text } from "../text/text";
import { Menu } from "./menu";

export interface IMenuItemProps extends IActionProps, ILinkProps {
    // override from IActionProps to make it required
    /** Item text, required for usability. */
    text: React.ReactNode;

    /** Whether this menu item should appear with an active state. */
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
     * Right-aligned label content, useful for displaying hotkeys.
     */
    labelElement?: React.ReactNode;

    /**
     * Whether the text should be allowed to wrap to multiple lines.
     * If `false`, text will be truncated with an ellipsis when it reaches `max-width`.
     * @default false
     */
    multiline?: boolean;

    /** Props to spread to `Popover`. Note that `content` and `minimal` cannot be changed. */
    popoverProps?: Partial<IPopoverProps>;

    /**
     * Whether an enabled item without a submenu should automatically close its parent popover when clicked.
     * @default true
     */
    shouldDismissPopover?: boolean;
}

export class MenuItem extends React.PureComponent<IMenuItemProps & React.AnchorHTMLAttributes<HTMLAnchorElement>> {
    public static defaultProps: IMenuItemProps = {
        disabled: false,
        multiline: false,
        popoverProps: {},
        shouldDismissPopover: true,
        text: "",
    };
    public static displayName = "Blueprint2.MenuItem";

    public render() {
        const {
            active,
            className,
            children,
            disabled,
            icon,
            intent,
            labelElement,
            multiline,
            popoverProps,
            shouldDismissPopover,
            text,
            ...htmlProps
        } = this.props;
        const hasSubmenu = children != null;

        const intentClass = Classes.intentClass(intent);
        const anchorClasses = classNames(
            Classes.MENU_ITEM,
            intentClass,
            {
                [Classes.ACTIVE]: active,
                [Classes.INTENT_PRIMARY]: active && intentClass == null,
                [Classes.DISABLED]: disabled,
                // prevent popover from closing when clicking on submenu trigger or disabled item
                [Classes.POPOVER_DISMISS]: shouldDismissPopover && !disabled && !hasSubmenu,
            },
            className,
        );

        const target = (
            <a {...htmlProps} {...(disabled ? DISABLED_PROPS : {})} className={anchorClasses}>
                <Icon icon={icon} />
                <Text className={Classes.FILL} ellipsize={!multiline}>
                    {text}
                </Text>
                {this.maybeRenderLabel(labelElement)}
                {hasSubmenu && <Icon icon="caret-right" />}
            </a>
        );

        const liClasses = classNames({ [Classes.MENU_SUBMENU]: hasSubmenu });
        return <li className={liClasses}>{this.maybeRenderPopover(target, children)}</li>;
    }

    private maybeRenderLabel(labelElement?: React.ReactNode) {
        const { label } = this.props;
        if (label == null && labelElement == null) {
            return null;
        }
        return (
            <span className={Classes.MENU_ITEM_LABEL}>
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
            <Popover
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
                popoverClassName={classNames(Classes.MENU_SUBMENU, popoverProps.popoverClassName)}
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
