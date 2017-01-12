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

export interface ICellProps extends IIntentProps, IProps {
    key?: string;

    style?: React.CSSProperties;

    /**
     * If true, the cell will be rendered above overlay layers to enable mouse
     * interactions within the cell.
     *
     * @default false
     */
    interactive?: boolean;

    /**
     * An optional native tooltip that is displayed on hover
     */
    tooltip?: string;

    /**
     * If true, the cell contents will be wrapped in a div with
     * styling that will prevent the content from overflowing the cell.
     *
     * @default true
     */
    truncated?: boolean;
}

export type ICellRenderer = (rowIndex: number, columnIndex: number) => React.ReactElement<ICellProps>;

export const emptyCellRenderer = (_rowIndex: number, _columnIndex: number) => <Cell />;

@PureRender
export class Cell extends React.Component<ICellProps, {}> {
    public static defaultProps = {
        truncated: true,
    };

    public render() {
        const { className, intent, interactive, style, tooltip, truncated } = this.props;
        const content = truncated ?
            <div className="bp-table-truncated-text">{this.props.children}</div> : this.props.children;
        const classes = classNames(
            "bp-table-cell", Classes.intentClass(intent), {
                "bp-table-cell-interactive" : interactive,
            }, className);
        return <div className={classes} style={style} title={tooltip}>{content}</div>;
    }
}
