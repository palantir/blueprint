/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IIntentProps, IProps } from "@blueprintjs/core";

import { LoadableContent } from "../common/loadableContent";

export interface ICellProps extends IIntentProps, IProps {
    key?: string;

    style?: React.CSSProperties;

    /**
     * If true, the cell will be rendered above overlay layers to enable mouse
     * interactions within the cell.
     * @default false
     */
    interactive?: boolean;

    /**
     * An optional native tooltip that is displayed on hover
     * If true, content will be replaced with a fixed-height skeleton.
     * @default false
     */
    loading?: boolean;

    /**
     * An optional native tooltip that is displayed on hover.
     */
    tooltip?: string;

    /**
     * If true, the cell contents will be wrapped in a div with
     * styling that will prevent the content from overflowing the cell.
     * @default true
     */
    truncated?: boolean;
}

export type ICellRenderer = (rowIndex: number, columnIndex: number) => React.ReactElement<ICellProps>;

export const emptyCellRenderer: ICellRenderer = (_rowIndex: number, _columnIndex: number) => <Cell />;

export const CELL_CLASSNAME = "bp-table-cell";
export const CELL_INTERACTIVE_CLASSNAME = "bp-table-cell-interactive";

@PureRender
export class Cell extends React.Component<ICellProps, {}> {
    public static defaultProps = {
        truncated: true,
    };

    public render() {
        const { style, intent, interactive, loading, tooltip, truncated, className } = this.props;

        const classes = classNames(
            CELL_CLASSNAME,
            Classes.intentClass(intent),
            {
                [CELL_INTERACTIVE_CLASSNAME]: interactive,
                [Classes.LOADING]: loading,
            },
            className,
        );

        const content = truncated ?
            <div className="bp-table-truncated-text">{this.props.children}</div> : this.props.children;

        return (
            <div className={classes} style={style} title={tooltip}>
                <LoadableContent loading={loading} variableLength={true}>
                    {content}
                </LoadableContent>
            </div>
        );
    }
}
