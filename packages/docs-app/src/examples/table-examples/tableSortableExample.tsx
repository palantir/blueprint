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

// tslint:disable max-classes-per-file

import * as React from "react";

import { Menu, MenuItem } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import {
    Cell,
    Column,
    ColumnHeaderCell,
    CopyCellsMenuItem,
    IMenuContext,
    SelectionModes,
    Table,
    Utils,
} from "@blueprintjs/table";

// tslint:disable-next-line:no-var-requires
const sumo = require("./sumo.json") as any[];

export type ICellLookup = (rowIndex: number, columnIndex: number) => any;
export type ISortCallback = (columnIndex: number, comparator: (a: any, b: any) => number) => void;

export interface ISortableColumn {
    getColumn(getCellData: ICellLookup, sortColumn: ISortCallback): JSX.Element;
}

abstract class AbstractSortableColumn implements ISortableColumn {
    constructor(protected name: string, protected index: number) {}

    public getColumn(getCellData: ICellLookup, sortColumn: ISortCallback) {
        const cellRenderer = (rowIndex: number, columnIndex: number) => (
            <Cell>{getCellData(rowIndex, columnIndex)}</Cell>
        );
        const menuRenderer = this.renderMenu.bind(this, sortColumn);
        const columnHeaderCellRenderer = () => <ColumnHeaderCell name={this.name} menuRenderer={menuRenderer} />;
        return (
            <Column
                cellRenderer={cellRenderer}
                columnHeaderCellRenderer={columnHeaderCellRenderer}
                key={this.index}
                name={this.name}
            />
        );
    }

    protected abstract renderMenu(sortColumn: ISortCallback): JSX.Element;
}

class TextSortableColumn extends AbstractSortableColumn {
    protected renderMenu(sortColumn: ISortCallback) {
        const sortAsc = () => sortColumn(this.index, (a, b) => this.compare(a, b));
        const sortDesc = () => sortColumn(this.index, (a, b) => this.compare(b, a));
        return (
            <Menu>
                <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc" />
                <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc" />
            </Menu>
        );
    }

    private compare(a: any, b: any) {
        return a.toString().localeCompare(b);
    }
}

class RankSortableColumn extends AbstractSortableColumn {
    private static RANK_PATTERN = /([YOSKMJ])([0-9]+)(e|w)/i;
    private static TITLES: { [key: string]: number } = {
        J: 5, // Juryo
        K: 3, // Komusubi
        M: 4, // Maegashira
        O: 1, // Ozeki
        S: 2, // Sekiwake
        Y: 0, // Yokozuna
    };

    protected renderMenu(sortColumn: ISortCallback) {
        const sortAsc = () => sortColumn(this.index, (a, b) => this.compare(a, b));
        const sortDesc = () => sortColumn(this.index, (a, b) => this.compare(b, a));
        return (
            <Menu>
                <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Rank Asc" />
                <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Rank Desc" />
            </Menu>
        );
    }

    private toRank(str: string) {
        const match = RankSortableColumn.RANK_PATTERN.exec(str);
        if (match == null) {
            return 1000;
        }
        const [title, rank, side] = match.slice(1);
        return RankSortableColumn.TITLES[title] * 100 + (side === "e" ? 0 : 1) + parseInt(rank, 10) * 2;
    }

    private compare(a: any, b: any) {
        return this.toRank(a) - this.toRank(b);
    }
}

class RecordSortableColumn extends AbstractSortableColumn {
    private static WIN_LOSS_PATTERN = /^([0-9]+)(-([0-9]+))?(-([0-9]+)) ?.*/;

