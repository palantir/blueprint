/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { AbstractComponent, IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../common/classes";
import * as Errors from "../common/errors";

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
    quadrantType: QuadrantType;

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
    renderBody?: (showFrozenRowsOnly?: boolean, showFrozenColumnsOnly?: boolean) => JSX.Element;

    /**
     * A callback that receives a `ref` to the quadrant's scroll-container element.
     */
    scrollContainerRef: React.Ref<HTMLElement>;

    /**
     * CSS styles to apply to the quadrant's outermost element.
     */
    style?: React.CSSProperties;
}

export class TableQuadrant extends AbstractComponent<ITableQuadrantProps, {}> {
    public render() {
        const { quadrantType } = this.props;

        const showFrozenRowsOnly = quadrantType === QuadrantType.TOP || quadrantType === QuadrantType.TOP_LEFT;
        const showFrozenColumnsOnly = quadrantType === QuadrantType.LEFT || quadrantType === QuadrantType.TOP_LEFT;

        const className = classNames(Classes.TABLE_QUADRANT, this.getQuadrantCssClass(), this.props.className);

        return (
            <div className={className} style={this.props.style} ref={this.props.quadrantRef}>
                <div
                    className={Classes.TABLE_QUADRANT_SCROLL_CONTAINER}
                    ref={this.props.scrollContainerRef}
                    onScroll={this.props.onScroll}
                    onWheel={this.props.onWheel}
                >
                    <div className={Classes.TABLE_TOP_CONTAINER}>
                        {this.props.renderMenu()}
                        {this.props.renderColumnHeader(showFrozenColumnsOnly)}
                    </div>
                    <div className={Classes.TABLE_BOTTOM_CONTAINER}>
                        {this.props.renderRowHeader(showFrozenRowsOnly)}
                        {/* TODO: is it okay to put `position: relative` on every quadrant's body wrapper? */}
                        <div
                            className={Classes.TABLE_QUADRANT_BODY_CONTAINER}
                            ref={this.props.bodyRef}
                        >
                            {this.props.renderBody(showFrozenRowsOnly, showFrozenColumnsOnly)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected validateProps(nextProps: ITableQuadrantProps) {
        const { quadrantType } = nextProps;
        if (nextProps.onScroll != null && quadrantType !== QuadrantType.MAIN) {
            console.warn(Errors.QUADRANT_ON_SCROLL_UNNECESSARILY_DEFINED);
        }
        if (nextProps.onWheel && quadrantType === QuadrantType.MAIN) {
            console.warn(Errors.QUADRANT_ON_WHEEL_UNNECESSARILY_DEFINED)
        }
    }

    private getQuadrantCssClass() {
        const { quadrantType } = this.props;
        if (quadrantType === QuadrantType.MAIN) {
            return Classes.TABLE_QUADRANT_MAIN;
        } else if (quadrantType === QuadrantType.TOP) {
            return Classes.TABLE_QUADRANT_TOP;
        } else if (quadrantType === QuadrantType.LEFT) {
            return Classes.TABLE_QUADRANT_LEFT;
        } else if (quadrantType === QuadrantType.TOP_LEFT) {
            return Classes.TABLE_QUADRANT_TOP_LEFT;
        } else {
            return undefined;
        }
    }
}
