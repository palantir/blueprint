/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import React from "react";

import { Classes as CoreClasses, ContextMenu, Props, Utils as CoreUtils } from "@blueprintjs/core";

import * as Classes from "../common/classes";
import { ResizeHandle } from "../interactions/resizeHandle";

export interface HeaderCellProps extends Props {
    /**
     * The index of the cell in the header. If provided, this will be passed as an argument to any
     * callbacks when they are invoked.
     */
    index?: number;

    /**
     * If `true`, will apply the active class to the header to indicate it is
     * part of an external operation.
     */
    isActive?: boolean;

    /**
     * If `true`, the row/column `name` will be replaced with a fixed-height skeleton, and the
     * `resizeHandle` will not be rendered. If passing in additional children to this component, you
     * will also want to conditionally apply `Classes.SKELETON` where appropriate.
     *
     * @default false
     */
    loading?: boolean;

    /**
     * The name displayed in the header of the row/column.
     */
    name?: string;

    /**
     * A callback that returns an element, like a `<Menu>`, which is displayed by right-clicking
     * anywhere in the header. The callback will receive the cell index if it was provided via
     * props.
     */
    menuRenderer?: (index?: number) => JSX.Element;

    /**
     * A `ReorderHandle` React component that allows users to drag-reorder the column header.
     */
    reorderHandle?: JSX.Element;

    /**
     * A `ResizeHandle` React component that allows users to drag-resize the header.
     */
    resizeHandle?: ResizeHandle;

    /**
     * CSS styles for the top level element.
     */
    style?: React.CSSProperties;
}

export interface InternalHeaderCellProps extends HeaderCellProps {
    /**
     * Specifies if the cell is reorderable.
     *
     * @internal users should pass `isReorderable` to `ColumnHeader` or `RowHeader` instead
     */
    isReorderable?: boolean;

    /**
     * Specifies if the cell is selected.
     */
    isSelected?: boolean;
}

export interface HeaderCellState {
    isActive: boolean;
}

export class HeaderCell extends React.Component<InternalHeaderCellProps, HeaderCellState> {
    public state: HeaderCellState = {
        isActive: false,
    };

    public shouldComponentUpdate(nextProps: HeaderCellProps) {
        return (
            !CoreUtils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] }) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, ["style"])
        );
    }

    public renderContextMenu() {
        const { menuRenderer } = this.props;

        if (CoreUtils.isFunction(menuRenderer)) {
            // the preferred way (a consistent function instance that won't cause as many re-renders)
            return menuRenderer(this.props.index);
        } else {
            return undefined;
        }
    }

    public render() {
        const { children, index, isActive, isSelected, loading, menuRenderer, style } = this.props;
        const classes = classNames(
            Classes.TABLE_HEADER,
            {
                [Classes.TABLE_HEADER_ACTIVE]: isActive || isActive,
                [Classes.TABLE_HEADER_SELECTED]: isSelected,
                [CoreClasses.LOADING]: loading,
            },
            this.props.className,
        );

        return (
            <ContextMenu content={menuRenderer?.(index) ?? undefined}>
                <div className={classes} style={style}>
                    {children}
                </div>
            </ContextMenu>
        );
    }
}
