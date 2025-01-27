/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { DISPLAYNAME_PREFIX, type Props } from "@blueprintjs/core";

import { type CellRenderer, emptyCellRenderer } from "./cell/cell";
import type { ColumnHeaderRenderer } from "./headers/columnHeader";
import type { ColumnNameProps } from "./headers/columnHeaderCell";
import type { ColumnLoadingOption } from "./regions";

export interface ColumnProps extends ColumnNameProps, Props {
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
     * An instance of `CellRenderer`, a function that takes a row and column
     * index, and returns a `Cell` React element.
     */
    cellRenderer?: CellRenderer;

    /**
     * An instance of `ColumnHeaderRenderer`, a function that takes a column
     * index and returns a `ColumnHeaderCell` React element.
     */
    columnHeaderCellRenderer?: ColumnHeaderRenderer;
}

/**
 * Column component.
 *
 * @see https://blueprintjs.com/docs/#table/api.column
 */
export class Column extends React.PureComponent<ColumnProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Column`;

    public static defaultProps: ColumnProps = {
        cellRenderer: emptyCellRenderer,
    };
}
