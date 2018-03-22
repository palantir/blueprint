/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { Position } from "../../common/position";
import { IProps } from "../../common/props";
import { isElementOfType } from "../../common/utils";
import { Menu } from "../menu/menu";
import { IMenuItemProps, MenuItem } from "../menu/menuItem";
import { IPopoverProps, Popover } from "../popover/popover";

type CollapsibleItem = React.ReactElement<IMenuItemProps>;

export enum CollapseFrom {
    START = "start",
    END = "end",
}

export interface ICollapsibleListProps extends IProps {
    /**
     * Element to render as dropdown target with `CLICK` interaction to show collapsed menu.
     */
    dropdownTarget: JSX.Element;

    /**
     * Props to pass to the dropdown.
     */
    dropdownProps?: IPopoverProps;

    /**
     * Callback invoked to render each visible item. The item will be wrapped in an `li` with
     * the optional `visibleItemClassName` prop.
     */
    visibleItemRenderer: (props: IMenuItemProps, index: number) => JSX.Element;

    /**
     * Which direction the items should collapse from: start or end of the children.
     * @default CollapseFrom.START
     */
    collapseFrom?: CollapseFrom;

    /**
     * CSS class names to add to `<li>` tags containing each visible item and the dropdown.
     */
    visibleItemClassName?: string;

    /**
     * Exact number of visible items.
     * @default 3
     */
    visibleItemCount?: number;
}

export class CollapsibleList extends React.Component<ICollapsibleListProps, {}> {
    public static displayName = "Blueprint2.CollapsibleList";

    public static defaultProps: ICollapsibleListProps = {
        collapseFrom: CollapseFrom.START,
        dropdownTarget: null,
        visibleItemCount: 3,
        visibleItemRenderer: null,
    };

    public render() {
        const { collapseFrom } = this.props;
        const childrenLength = React.Children.count(this.props.children);
        const [visibleChildren, collapsedChildren] = this.partitionChildren();

        const visibleItems = visibleChildren.map((child: CollapsibleItem, index: number) => {
            const absoluteIndex = collapseFrom === CollapseFrom.START ? childrenLength - 1 - index : index;
            return (
                <li className={this.props.visibleItemClassName} key={absoluteIndex}>
                    {this.props.visibleItemRenderer(child.props, absoluteIndex)}
                </li>
            );
        });
        if (collapseFrom === CollapseFrom.START) {
            // reverse START list so separators appear before items
            visibleItems.reverse();
        }

        // construct dropdown menu for collapsed items
        let collapsedPopover: JSX.Element;
        if (collapsedChildren.length > 0) {
            const position = collapseFrom === CollapseFrom.END ? Position.BOTTOM_RIGHT : Position.BOTTOM_LEFT;
            collapsedPopover = (
                <li className={this.props.visibleItemClassName}>
                    <Popover
                        content={<Menu>{collapsedChildren}</Menu>}
                        position={position}
                        {...this.props.dropdownProps}
                    >
                        {this.props.dropdownTarget}
                    </Popover>
                </li>
            );
        }

        return (
            <ul className={classNames(Classes.COLLAPSIBLE_LIST, this.props.className)}>
                {collapseFrom === CollapseFrom.START ? collapsedPopover : null}
                {visibleItems}
                {collapseFrom === CollapseFrom.END ? collapsedPopover : null}
            </ul>
        );
    }

    // splits the list of children into two arrays: visible and collapsed
    private partitionChildren(): [CollapsibleItem[], CollapsibleItem[]] {
        if (this.props.children == null) {
            return [[], []];
        }
        const childrenArray = React.Children.map(this.props.children, (child: JSX.Element, index: number) => {
            if (!isElementOfType(child, MenuItem)) {
                throw new Error(Errors.COLLAPSIBLE_LIST_INVALID_CHILD);
            }
            return React.cloneElement(child as JSX.Element, { key: `visible-${index}` });
        });
        if (this.props.collapseFrom === CollapseFrom.START) {
            // reverse START list so we can always slice visible items from the front of the list
            childrenArray.reverse();
        }
        const { visibleItemCount } = this.props;
        return [childrenArray.slice(0, visibleItemCount), childrenArray.slice(visibleItemCount)];
    }
}
