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
import { memo, useCallback } from "react";

import { Boundary, Classes, DISPLAYNAME_PREFIX, type Props, removeNonHTMLProps } from "../../common";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";
import { OverflowList, type OverflowListProps } from "../overflow-list/overflowList";
import type { PopoverProps } from "../popover/popoverProps";
import { PopoverNext } from "../popover-next/popoverNext";
import { popoverPropsToNextProps } from "../popover-next/popoverNextMigrationUtils";

import { Breadcrumb, type BreadcrumbProps } from "./breadcrumb";

const EMPTY_ITEMS: readonly BreadcrumbProps[] = [];

export interface BreadcrumbsProps extends Props {
    /**
     * Callback invoked to render visible breadcrumbs. Best practice is to
     * render a `<Breadcrumb>` element. If `currentBreadcrumbRenderer` is also
     * supplied, that callback will be used for the current breadcrumb instead.
     *
     * @default Breadcrumb
     */
    breadcrumbRenderer?: (props: BreadcrumbProps) => React.JSX.Element;

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
    currentBreadcrumbRenderer?: (props: BreadcrumbProps) => React.JSX.Element;

    /**
     * All breadcrumbs to display. Breadcrumbs that do not fit in the container
     * will be rendered in an overflow menu instead.
     *
     * @default []
     */
    items?: readonly BreadcrumbProps[];

    /**
     * The minimum number of visible breadcrumbs that should never collapse into
     * the overflow menu, regardless of DOM dimensions.
     *
     * @default 0
     */
    minVisibleItems?: number;

    /**
     * Props to spread to the `OverflowList` popover target.
     */
    overflowButtonProps?: React.HTMLProps<HTMLSpanElement>;

    /**
     * Props to spread to `OverflowList`. Note that `items`,
     * `overflowRenderer`, and `visibleItemRenderer` cannot be changed.
     */
    overflowListProps?: Partial<
        Omit<OverflowListProps<BreadcrumbProps>, "items" | "overflowRenderer" | "visibleItemRenderer">
    >;

    /**
     * Props to spread to the popover showing the overflow menu.
     */
    popoverProps?: Partial<
        Omit<PopoverProps, "content" | "defaultIsOpen" | "disabled" | "fill" | "renderTarget" | "targetTagName">
    >;
}

/**
 * Breadcrumbs component.
 *
 * @see https://blueprintjs.com/docs/#core/components/breadcrumbs
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = memo(props => {
    const {
        breadcrumbRenderer,
        className,
        collapseFrom = Boundary.START,
        currentBreadcrumbRenderer,
        items = EMPTY_ITEMS,
        minVisibleItems = 0,
        overflowButtonProps,
        overflowListProps = {},
        popoverProps,
    } = props;

    const renderBreadcrumb = useCallback(
        (breadcrumbProps: BreadcrumbProps, isCurrent: boolean) => {
            if (isCurrent && currentBreadcrumbRenderer != null) {
                return currentBreadcrumbRenderer(breadcrumbProps);
            } else if (breadcrumbRenderer != null) {
                return breadcrumbRenderer(breadcrumbProps);
            } else {
                // allow user to override 'current' prop
                return <Breadcrumb current={isCurrent} {...breadcrumbProps} />;
            }
        },
        [breadcrumbRenderer, currentBreadcrumbRenderer],
    );

    const renderBreadcrumbWrapper = useCallback(
        (breadcrumbProps: BreadcrumbProps, index: number) => {
            const isCurrent = items[items.length - 1] === breadcrumbProps;
            return <li key={index}>{renderBreadcrumb(breadcrumbProps, isCurrent)}</li>;
        },
        [items, renderBreadcrumb],
    );

    const renderOverflowBreadcrumb = useCallback((breadcrumbProps: BreadcrumbProps, index: number) => {
        const isClickable = breadcrumbProps.href != null || breadcrumbProps.onClick != null;
        const htmlProps = removeNonHTMLProps(breadcrumbProps);
        return <MenuItem disabled={!isClickable} {...htmlProps} text={breadcrumbProps.text} key={index} />;
    }, []);

    const renderOverflow = useCallback(
        (overflowItems: readonly BreadcrumbProps[]) => {
            let orderedItems = overflowItems;
            if (collapseFrom === Boundary.START) {
                // If we're collapsing from the start, the menu should be read from the bottom to the
                // top, continuing with the breadcrumbs to the right. Since this means the first
                // breadcrumb in the props must be the last in the menu, we need to reverse the overflow
                // order.
                orderedItems = overflowItems.slice().reverse();
            }

            return (
                <li>
                    <PopoverNext
                        content={<Menu>{orderedItems.map(renderOverflowBreadcrumb)}</Menu>}
                        disabled={orderedItems.length === 0}
                        placement={collapseFrom === Boundary.END ? "bottom-end" : "bottom-start"}
                        {...popoverPropsToNextProps(popoverProps)}
                    >
                        <span
                            aria-label="collapsed breadcrumbs"
                            role="button"
                            tabIndex={0}
                            {...overflowButtonProps}
                            className={classNames(Classes.BREADCRUMBS_COLLAPSED, overflowButtonProps?.className)}
                        />
                    </PopoverNext>
                </li>
            );
        },
        [collapseFrom, overflowButtonProps, popoverProps, renderOverflowBreadcrumb],
    );

    return (
        <OverflowList
            collapseFrom={collapseFrom}
            minVisibleItems={minVisibleItems}
            tagName="ol"
            navigable={true}
            navigationAriaLabel="Breadcrumb"
            {...overflowListProps}
            className={classNames(Classes.BREADCRUMBS, overflowListProps.className, className)}
            items={items}
            overflowRenderer={renderOverflow}
            visibleItemRenderer={renderBreadcrumbWrapper}
        />
    );
});

Breadcrumbs.displayName = `${DISPLAYNAME_PREFIX}.Breadcrumbs`;
