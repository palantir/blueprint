/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { useMemo, useState } from "react";

import { Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Cell, Column, Table, TableLoadingOption } from "@blueprintjs/table";

interface BigSpaceRock {
    [key: string]: number | string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bigSpaceRocks: BigSpaceRock[] = require("./potentiallyHazardousAsteroids.json");

function formatColumnName(columnName: string) {
    return columnName
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, firstCharacter => firstCharacter.toUpperCase());
}

const renderCell = (rowIndex: number, columnIndex: number) => {
    const bigSpaceRock = bigSpaceRocks[rowIndex];
    return <Cell>{bigSpaceRock[Object.keys(bigSpaceRock)[columnIndex]]}</Cell>;
};

export const TableLoadingExample: React.FC<ExampleProps> = props => {
    const [cellsLoading, setCellsLoading] = useState(true);
    const [columnHeadersLoading, setColumnHeadersLoading] = useState(true);
    const [rowHeadersLoading, setRowHeadersLoading] = useState(true);

    const loadingOptions = useMemo(() => {
        const result: TableLoadingOption[] = [];
        if (cellsLoading) {
            result.push(TableLoadingOption.CELLS);
        }
        if (columnHeadersLoading) {
            result.push(TableLoadingOption.COLUMN_HEADERS);
        }
        if (rowHeadersLoading) {
            result.push(TableLoadingOption.ROW_HEADERS);
        }
        return result;
    }, [cellsLoading, columnHeadersLoading, rowHeadersLoading]);

    const options = useMemo(
        () => (
            <>
                <Switch
                    checked={cellsLoading}
                    label="Cells"
                    onChange={handleBooleanChange(setCellsLoading)}
                />
                <Switch
                    checked={columnHeadersLoading}
                    label="Column headers"
                    onChange={handleBooleanChange(setColumnHeadersLoading)}
                />
                <Switch
                    checked={rowHeadersLoading}
                    label="Row headers"
                    onChange={handleBooleanChange(setRowHeadersLoading)}
                />
            </>
        ),
        [cellsLoading, columnHeadersLoading, rowHeadersLoading],
    );

    const columns = useMemo(
        () =>
            Object.keys(bigSpaceRocks[0]).map((columnName, index) => (
                <Column key={index} name={formatColumnName(columnName)} cellRenderer={renderCell} />
            )),
        [],
    );

    return (
        <Example options={options} showOptionsBelowExample={true} {...props}>
            <Table numRows={bigSpaceRocks.length} loadingOptions={loadingOptions}>
                {columns}
            </Table>
        </Example>
    );
};
