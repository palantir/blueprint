/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps } from "@blueprintjs/core";
import * as React from "react";
import { emptyCellRenderer, ICellRenderer } from "./cell/cell";
import { IColumnHeaderRenderer, IColumnNameProps } from "./headers/columnHeaderCell";

export interface IColumnProps extends IColumnNameProps, IProps {
    /**
     * A unique ID, similar to React's `key`. This is used, for example, to
     * maintain the width of a column between re-ordering and rendering. If no
     * IDs are provided, widths will be persisted across renders using a
     * column's index only. Columns widths can also be persisted outside the
     * `Table` component, then passed in with the `columnWidths` prop.
     */
    id?: string | number;

    /**
     * An instance of `ICellRenderer`, a function that takes a row and column
     * index, and returns a `Cell` React element
     */
    renderCell?: ICellRenderer;

    /**
     * An instance of `IColumnHeaderRenderer`, a function that takes a column
     * index and returns a `ColumnHeaderCell` React element
     */
    renderColumnHeader?: IColumnHeaderRenderer;
}

export class Column extends React.Component<IColumnProps, {}> {
    public static defaultProps = {
        renderCell: emptyCellRenderer,
    };
}
