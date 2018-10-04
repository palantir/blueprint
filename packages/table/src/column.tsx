/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { DISPLAYNAME_PREFIX, IProps } from "@blueprintjs/core";
import * as React from "react";
import { emptyCellRenderer, ICellRenderer } from "./cell/cell";
import { IColumnHeaderRenderer } from "./headers/columnHeader";
import { IColumnNameProps } from "./headers/columnHeaderCell";
import { ColumnLoadingOption } from "./regions";

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
     * Set this prop to specify whether to render the loading state of the
     * column header and cells in this column. Column-level `loadingOptions`
     * override `Table`-level `loadingOptions`. For example, if you set
     * `loadingOptions=[ TableLoadingOption.CELLS ]` on `Table` and
     * `loadingOptions=[ ColumnLoadingOption.HEADER ]` on a `Column`, the cells
     * in that column will _not_ show their loading state.
     */
    loadingOptions?: ColumnLoadingOption[];

    /**
     * An instance of `ICellRenderer`, a function that takes a row and column
     * index, and returns a `Cell` React element.
     */
    cellRenderer?: ICellRenderer;

    /**
     * An instance of `IColumnHeaderRenderer`, a function that takes a column
     * index and returns a `ColumnHeaderCell` React element.
     */
    columnHeaderCellRenderer?: IColumnHeaderRenderer;
}

export class Column extends React.PureComponent<IColumnProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Column`;

    public static defaultProps: IColumnProps = {
        cellRenderer: emptyCellRenderer,
    };
}
