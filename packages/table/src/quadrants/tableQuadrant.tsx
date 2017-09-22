/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { AbstractComponent, IProps, Utils as CoreUtils } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../common/classes";
import * as Errors from "../common/errors";
import { Grid } from "../common/grid";

export enum QuadrantType {
    /**
     * The main quadrant beneath any frozen rows or columns.
     */
    MAIN,

    /**
     * The top quadrant, containing column headers and frozen rows.
     */
    TOP,

    /**
     * The left quadrant, containing row headers and frozen columns.
     */
    LEFT,

    /**
     * The top-left quadrant, containing the headers and cells common to both the frozen columns and
     * frozen rows.
     */
    TOP_LEFT,
}

export interface ITableQuadrantProps extends IProps {
    /**
     * A callback that receives a `ref` to the quadrant's body-wrapping element. Will need to be
     * provided only for the MAIN quadrant, because that quadrant contains the main table body.
     */
    bodyRef?: React.Ref<HTMLElement>;

    /**
     * The grid computes sizes of cells, rows, or columns from the
     * configurable `columnWidths` and `rowHeights`.
     */
    grid: Grid;

    /**
     * If `false`, hides the row headers and settings menu.
     * @default true
     */
    isRowHeaderShown?: boolean;

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
    quadrantRef?: React.Ref<HTMLElement>;

    /**
     * The quadrant type. Informs the values of the parameters that will be passed to the
     * `render...` callbacks, assuming an expected stacking order of the four quadrants.
     */
    quadrantType?: QuadrantType;

    /**
     * A callback that renders the table menu (the rectangle in the top-left corner).
     */
    renderMenu?: () => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the column header.
     */
    renderColumnHeader?: (showFrozenColumnsOnly?: boolean) => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the row header.
     */
    renderRowHeader?: (showFrozenRowsOnly?: boolean) => JSX.Element;

    /**
     * A callback that renders either all of or just frozen sections of the table body.
     */
    renderBody: (
        quadrantType?: QuadrantType,
        showFrozenRowsOnly?: boolean,
        showFrozenColumnsOnly?: boolean,
    ) => JSX.Element;

    /**
     * A callback that receives a `ref` to the quadrant's scroll-container element.
     */
    scrollContainerRef?: React.Ref<HTMLElement>;

    /**
     * CSS styles to apply to the quadrant's outermost element.
     */
    style?: React.CSSProperties;
}

export class TableQuadrant extends AbstractComponent<ITableQuadrantProps, {}> {
    // we want the user to explicitly pass a quadrantType. define defaultProps as a Partial to avoid
    // declaring that and other required props here.
    public static defaultProps: Partial<ITableQuadrantProps> & object = {
        isRowHeaderShown: true,
    };

    public render() {
        const { grid, isRowHeaderShown, quadrantType, renderBody } = this.props;

        const showFrozenRowsOnly = quadrantType === QuadrantType.TOP || quadrantType === QuadrantType.TOP_LEFT;
        const showFrozenColumnsOnly = quadrantType === QuadrantType.LEFT || quadrantType === QuadrantType.TOP_LEFT;

        const className = classNames(Classes.TABLE_QUADRANT, this.getQuadrantCssClass(), this.props.className);

        const maybeMenu = isRowHeaderShown && CoreUtils.safeInvoke(this.props.renderMenu);
        const maybeRowHeader = isRowHeaderShown && CoreUtils.safeInvoke(this.props.renderRowHeader, showFrozenRowsOnly);
        const maybeColumnHeader = CoreUtils.safeInvoke(this.props.renderColumnHeader, showFrozenColumnsOnly);
        const body =
            quadrantType != null ? renderBody(quadrantType, showFrozenRowsOnly, showFrozenColumnsOnly) : renderBody();

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