    protected renderMenu(sortColumn: ISortCallback) {
        // tslint:disable:jsx-no-lambda
        return (
            <Menu>
                <MenuItem
                    icon="sort-asc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toWins, false))}
                    text="Sort Wins Asc"
                />
                <MenuItem
                    icon="sort-desc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toWins, true))}
                    text="Sort Wins Desc"
                />
                <MenuItem
                    icon="sort-asc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toLosses, false))}
                    text="Sort Losses Asc"
                />
                <MenuItem
                    icon="sort-desc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toLosses, true))}
                    text="Sort Losses Desc"
                />
                <MenuItem
                    icon="sort-asc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toTies, false))}
                    text="Sort Ties Asc"
                />
                <MenuItem
                    icon="sort-desc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toTies, true))}
                    text="Sort Ties Desc"
                />
            </Menu>
        );
        // tslint:enable:jsx-no-lambda
    }

    private transformCompare(transform: (a: any) => any, reverse: boolean) {
        if (reverse) {
            return (a: any, b: any) => transform(b) - transform(a);
        } else {
            return (a: any, b: any) => transform(a) - transform(b);
        }
    }

    private toWins(a: any) {
        const match = RecordSortableColumn.WIN_LOSS_PATTERN.exec(a);
        return match == null ? -1 : parseInt(match[1], 10);
    }

    private toTies(a: any) {
        const match = RecordSortableColumn.WIN_LOSS_PATTERN.exec(a);
        return match == null || match[3] == null ? -1 : parseInt(match[3], 10);
    }

    private toLosses(a: any) {
        const match = RecordSortableColumn.WIN_LOSS_PATTERN.exec(a);
        return match == null ? -1 : parseInt(match[5], 10);
    }
}

export class TableSortableExample extends React.PureComponent<IExampleProps> {
    public state = {
        columns: [
            new TextSortableColumn("Rikishi", 0),
            new RankSortableColumn("Rank - Hatsu Basho", 1),
            new RecordSortableColumn("Record - Hatsu Basho", 2),
            new RankSortableColumn("Rank - Haru Basho", 3),
            new RecordSortableColumn("Record - Haru Basho", 4),
            new RankSortableColumn("Rank - Natsu Basho", 5),
            new RecordSortableColumn("Record - Natsu Basho", 6),
            new RankSortableColumn("Rank - Nagoya Basho", 7),
            new RecordSortableColumn("Record - Nagoya Basho", 8),
            new RankSortableColumn("Rank - Aki Basho", 9),
            new RecordSortableColumn("Record - Aki Basho", 10),
            new RankSortableColumn("Rank - Kyūshū Basho", 11),
            new RecordSortableColumn("Record - Kyūshū Basho", 12),
        ] as ISortableColumn[],
        data: sumo,
        sortedIndexMap: [] as number[],
    };

    public render() {
        const numRows = this.state.data.length;
        const columns = this.state.columns.map(col => col.getColumn(this.getCellData, this.sortColumn));
        return (
            <Example options={false} showOptionsBelowExample={true} {...this.props}>
                <Table
                    bodyContextMenuRenderer={this.renderBodyContextMenu}
                    numRows={numRows}
                    selectionModes={SelectionModes.COLUMNS_AND_CELLS}
                >
                    {columns}
                </Table>
            </Example>
        );
    }

    private getCellData = (rowIndex: number, columnIndex: number) => {
        const sortedRowIndex = this.state.sortedIndexMap[rowIndex];
        if (sortedRowIndex != null) {
            rowIndex = sortedRowIndex;
        }
        return this.state.data[rowIndex][columnIndex];
    };

    private renderBodyContextMenu = (context: IMenuContext) => {
        return (
            <Menu>
                <CopyCellsMenuItem context={context} getCellData={this.getCellData} text="Copy" />
            </Menu>
        );
    };

    private sortColumn = (columnIndex: number, comparator: (a: any, b: any) => number) => {
        const { data } = this.state;
        const sortedIndexMap = Utils.times(data.length, (i: number) => i);
        sortedIndexMap.sort((a: number, b: number) => {
            return comparator(data[a][columnIndex], data[b][columnIndex]);
        });
        this.setState({ sortedIndexMap });
    };
}
