/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";
import * as Classes from "../common/classes";
import { Utils } from "../common/utils";

import { Classes as CoreClasses, IIntentProps, IProps } from "@blueprintjs/core";

import { LoadableContent } from "../common/loadableContent";

export interface ICellProps extends IIntentProps, IProps {
    key?: string;

    style?: React.CSSProperties;

    /**
     * The column index of the cell. If provided, this will be passed as an argument to any callbacks
     * when they are invoked.
     */
    columnIndex?: number;

    /**
     * If `true`, the cell will be rendered above overlay layers to enable mouse
     * interactions within the cell.
     * @default false
     */
    interactive?: boolean;

    /**
     * An optional native tooltip that is displayed on hover.
     * If `true`, content will be replaced with a fixed-height skeleton.
     * @default false
     */
    loading?: boolean;

    /**
     * The row index of the cell. If provided, this will be passed as an argument to any callbacks
     * when they are invoked.
     */
    rowIndex?: number;

    /**
     * An optional native tooltip that is displayed on hover.
     */
    tooltip?: string;

    /**
     * If `true`, the cell contents will be wrapped in a `div` with
     * styling that will prevent the content from overflowing the cell.
     * @default true
     */
    truncated?: boolean;

    /**
     * If `true`, the cell contents will be wrapped in a `div` with
     * styling that will cause text to wrap, rather than displaying it on a single line.
     * @default false
     */
    wrapText?: boolean;
}

export type ICellRenderer = (rowIndex: number, columnIndex: number) => React.ReactElement<ICellProps>;

export const emptyCellRenderer = () => <Cell />;

export class Cell extends React.Component<ICellProps, {}> {
    public static defaultProps = {
        truncated: true,
        wrapText: false,
    };

    public shouldComponentUpdate(nextProps: ICellProps) {
        // deeply compare "style," because a new but identical object might have been provided.
        return !Utils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] })
            || !Utils.deepCompareKeys(this.props.style, nextProps.style);
    }

    public render() {
        const { style, intent, interactive, loading, tooltip, truncated, className, wrapText } = this.props;

        const classes = classNames(
            Classes.TABLE_CELL,
            CoreClasses.intentClass(intent),
            {
                [Classes.TABLE_CELL_INTERACTIVE]: interactive,
                [CoreClasses.LOADING]: loading,
                [Classes.TABLE_TRUNCATED_CELL]: truncated,
            },
            className,
        );

        const textClasses = classNames(
            {
                [Classes.TABLE_TRUNCATED_TEXT]: truncated,
                [Classes.TABLE_NO_WRAP_TEXT]: !wrapText,
            },
        );

        const modifiedChildren = React.Children.map(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>,
                    {parentCellHeight: style.height, parentCellWidth: style.width});
            }
            return child;
        });

        const content = <div className={textClasses}>{modifiedChildren}</div>;

        return (
            <div className={classes} style={style} title={tooltip}>
                <LoadableContent loading={loading} variableLength={true}>
                    {content}
                </LoadableContent>
            </div>
        );
    }
}
