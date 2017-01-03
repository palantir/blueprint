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
import { ILoadable } from "../common/loading";

export interface ICellProps extends IIntentProps, ILoadable, IProps {
    key?: string;

    style?: React.CSSProperties;

    /**
     * An optional native tooltip that is displayed on hover
     */
    tooltip?: string;
}

export type ICellRenderer = (rowIndex: number, columnIndex: number) => React.ReactElement<ICellProps>;

export const emptyCellRenderer = (_rowIndex: number, _columnIndex: number) => <Cell />;
export const loadingCellRenderer = () => <Cell isLoading={true} />;

const CELL_CLASSNAME = "bp-table-cell";

@PureRender
export class Cell extends React.Component<ICellProps, {}> {
    private skeletonWidth = 100 - Math.floor(Math.random() * 4) * 5;

    public render() {
        const { style, isLoading, tooltip, className } = this.props;
        const content = (
            <LoadableContent isLoading={isLoading} variableLength={true}>
                <div className="bp-table-truncated-text">{this.props.children}</div>
            </LoadableContent>
        );

        const classes = classNames(
            CELL_CLASSNAME,
            Classes.intentClass(this.props.intent),
            {
                "pt-loading": isLoading,
            },
            className,
        );
        return (<div className={classes} style={style} title={tooltip}>{content}</div>);
    }
}
