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

import { AbstractComponent, IProps, Utils as CoreUtils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import * as Classes from "../common/classes";
import * as Errors from "../common/errors";
import { Grid } from "../common/grid";

export enum QuadrantType {
    /**
     * The main quadrant beneath any frozen rows or columns.
     */
    MAIN = "main",

    /**
     * The top quadrant, containing column headers and frozen rows.
     */
    TOP = "top",

    /**
     * The left quadrant, containing row headers and frozen columns.
     */
    LEFT = "left",

    /**
     * The top-left quadrant, containing the headers and cells common to both
     * the frozen columns and frozen rows.
     */
    TOP_LEFT = "top-left",
}

export interface ITableQuadrantProps extends IProps {
    /**
     * A callback that receives a `ref` to the quadrant's body-wrapping element. Will need to be
     * provided only for the MAIN quadrant, because that quadrant contains the main table body.
     */
    bodyRef?: (ref: HTMLElement | null) => any;

    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;

    /**
     * If `false`, hides the row headers and settings menu.
     * @default true
     */
    enableRowHeader?: boolean;

    /**
     * An optional callback invoked when the quadrant is scrolled via the scrollbar OR the trackpad/mouse wheel.
     * This callback really only makes sense for the MAIN quadrant, because that's the only quadrant whose
     * scrollbar is visible. Other quadrants should simply provide an `onWheel` callback.
     */
    onScroll?: React.EventHandler<React.UIEvent<HTMLDivElement>>;

    /**
     * An optional callback invoked when the quadrant is scrolled via the trackpad/mouse wheel. This
     * callback should be provided for all quadrant types except MAIN, which should provide the more
     * generic `onScroll` callback.
     */
    onWheel?: React.EventHandler<React.WheelEvent<HTMLDivElement>>;

    /**
     * A callback that receives a `ref` to the quadrant's outermost element.
     */
    quadrantRef?: (ref: HTMLElement | null) => any;

    /**
     * The quadrant type. Informs the values of the parameters that will be passed to the
     * `render...` callbacks, assuming an expected stacking order of the four quadrants.
     */
    quadrantType?: QuadrantType;

    /**
     * A callback that renders the table menu (the rectangle in the top-left corner).
     */
    menuRenderer?: () => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the column header.
     */
    columnHeaderCellRenderer?: (showFrozenColumnsOnly?: boolean) => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the row header.
     */
    rowHeaderCellRenderer?: (showFrozenRowsOnly?: boolean) => JSX.Element;

    /**
     * A callback that renders either all of or just frozen sections of the table body.
     */
    bodyRenderer: (
        quadrantType?: QuadrantType,
        showFrozenRowsOnly?: boolean,
        showFrozenColumnsOnly?: boolean,
    ) => JSX.Element;

    /**
     * A callback that receives a `ref` to the quadrant's scroll-container element.
     */
    scrollContainerRef?: (ref: HTMLElement | null) => any;

    /**
     * CSS styles to apply to the quadrant's outermost element.
     */
    style?: React.CSSProperties;
}

export class TableQuadrant extends AbstractComponent<ITableQuadrantProps, {}> {
    // we want the user to explicitly pass a quadrantType. define defaultProps as a Partial to avoid
    // declaring that and other required props here.
    public static defaultProps: Partial<ITableQuadrantProps> & object = {
        enableRowHeader: true,
    };

    public render() {
        const { grid, enableRowHeader, quadrantType, bodyRenderer } = this.props;

        const showFrozenRowsOnly = quadrantType === QuadrantType.TOP || quadrantType === QuadrantType.TOP_LEFT;
        const showFrozenColumnsOnly = quadrantType === QuadrantType.LEFT || quadrantType === QuadrantType.TOP_LEFT;

        const className = classNames(Classes.TABLE_QUADRANT, this.getQuadrantCssClass(), this.props.className);

        const maybeMenu = enableRowHeader && CoreUtils.safeInvoke(this.props.menuRenderer);
        const maybeRowHeader =
            enableRowHeader && CoreUtils.safeInvoke(this.props.rowHeaderCellRenderer, showFrozenRowsOnly);
        const maybeColumnHeader = CoreUtils.safeInvoke(this.props.columnHeaderCellRenderer, showFrozenColumnsOnly);
        const body =
            quadrantType != null
                ? bodyRenderer(quadrantType, showFrozenRowsOnly, showFrozenColumnsOnly)
                : bodyRenderer();

        // need to set bottom container size to prevent overlay clipping on scroll
        const bottomContainerStyle = {
            height: grid.getHeight(),
            width: grid.getWidth(),
        };

        return (
            <div className={className} style={this.props.style} ref={this.props.quadrantRef}>
                <div
                    className={Classes.TABLE_QUADRANT_SCROLL_CONTAINER}
                    ref={this.props.scrollContainerRef}
                    onScroll={this.props.onScroll}
                    onWheel={this.props.onWheel}
                >
                    <div className={Classes.TABLE_TOP_CONTAINER}>
                        {maybeMenu}
                        {maybeColumnHeader}
                    </div>
                    <div className={Classes.TABLE_BOTTOM_CONTAINER} style={bottomContainerStyle}>
                        {maybeRowHeader}
                        <div className={Classes.TABLE_QUADRANT_BODY_CONTAINER} ref={this.props.bodyRef}>
                            {body}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected validateProps(nextProps: ITableQuadrantProps) {
        const { quadrantType } = nextProps;
        if (nextProps.onScroll != null && quadrantType != null && quadrantType !== QuadrantType.MAIN) {
            console.warn(Errors.QUADRANT_ON_SCROLL_UNNECESSARILY_DEFINED);
        }
    }

    private getQuadrantCssClass() {
        switch (this.props.quadrantType) {
            case QuadrantType.MAIN:
                return Classes.TABLE_QUADRANT_MAIN;
            case QuadrantType.TOP:
                return Classes.TABLE_QUADRANT_TOP;
            case QuadrantType.LEFT:
                return Classes.TABLE_QUADRANT_LEFT;
            case QuadrantType.TOP_LEFT:
                return Classes.TABLE_QUADRANT_TOP_LEFT;
            default:
                return undefined;
        }
    }
}
