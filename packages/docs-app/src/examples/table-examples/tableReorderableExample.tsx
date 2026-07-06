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

import { Children, cloneElement, useCallback, useEffect, useRef, useState } from "react";

import { Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Cell, Column, Table, Utils } from "@blueprintjs/table";

type ReorderableRow = { animal: string; city: string; country: string; fruit: string; letter: string };

const REORDERABLE_TABLE_DATA: ReorderableRow[] = [
    ["A", "Apple", "Ape", "Albania", "Anchorage"],
    ["B", "Banana", "Boa", "Brazil", "Boston"],
    ["C", "Cranberry", "Cougar", "Croatia", "Chicago"],
    ["D", "Dragonfruit", "Deer", "Denmark", "Denver"],
    ["E", "Eggplant", "Elk", "Eritrea", "El Paso"],
].map(([letter, fruit, animal, country, city]) => ({ animal, city, country, fruit, letter }));

export const TableReorderableExample: React.FC<ExampleProps> = props => {
    const dataRef = useRef(REORDERABLE_TABLE_DATA);
    const [data, setData] = useState(REORDERABLE_TABLE_DATA);
    const [enableColumnInteractionBar, setEnableColumnInteractionBar] = useState(false);

    dataRef.current = data;

    const getCellRenderer = useCallback(
        (key: keyof ReorderableRow) => (row: number) => <Cell>{dataRef.current[row][key]}</Cell>,
        [],
    );

    const [columns, setColumns] = useState(() => [
        <Column key="1" name="Letter" cellRenderer={getCellRenderer("letter")} />,
        <Column key="2" name="Fruit" cellRenderer={getCellRenderer("fruit")} />,
        <Column key="3" name="Animal" cellRenderer={getCellRenderer("animal")} />,
        <Column key="4" name="Country" cellRenderer={getCellRenderer("country")} />,
        <Column key="5" name="City" cellRenderer={getCellRenderer("city")} />,
    ]);

    useEffect(() => {
        setColumns(prev =>
            Children.map(prev, (column: React.JSX.Element) =>
                cloneElement(column, { enableColumnInteractionBar }),
            ) ?? [],
        );
    }, [enableColumnInteractionBar]);

    const handleColumnsReordered = useCallback((oldIndex: number, newIndex: number, length: number) => {
        if (oldIndex === newIndex) {
            return;
        }
        setColumns(prev => Utils.reorderArray(prev, oldIndex, newIndex, length));
    }, []);

    const handleRowsReordered = useCallback((oldIndex: number, newIndex: number, length: number) => {
        if (oldIndex === newIndex) {
            return;
        }
        setData(prev => Utils.reorderArray(prev, oldIndex, newIndex, length));
    }, []);

    const options = (
        <Switch
            checked={enableColumnInteractionBar}
            label="Interaction bar"
            onChange={handleBooleanChange(setEnableColumnInteractionBar)}
        />
    );

    return (
        <Example options={options} showOptionsBelowExample={true} {...props}>
            <Table
                enableColumnReordering={true}
                enableColumnResizing={false}
                enableRowReordering={true}
                enableRowResizing={false}
                numRows={data.length}
                onColumnsReordered={handleColumnsReordered}
                onRowsReordered={handleRowsReordered}
                enableColumnInteractionBar={enableColumnInteractionBar}
            >
                {columns}
            </Table>
        </Example>
    );
};
