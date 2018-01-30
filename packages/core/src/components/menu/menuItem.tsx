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

export interface IMenuItemProps extends IActionProps, ILinkProps {
    // override from IActionProps to make it required
    /** Item text, required for usability. */
    text: string;

    /**
     * Right-aligned label content, useful for displaying hotkeys.
     */
    label?: string | JSX.Element;

    /** Props to spread to `Popover`. The following props cannot be changed: `content`, `minimal`, `modifiers`. */
    popoverProps?: Partial<IPopoverProps>;

    /**
     * Whether an enabled, non-submenu item should automatically close the
     * popover it is nested within when clicked.
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

    private liElement: HTMLElement;
    private popoverElement: HTMLElement;
    private refHandlers = {
        li: (ref: HTMLElement) => (this.liElement = ref),
        popover: (ref: HTMLElement) => (this.popoverElement = ref),
    };

    public render() {
        const { children, disabled, label, submenu } = this.props;
        const hasSubmenu = children != null || submenu != null;
        const liClasses = classNames({
            [Classes.MENU_SUBMENU]: hasSubmenu,
        });
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

        let labelElement: JSX.Element;
        if (label != null) {
            labelElement = <span className="pt-menu-item-label">{label}</span>;
        }

        const content = (
            <a
                className={anchorClasses}
                href={disabled ? undefined : this.props.href}
                onClick={disabled ? undefined : this.props.onClick}
                tabIndex={disabled ? undefined : 0}
                target={this.props.target}
            >
                {labelElement}
                {this.props.text}
            </a>
        );

        return (
            <li className={liClasses} ref={this.refHandlers.li}>
                {hasSubmenu ? this.renderPopover(content) : content}
            </li>
        );
    }

    protected validateProps(props: IMenuItemProps & { children?: React.ReactNode }) {
        if (props.children != null && props.submenu != null) {
            console.warn(Errors.MENU_WARN_CHILDREN_SUBMENU_MUTEX);
        }
    }

    private renderPopover(content: JSX.Element) {
        const { disabled, popoverProps } = this.props;
        const popoverClasses = classNames(Classes.MENU_SUBMENU, popoverProps.popoverClassName);

        // NOTE: use .pt-menu directly because using Menu would start a new context tree and
        // we'd have to pass through the submenu props. this is just simpler.
        const submenuContent = <ul className={Classes.MENU}>{this.renderChildren()}</ul>;

        return (
            <Popover
                disabled={disabled}
                enforceFocus={false}
                hoverCloseDelay={0}
                interactionKind={PopoverInteractionKind.HOVER}
                position={Position.RIGHT_TOP}
                {...popoverProps}
                content={submenuContent}
                minimal={true}
                popoverClassName={popoverClasses}
                popoverRef={this.refHandlers.popover}
            >
                {content}
            </Popover>
        );
    }

    private renderChildren(): React.ReactNode {
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
