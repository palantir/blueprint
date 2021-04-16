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
import * as React from "react";

import { Boundary } from "../../common/boundary";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { Position } from "../../common/position";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";
import { isElementOfType } from "../../common/utils";
import { Menu } from "../menu/menu";
import { MenuItemProps, MenuItem } from "../menu/menuItem";
import { IPopoverProps, Popover } from "../popover/popover";

type CollapsibleItem = React.ReactElement<MenuItemProps>;

// eslint-disable-next-line deprecation/deprecation
export type CollapsibleListProps = ICollapsibleListProps;
/** @deprecated use CollapsibleListProps */
export interface ICollapsibleListProps extends Props {
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
    visibleItemRenderer: (props: MenuItemProps, index: number) => JSX.Element;

    /**
     * Which direction the items should collapse from: start or end of the children.
     *
     * @default Boundary.START
     */
    collapseFrom?: Boundary;

    /**
     * CSS class names to add to `<li>` tags containing each visible item and the dropdown.
     */
    visibleItemClassName?: string;

    /**
     * Exact number of visible items.
     *
     * @default 3
     */
    visibleItemCount?: number;
}

/** @deprecated use `<OverflowList>` for automatic overflow based on available space. */
export class CollapsibleList extends React.Component<CollapsibleListProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.CollapsibleList`;

    public static defaultProps: Partial<CollapsibleListProps> = {
        collapseFrom: Boundary.START,
        visibleItemCount: 3,
    };

    public render() {
        const { collapseFrom } = this.props;
        const childrenLength = React.Children.count(this.props.children);
        const [visibleChildren, collapsedChildren] = this.partitionChildren();

        const visibleItems = visibleChildren.map((child: CollapsibleItem, index: number) => {
            const absoluteIndex = collapseFrom === Boundary.START ? childrenLength - 1 - index : index;
            return (
                <li className={this.props.visibleItemClassName} key={absoluteIndex}>
                    {this.props.visibleItemRenderer(child.props, absoluteIndex)}
                </li>
            );
        });
        if (collapseFrom === Boundary.START) {
            // reverse START list so separators appear before items
            visibleItems.reverse();
        }

        // construct dropdown menu for collapsed items
        let collapsedPopover: JSX.Element | undefined;
        if (collapsedChildren.length > 0) {
            const position = collapseFrom === Boundary.END ? Position.BOTTOM_RIGHT : Position.BOTTOM_LEFT;
            /* eslint-disable deprecation/deprecation */
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
            /* eslint-enable deprecation/deprecation */
        }

        return (
            <ul className={classNames(Classes.COLLAPSIBLE_LIST, this.props.className)}>
                {collapseFrom === Boundary.START ? collapsedPopover : null}
                {visibleItems}
                {collapseFrom === Boundary.END ? collapsedPopover : null}
            </ul>
        );
    }

    // splits the list of children into two arrays: visible and collapsed
    private partitionChildren(): [CollapsibleItem[], CollapsibleItem[]] {
        const childrenArray = React.Children.map(this.props.children, (child: React.ReactNode, index: number) => {
            if (!isElementOfType(child, MenuItem)) {
                throw new Error(Errors.COLLAPSIBLE_LIST_INVALID_CHILD);
            }
            return React.cloneElement(child as JSX.Element, { key: `visible-${index}` });
        });

        if (childrenArray == null) {
            return [[], []];
        }

        if (this.props.collapseFrom === Boundary.START) {
            // reverse START list so we can always slice visible items from the front of the list
            childrenArray.reverse();
        }
        const { visibleItemCount } = this.props;
        return [childrenArray.slice(0, visibleItemCount), childrenArray.slice(visibleItemCount)];
    }
}
