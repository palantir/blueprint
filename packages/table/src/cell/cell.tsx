/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Classes, IIntentProps, IProps } from "@blueprint/core";

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

@PureRender
export class Cell extends React.Component<ICellProps, {}> {
    public render() {
        const { style, tooltip, className } = this.props;
        const content = (<div className="bp-table-truncated-text">{this.props.children}</div>);
        const classes = classNames("bp-table-cell", className, Classes.intentClass(this.props.intent));
        return (<div className={classes} style={style} title={tooltip}>{content}</div>);
    }
}
