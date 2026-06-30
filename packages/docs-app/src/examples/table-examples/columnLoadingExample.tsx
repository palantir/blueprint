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

import { useCallback, useMemo, useState } from "react";

import { FormGroup, HTMLSelect } from "@blueprintjs/core";
import { Example, type ExampleProps, handleNumberChange } from "@blueprintjs/docs-theme";
import { Cell, Column, ColumnLoadingOption, Table } from "@blueprintjs/table";

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

export const ColumnLoadingExample: React.FC<ExampleProps> = props => {
    const [loadingColumn, setLoadingColumn] = useState(1);

    const handleLoadingColumnChange = handleNumberChange(setLoadingColumn);

    const loadingOptions = useCallback(
        (columnIndex: number) =>
            columnIndex === loadingColumn
                ? [ColumnLoadingOption.HEADER, ColumnLoadingOption.CELLS]
                : undefined,
        [loadingColumn],
    );

    const options = useMemo(
        () => (
            <FormGroup label="Loading column">
                <HTMLSelect value={loadingColumn} onChange={handleLoadingColumnChange}>
                    {Object.keys(bigSpaceRocks[0]).map((columnName, index) => (
                        <option key={index} value={index} label={formatColumnName(columnName)} />
                    ))}
                </HTMLSelect>
            </FormGroup>
        ),
        [loadingColumn, handleLoadingColumnChange],
    );

    const columns = useMemo(
        () =>
            Array.from({ length: Object.keys(bigSpaceRocks[0]).length }, (_, index) => (
                <Column
                    key={index}
                    loadingOptions={loadingOptions(index)}
                    name={formatColumnName(Object.keys(bigSpaceRocks[0])[index])}
                    cellRenderer={renderCell}
                />
            )),
        [loadingOptions],
    );

    return (
        <Example options={options} showOptionsBelowExample={true} {...props}>
            <Table numRows={bigSpaceRocks.length}>{columns}</Table>
        </Example>
    );
};
