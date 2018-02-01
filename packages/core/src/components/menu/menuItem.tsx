/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { Position } from "../../common/position";
import { IActionProps, ILinkProps } from "../../common/props";
import { IPopoverProps, Popover, PopoverInteractionKind } from "../popover/popover";
import { Menu } from "./menu";

export interface IMenuItemProps extends IActionProps, ILinkProps {
    // override from IActionProps to make it required
    /** Item text, required for usability. */
    text: string;

    /**
     * Right-aligned label content, useful for displaying hotkeys.
     */
    label?: string | JSX.Element;

    /** Props to spread to `Popover`. Note that `content` and `minimal` cannot be changed. */
    popoverProps?: Partial<IPopoverProps>;

    /**
     * Whether an enabled item without a submenu should automatically close its parent popover when clicked.
     * @default true
     */
    shouldDismissPopover?: boolean;

    /**
     * Array of props objects for submenu items.
     * An alternative to providing `MenuItem` components as `children`.
     */
    submenu?: IMenuItemProps[];
}

export class MenuItem extends AbstractPureComponent<IMenuItemProps> {
    public static defaultProps: IMenuItemProps = {
        disabled: false,
        popoverProps: {},
        shouldDismissPopover: true,
        text: "",
    };
    public static displayName = "Blueprint2.MenuItem";

    public render() {
        const { disabled, label } = this.props;
        const submenuChildren = this.renderSubmenuChildren();
        const hasSubmenu = submenuChildren != null;

        const liClasses = classNames({ [Classes.MENU_SUBMENU]: hasSubmenu });
        const anchorClasses = classNames(
            Classes.MENU_ITEM,
            Classes.intentClass(this.props.intent),
            {
                [Classes.DISABLED]: disabled,
                // prevent popover from closing when clicking on submenu trigger or disabled item
                [Classes.POPOVER_DISMISS]: this.props.shouldDismissPopover && !disabled && !hasSubmenu,
            },
            Classes.iconClass(this.props.iconName),
            this.props.className,
        );

        const target = (
            <a
                className={anchorClasses}
                href={disabled ? undefined : this.props.href}
                onClick={disabled ? undefined : this.props.onClick}
                tabIndex={disabled ? undefined : 0}
                target={this.props.target}
            >
                {label && <span className={Classes.MENU_ITEM_LABEL}>{label}</span>}
                {this.props.text}
            </a>
        );

        return <li className={liClasses}>{this.maybeRenderPopover(target, submenuChildren)}</li>;
    }

    protected validateProps(props: IMenuItemProps & { children?: React.ReactNode }) {
        if (props.children != null && props.submenu != null) {
            console.warn(Errors.MENU_WARN_CHILDREN_SUBMENU_MUTEX);
        }
    }

    private maybeRenderPopover(target: JSX.Element, children?: React.ReactNode) {
        const { disabled, popoverProps } = this.props;
        return children == null ? (
            target
        ) : (
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

    private renderSubmenuChildren(): React.ReactNode {
        const { children, submenu } = this.props;
        if (children != null) {
            return children;
        } else if (submenu != null) {
            return submenu.map(renderMenuItem);
        } else {
            return null;
        }
    }
}

export function renderMenuItem(props: IMenuItemProps, key: string | number) {
    return <MenuItem key={key} {...props} />;
}

const SUBMENU_POPOVER_MODIFIERS: Popper.Modifiers = {
    // 20px padding - scrollbar width + a bit
    flip: { boundariesElement: "viewport", padding: 20 },
    // shift popover up 5px so MenuItems align
    offset: { offset: -5 },
    preventOverflow: { boundariesElement: "viewport", padding: 20 },
};
