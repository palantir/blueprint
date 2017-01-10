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

import { ILoadingProps, LoadableContent } from "../common/loadableContent";

export interface ICellProps extends IIntentProps, ILoadingProps, IProps {
    key?: string;

    style?: React.CSSProperties;

    /**
     * An optional native tooltip that is displayed on hover
     */
    tooltip?: string;
}

export type ICellRenderer = (rowIndex: number, columnIndex: number) => React.ReactElement<ICellProps>;

export const emptyCellRenderer = (_rowIndex: number, _columnIndex: number) => <Cell />;

export const CELL_CLASSNAME = "bp-table-cell";

@PureRender
export class Cell extends React.Component<ICellProps, {}> {
    public render() {
        const { style, loading, tooltip, className } = this.props;

        const classes = classNames(
            CELL_CLASSNAME,
            Classes.intentClass(this.props.intent),
            { [Classes.LOADING]: loading },
            className,
        );

        return (
            <div className={classes} style={style} title={tooltip}>
                <LoadableContent loading={loading} variableLength={true}>
                    <div className="bp-table-truncated-text">{this.props.children}</div>
                </LoadableContent>
            </div>
        );
    }
}
