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

import { useCallback, useState } from "react";

import { Intent } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Column, ColumnHeaderCell, EditableCell, EditableName, Table } from "@blueprintjs/table";

function dataKey(rowIndex: number, columnIndex: number) {
    return `${rowIndex}-${columnIndex}`;
}

function isValidValue(value: string) {
    return /^[a-zA-Z]*$/.test(value);
}

const TableEditableExampleComponent: React.FC<ExampleProps> = props => {
    const [columnNames, setColumnNames] = useState(["Please", "Rename", "Me"]);
    const [sparseCellData, setSparseCellData] = useState<{ [key: string]: string }>({
        "1-1": "editable",
        "3-1": "validation 123",
    });
    const [sparseCellIntent, setSparseCellIntent] = useState<{ [key: string]: Intent | null }>({
        "3-1": Intent.DANGER,
    });
    const [sparseColumnIntents, setSparseColumnIntents] = useState<Array<Intent | null>>([]);

    const nameValidator = useCallback(
        (index: number) => (name: string) => {
            const intent = isValidValue(name) ? null : Intent.DANGER;
            setSparseColumnIntents(prev => {
                const values = prev.slice();
                values[index] = intent;
                return values;
            });
            setColumnNames(prev => {
                const values = prev.slice();
                values[index] = name;
                return values;
            });
        },
        [],
    );

    const nameSetter = useCallback(
        (index: number) => (name: string) => {
            setColumnNames(prev => {
                const values = prev.slice();
                values[index] = name;
                return values;
            });
        },
        [],
    );

    const cellValidator = useCallback((rowIndex: number, columnIndex: number) => {
        const key = dataKey(rowIndex, columnIndex);
        return (value: string) => {
            const intent = isValidValue(value) ? null : Intent.DANGER;
            setSparseCellIntent(prev => ({ ...prev, [key]: intent }));
            setSparseCellData(prev => ({ ...prev, [key]: value }));
        };
    }, []);

    const cellSetter = useCallback((rowIndex: number, columnIndex: number) => {
        const key = dataKey(rowIndex, columnIndex);
        return (value: string) => {
            const intent = isValidValue(value) ? null : Intent.DANGER;
            setSparseCellData(prev => ({ ...prev, [key]: value }));
            setSparseCellIntent(prev => ({ ...prev, [key]: intent }));
        };
    }, []);

    const renderCell = useCallback(
        (rowIndex: number, columnIndex: number) => {
            const key = dataKey(rowIndex, columnIndex);
            const value = sparseCellData[key];
            return (
                <EditableCell
                    value={value == null ? "" : value}
                    intent={sparseCellIntent[key] ?? undefined}
                    onCancel={cellValidator(rowIndex, columnIndex)}
                    onChange={cellValidator(rowIndex, columnIndex)}
                    onConfirm={cellSetter(rowIndex, columnIndex)}
                />
            );
        },
        [sparseCellData, sparseCellIntent, cellValidator, cellSetter],
    );

    const renderColumnHeader = useCallback(
        (columnIndex: number) => {
            const nameRenderer = (name: string) => (
                <EditableName
                    name={name}
                    intent={sparseColumnIntents[columnIndex] ?? undefined}
                    onChange={nameValidator(columnIndex)}
                    onCancel={nameValidator(columnIndex)}
                    onConfirm={nameSetter(columnIndex)}
                />
            );
            return <ColumnHeaderCell name={columnNames[columnIndex]} nameRenderer={nameRenderer} />;
        },
        [columnNames, sparseColumnIntents, nameValidator, nameSetter],
    );

    const columns = columnNames.map((_, index) => (
        <Column key={index} cellRenderer={renderCell} columnHeaderCellRenderer={renderColumnHeader} />
    ));

    return (
        <Example options={false} showOptionsBelowExample={true} {...props}>
            <Table numRows={7}>{columns}</Table>
        </Example>
    );
};

export const TableEditableExample = Object.assign(TableEditableExampleComponent, { dataKey });
