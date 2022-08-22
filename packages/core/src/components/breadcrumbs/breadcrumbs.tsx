/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

/* eslint-disable deprecation/deprecation */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent2, Boundary, Classes, Position, Props, removeNonHTMLProps } from "../../common";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";
import { OverflowList, OverflowListProps } from "../overflow-list/overflowList";
import { IPopoverProps, Popover } from "../popover/popover";
import { Breadcrumb, BreadcrumbProps } from "./breadcrumb";

export type BreadcrumbsProps = IBreadcrumbsProps;
/** @deprecated use BreadcrumbsProps */
export interface IBreadcrumbsProps extends Props {
    /**
     * Callback invoked to render visible breadcrumbs. Best practice is to
     * render a `<Breadcrumb>` element. If `currentBreadcrumbRenderer` is also
     * supplied, that callback will be used for the current breadcrumb instead.
     *
     * @default Breadcrumb
     */
    breadcrumbRenderer?: (props: BreadcrumbProps) => JSX.Element;

    /**
     * Which direction the breadcrumbs should collapse from: start or end.
     *
     * @default Boundary.START
     */
    collapseFrom?: Boundary;

    /**
     * Callback invoked to render the current breadcrumb, which is the last
     * element in the `items` array.
     *
     * If this prop is omitted, `breadcrumbRenderer` will be invoked for the
     * current breadcrumb instead.
     */
    currentBreadcrumbRenderer?: (props: BreadcrumbProps) => JSX.Element;

    /**
     * All breadcrumbs to display. Breadcrumbs that do not fit in the container
     * will be rendered in an overflow menu instead.
     */
    items: readonly BreadcrumbProps[];

    /**
     * The minimum number of visible breadcrumbs that should never collapse into
     * the overflow menu, regardless of DOM dimensions.
     *
     * @default 0
     */
    minVisibleItems?: number;

    /**
     * Props to spread to `OverflowList`. Note that `items`,
     * `overflowRenderer`, and `visibleItemRenderer` cannot be changed.
     */
    overflowListProps?: Partial<OverflowListProps<BreadcrumbProps>>;

    /**
     * Props to spread to the `Popover` showing the overflow menu.
     */
    popoverProps?: IPopoverProps;
}

/** @deprecated use { Breadcrumbs2 } from "@blueprintjs/popover2" */
export class Breadcrumbs extends AbstractPureComponent2<BreadcrumbsProps> {
    public static defaultProps: Partial<BreadcrumbsProps> = {
        collapseFrom: Boundary.START,
    };

    public render() {
        const { className, collapseFrom, items, minVisibleItems, overflowListProps = {} } = this.props;
        return (
            <OverflowList
                collapseFrom={collapseFrom}
                minVisibleItems={minVisibleItems}
                tagName="ul"
                {...overflowListProps}
                className={classNames(Classes.BREADCRUMBS, overflowListProps.className, className)}
                items={items}
                overflowRenderer={this.renderOverflow}
                visibleItemRenderer={this.renderBreadcrumbWrapper}
            />
        );
    }

    private renderOverflow = (items: readonly BreadcrumbProps[]) => {
        const { collapseFrom } = this.props;
        const position = collapseFrom === Boundary.END ? Position.BOTTOM_RIGHT : Position.BOTTOM_LEFT;
        let orderedItems = items;
        if (collapseFrom === Boundary.START) {
            // If we're collapsing from the start, the menu should be read from the bottom to the
            // top, continuing with the breadcrumbs to the right. Since this means the first
            // breadcrumb in the props must be the last in the menu, we need to reverse the overlow
            // order.
            orderedItems = items.slice().reverse();
        }

        return (
            <li>
                <Popover
                    position={position}
                    disabled={orderedItems.length === 0}
                    content={<Menu>{orderedItems.map(this.renderOverflowBreadcrumb)}</Menu>}
                    {...this.props.popoverProps}
                >
                    <span className={Classes.BREADCRUMBS_COLLAPSED} />
                </Popover>
            </li>
        );
    };

    private renderOverflowBreadcrumb = (props: BreadcrumbProps, index: number) => {
        const isClickable = props.href != null || props.onClick != null;
        const htmlProps = removeNonHTMLProps(props);
        return <MenuItem disabled={!isClickable} {...htmlProps} text={props.text} key={index} />;
    };

    private renderBreadcrumbWrapper = (props: BreadcrumbProps, index: number) => {
        const isCurrent = this.props.items[this.props.items.length - 1] === props;
        return <li key={index}>{this.renderBreadcrumb(props, isCurrent)}</li>;
    };

    private renderBreadcrumb(props: BreadcrumbProps, isCurrent: boolean) {
        if (isCurrent && this.props.currentBreadcrumbRenderer != null) {
            return this.props.currentBreadcrumbRenderer(props);
        } else if (this.props.breadcrumbRenderer != null) {
            return this.props.breadcrumbRenderer(props);
        } else {
            // allow user to override 'current' prop
            return <Breadcrumb current={isCurrent} {...props} />;
        }
    }
}
