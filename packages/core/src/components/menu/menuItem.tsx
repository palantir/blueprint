/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AbstractComponent } from "../../common/abstractComponent";
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

    /** Props to spread to `Popover`. Note that `content` cannot be changed. */
    popoverProps?: Partial<IPopoverProps> & object;

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

    /**
     * Width of `margin` from left or right edge of viewport. Submenus will
     * flip to the other side if they come within this distance of that edge.
     * This has no effect if omitted or if `useSmartPositioning` is set to `false`.
     * Note that these values are not CSS properties; they are used in
     * internal math to determine when to flip sides.
     */
    submenuViewportMargin?: { left?: number; right?: number };

    /**
     * Whether a submenu popover will try to reposition itself
     * if there isn't room for it in its current position.
     * The popover opens right by default, but will try to flip
     * left if not enough space.
     * @default true
     */
    useSmartPositioning?: boolean;
}

export interface IMenuItemState {
    /** Whether a submenu is opened to the left */
    alignLeft?: boolean;
}

const REACT_CONTEXT_TYPES: React.ValidationMap<IMenuItemState> = {
    alignLeft: (obj: IMenuItemState, key: keyof IMenuItemState) => {
        if (obj[key] != null && typeof obj[key] !== "boolean") {
            return new Error("[Blueprint] MenuItem context alignLeft must be boolean");
        }
        return undefined;
    },
};

export class MenuItem extends AbstractComponent<IMenuItemProps, IMenuItemState> {
    public static defaultProps: IMenuItemProps = {
        disabled: false,
        popoverProps: {},
        shouldDismissPopover: true,
        submenuViewportMargin: {},
        text: "",
        useSmartPositioning: true,
    };
    public static displayName = "Blueprint.MenuItem";

    public static contextTypes = REACT_CONTEXT_TYPES;
    public static childContextTypes = REACT_CONTEXT_TYPES;
    public context: IMenuItemState;

    public state: IMenuItemState = {
        alignLeft: false,
    };

    private liElement: HTMLElement;

    public render() {
        const { children, disabled, label, submenu, popoverProps } = this.props;
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

        let content = (
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

        if (hasSubmenu) {
            const measureSubmenu = this.props.useSmartPositioning ? this.measureSubmenu : null;
            const submenuElement = <Menu ref={measureSubmenu}>{this.renderChildren()}</Menu>;
            const popoverClasses = classNames(
                Classes.MINIMAL,
                Classes.MENU_SUBMENU,
                popoverProps.popoverClassName,
                { [Classes.ALIGN_LEFT]: this.state.alignLeft },
            );

            content = (
                <Popover
                    isDisabled={disabled}
                    enforceFocus={false}
                    hoverCloseDelay={0}
                    inline={true}
                    interactionKind={PopoverInteractionKind.HOVER}
                    position={this.state.alignLeft ? Position.LEFT_TOP : Position.RIGHT_TOP}
                    useSmartArrowPositioning={false}
                    {...popoverProps}
                    content={submenuElement}
                    popoverClassName={popoverClasses}
                >
                    {content}
                </Popover>
            );
        }

        return (
            <li className={liClasses} ref={this.liRefHandler}>
                {content}
            </li>
        );
    }

    public getChildContext() {
        return { alignLeft: this.state.alignLeft };
    }

    protected validateProps(props: IMenuItemProps & { children?: React.ReactNode }) {
        if (props.children != null && props.submenu != null) {
            console.warn(Errors.MENU_WARN_CHILDREN_SUBMENU_MUTEX);
        }
    }

    private liRefHandler = (r: HTMLElement) => (this.liElement = r);

    private measureSubmenu = (el: Menu) => {
        if (el != null) {
            const submenuRect = ReactDOM.findDOMNode(el).getBoundingClientRect();
            const parentWidth = this.liElement.parentElement.getBoundingClientRect().width;
            const adjustmentWidth = submenuRect.width + parentWidth;

            // this ensures that the left and right measurements represent a submenu opened to the right
            let submenuLeft = submenuRect.left;
            let submenuRight = submenuRect.right;
            if (this.state.alignLeft) {
                submenuLeft += adjustmentWidth;
                submenuRight += adjustmentWidth;
            }

            const { left = 0 } = this.props.submenuViewportMargin;
            let { right = 0 } = this.props.submenuViewportMargin;
            if (
                typeof document !== "undefined" &&
                typeof document.documentElement !== "undefined" &&
                Number(document.documentElement.clientWidth)
            ) {
                // we're in a browser context and the clientWidth is available,
                // use it to set calculate 'right'
                right = document.documentElement.clientWidth - right;
            }
            // uses context to prioritize the previous positioning
            let alignLeft = this.context.alignLeft || false;
            if (alignLeft) {
                if (submenuLeft - adjustmentWidth <= left) {
                    alignLeft = false;
                }
            } else {
                if (submenuRight >= right) {
                    alignLeft = true;
                }
            }
            this.setState({ alignLeft });
        }
    };

    private renderChildren = () => {
        const { children, submenu } = this.props;

        if (children != null) {
            const childProps = this.cascadeProps();
            if (Object.keys(childProps).length === 0) {
                return children;
            } else {
                return React.Children.map(children, (child: JSX.Element) => {
                    return React.cloneElement(child, childProps);
                });
            }
        } else if (submenu != null) {
            return submenu.map(this.cascadeProps).map(renderMenuItem);
        } else {
            return undefined;
        }
    };

    /**
     * Evalutes this.props and cascades prop values into new props when:
     * - submenuViewportMargin is defined, but is undefined for the supplied input.
     * - useSmartPositioning is false, but is undefined for the supplied input.
     * @param {IMenuItemProps} newProps If supplied, object will be modified, otherwise, defaults to an empty object.
     * @returns An object to be used as child props.
     */
    private cascadeProps = (newProps: IMenuItemProps = {} as IMenuItemProps) => {
        const { submenuViewportMargin, useSmartPositioning } = this.props;

        if (submenuViewportMargin != null && newProps.submenuViewportMargin == null) {
            newProps.submenuViewportMargin = submenuViewportMargin;
        }
        if (useSmartPositioning === false && newProps.useSmartPositioning == null) {
            newProps.useSmartPositioning = useSmartPositioning;
        }

        return newProps;
    };
}

export function renderMenuItem(props: IMenuItemProps, key: string | number) {
    return <MenuItem key={key} {...props} />;
}

export const MenuItemFactory = React.createFactory(MenuItem);
