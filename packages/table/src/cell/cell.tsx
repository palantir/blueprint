/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, IIntentProps, IProps } from "@blueprintjs/core";

export interface ICellProps extends IIntentProps, IProps {
    key?: string;

    style?: React.CSSProperties;

    /**
     * An optional native tooltip that is displayed on hover
     */
    tooltip?: string;
}

export type ICellRenderer = (rowIndex: number, columnIndex: number) => React.ReactElement<ICellProps>;

export const emptyCellRenderer = (_rowIndex: number, _columnIndex: number) => <Cell />;

export class Cell extends React.PureComponent<ICellProps, {}> {
    public render() {
        const { style, tooltip, className } = this.props;
        const content = (<div className="bp-table-truncated-text">{this.props.children}</div>);
        const classes = classNames("bp-table-cell", className, Classes.intentClass(this.props.intent));
        return (<div className={classes} style={style} title={tooltip}>{content}</div>);
    }
}
