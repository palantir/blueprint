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

import { Example, type ExampleProps } from "@blueprintjs/docs-theme";
import { Cell, Column, Table, Utils } from "@blueprintjs/table";

const NUM_ROWS = 20;
const NUM_COLUMNS = 20;
const NUM_FROZEN_ROWS = 2;
const NUM_FROZEN_COLUMNS = 1;

const renderCell = (rowIndex: number, columnIndex: number) => (
    <Cell>{Utils.toBase26CellName(rowIndex, columnIndex)}</Cell>
);

const columns = Array.from({ length: NUM_COLUMNS }, (_, columnIndex) => (
    <Column
        key={columnIndex}
        name={`Column ${Utils.toBase26Alpha(columnIndex)}`}
        cellRenderer={renderCell}
    />
));

export const TableFreezingExample: React.FC<ExampleProps> = props => (
    <Example options={false} showOptionsBelowExample={true} {...props}>
        <Table
            numRows={NUM_ROWS}
            numFrozenRows={NUM_FROZEN_ROWS}
            numFrozenColumns={NUM_FROZEN_COLUMNS}
        >
            {columns}
        </Table>
    </Example>
);
