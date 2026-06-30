/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { RadioGroup } from "@blueprintjs/core";
import { Example, type ExampleProps, handleStringChange } from "@blueprintjs/docs-theme";
import { Cell, Column, ColumnHeaderCell, RowHeaderCell, Table } from "@blueprintjs/table";

interface BigSpaceRock {
    [key: string]: number | string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bigSpaceRocks: BigSpaceRock[] = require("./potentiallyHazardousAsteroids.json");

export const CellsLoadingConfiguration = {
    ALL: "all" as const,
    FIRST_COLUMN: "first-column" as const,
    FIRST_ROW: "first-row" as const,
    NONE: "none" as const,
    RANDOM: "random" as const,
};
export type CellsLoadingConfiguration =
    (typeof CellsLoadingConfiguration)[keyof typeof CellsLoadingConfiguration];

const CONFIGURATIONS = [
    { label: "All cells", value: CellsLoadingConfiguration.ALL },
    { label: "First column", value: CellsLoadingConfiguration.FIRST_COLUMN },
    { label: "First row", value: CellsLoadingConfiguration.FIRST_ROW },
    { label: "Random", value: CellsLoadingConfiguration.RANDOM },
    { label: "None", value: CellsLoadingConfiguration.NONE },
];

function formatColumnName(columnName: string) {
    return columnName
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, firstCharacter => firstCharacter.toUpperCase());
}

export const CellLoadingExample: React.FC<ExampleProps> = props => {
    const [configuration, setConfiguration] = useState<CellsLoadingConfiguration>(
        CellsLoadingConfiguration.ALL,
    );
    const [randomNumbers, setRandomNumbers] = useState<number[] | undefined>(undefined);

    const handleConfigurationChange = handleStringChange((value: string) => {
        if (value === CellsLoadingConfiguration.RANDOM) {
            // calculate random numbers just once instead of inside cellRenderer which is called during table scrolling
            const numbers: number[] = [];
            const numberOfCells = bigSpaceRocks.length * Object.keys(bigSpaceRocks[0]).length;
            for (let i = 0; i < numberOfCells; i++) {
                numbers.push(Math.random());
            }
            setRandomNumbers(numbers);
        }
        setConfiguration(value as CellsLoadingConfiguration);
    });

    const isLoading = useCallback(
        (rowIndex: number, columnIndex: number) => {
            switch (configuration) {
                case CellsLoadingConfiguration.ALL:
                    return true;
                case CellsLoadingConfiguration.FIRST_COLUMN:
                    return columnIndex === 1;
                case CellsLoadingConfiguration.FIRST_ROW:
                    return rowIndex === 1;
                case CellsLoadingConfiguration.NONE:
                    return false;
                case CellsLoadingConfiguration.RANDOM: {
                    const numColumns = Object.keys(bigSpaceRocks[0]).length;
                    return randomNumbers![rowIndex * numColumns + columnIndex] > 0.4;
                }
                default:
                    throw new Error(`Unexpected value: ${configuration}`);
            }
        },
        [configuration, randomNumbers],
    );

    const renderCell = useCallback(
        (rowIndex: number, columnIndex: number) => {
            const bigSpaceRock = bigSpaceRocks[rowIndex];
            return (
                <Cell loading={isLoading(rowIndex + 1, columnIndex + 1)}>
                    {bigSpaceRock[Object.keys(bigSpaceRock)[columnIndex]]}
                </Cell>
            );
        },
        [isLoading],
    );

    const renderColumnHeaderCell = useCallback(
        (columnIndex: number) => {
            const columnName = Object.keys(bigSpaceRocks[0])[columnIndex];
            return (
                <ColumnHeaderCell
                    loading={isLoading(0, columnIndex + 1)}
                    name={formatColumnName(columnName)}
                />
            );
        },
        [isLoading],
    );

    const renderRowHeaderCell = useCallback(
        (rowIndex: number) => (
            <RowHeaderCell loading={isLoading(rowIndex + 1, 0)} name={`${rowIndex + 1}`} />
        ),
        [isLoading],
    );

    const columns = useMemo(() => {
        return Array.from({ length: Object.keys(bigSpaceRocks[0]).length }, (_, index) => {
            const columnName = Object.keys(bigSpaceRocks[0])[index];
            const formattedColumnName = formatColumnName(columnName);
            return (
                <Column
                    key={formattedColumnName}
                    cellRenderer={renderCell}
                    columnHeaderCellRenderer={renderColumnHeaderCell}
                />
            );
        });
    }, [renderCell, renderColumnHeaderCell]);

    const options = useMemo(
        () => (
            <RadioGroup
                label="Example cell loading configurations"
                selectedValue={configuration}
                options={CONFIGURATIONS}
                onChange={handleConfigurationChange}
            />
        ),
        [configuration, handleConfigurationChange],
    );

    return (
        <Example options={options} showOptionsBelowExample={true} {...props}>
            <Table
                numRows={bigSpaceRocks.length}
                rowHeaderCellRenderer={renderRowHeaderCell}
                enableColumnInteractionBar={true}
            >
                {columns}
            </Table>
        </Example>
    );
};
