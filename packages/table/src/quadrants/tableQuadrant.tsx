/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { AbstractComponent, IProps } from "@blueprintjs/core";
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
     * A callback that receives a `ref` to the quadrant's body-wrapping element.
     */
    bodyRef?: (ref: HTMLElement) => void;

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
     * The quadrant type. Informs the values of the parameters that will be passed to the
     * `render...` callbacks, assuming an expected stacking order of the four quadrants.
     */
    quadrantType: QuadrantType;

    /**
     * A callback that receives a `ref` to the quadrant's outermost element.
     */
    ref?: (ref: HTMLElement) => void;

    /**
     * A callback that renders the table menu (the rectangle in the top-left corner).
     */
    renderMenu: () => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the column header.
     */
    renderColumnHeader: (showFrozenColumnsOnly?: boolean) => JSX.Element;

    /**
     * A callback that renders either all of or just the frozen section of the row header.
     */
    renderRowHeader: (showFrozenRowsOnly?: boolean) => JSX.Element;

    /**
     * A callback that renders either all of or just frozen sections of the table body.
     */
    renderBody: (showFrozenRowsOnly?: boolean, showFrozenColumnsOnly?: boolean) => JSX.Element;

    /**
     * A callback that receives a `ref` to the quadrant's scroll-container element.
     */
    scrollContainerRef: (ref: HTMLElement) => void;

    /**
     * CSS styles to apply to the quadrant's outermost element.
     */
    style?: React.CSSProperties;
}

export class TableQuadrant extends AbstractComponent<ITableQuadrantProps, {}> {
    public render() {
        const { quadrantType } = this.props;

        const isSomeTopQuadrant = quadrantType === QuadrantType.TOP || quadrantType === QuadrantType.TOP_LEFT;
        const isSomeLeftQuadrant = quadrantType === QuadrantType.LEFT || quadrantType === QuadrantType.TOP_LEFT;

        // recast the booleans above into more semantically meaningful variables

        const isTopContentVisible = isSomeTopQuadrant;
        const isLeftContentVisible = isSomeLeftQuadrant;

        const showFrozenRowsOnly = isSomeTopQuadrant;
        const showFrozenColumnsOnly = isSomeLeftQuadrant;

        // render placeholders of the same size if that content won't be visible in this quadrant
        // TODO: is it weird that the TableQuadrant assumes the quadrant stacking order (MAIN under
        // TOP+LEFT under TOP_LEFT)?

        const maybeMenu = (isTopContentVisible || isLeftContentVisible)
            ? this.props.renderMenu()
            : this.renderMenuPlaceholder();

        const maybeColumnHeader = isTopContentVisible
            ? this.props.renderColumnHeader(showFrozenColumnsOnly)
            : this.renderColumnHeaderPlaceholder();

        const maybeRowHeader = isLeftContentVisible
            ? this.props.renderRowHeader(showFrozenRowsOnly)
            : this.renderRowHeaderPlaceholder();

        return (
            <div className={this.props.className} style={this.props.style} ref={this.props.ref}>
                <div
                    className="bp-table-quadrant-scroll-container"
                    ref={this.props.scrollContainerRef}
                    onScroll={this.props.onScroll}
                    onWheel={this.props.onWheel}
                >
                    <div className={Classes.TABLE_TOP_CONTAINER}>
                        {maybeMenu}
                        {maybeColumnHeader}
                    </div>
                    <div className={Classes.TABLE_BOTTOM_CONTAINER}>
                        {maybeRowHeader}
                        {/* TODO: is it okay to put `position: relative` on every quadrant's body wrapper? */}
                        <div ref={this.props.bodyRef} style={{ position: "relative" }}>
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

    private renderMenuPlaceholder() {
        // TODO: may not need this
    }

    private renderColumnHeaderPlaceholder() {
        // TODO: may not need this
    }

    private renderRowHeaderPlaceholder() {
        // TODO: may not need this
    }
}
