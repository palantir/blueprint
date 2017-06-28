/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps } from "@blueprintjs/core";
import * as React from "react";

import { ICellRenderer } from "../cell/cell";
import { Grid, Rect } from "../common";
import * as Classes from "../common/classes";
import { ILocator } from "../locator";

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
    bodyCellRenderer: ICellRenderer;
    grid: Grid;
    locator: ILocator;
    viewportRect: Rect;
    quadrantType: QuadrantType;

    numFrozenColumns?: number;
    numFrozenRows?: number;

    ref?: (ref: HTMLElement) => void;
    bodyRef?: (ref: HTMLElement) => void;
    scrollContainerRef?: (ref: HTMLElement) => void;

    style?: React.CSSProperties;

    onScroll?: React.EventHandler<React.UIEvent<HTMLDivElement>>;
    onWheel?: React.EventHandler<React.WheelEvent<HTMLDivElement>>;

    renderMenu: () => JSX.Element;
    renderColumnHeader: (showFrozenColumnsOnly?: boolean) => JSX.Element;
    renderRowHeader: (showFrozenRowsOnly?: boolean) => JSX.Element;
    renderBody: (showFrozenRowsOnly?: boolean, showFrozenColumnsOnly?: boolean) => JSX.Element;
}

export class TableQuadrant extends React.Component<ITableQuadrantProps, {}> {

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
