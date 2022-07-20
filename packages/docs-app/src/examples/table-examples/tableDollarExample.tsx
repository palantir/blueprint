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

import { Classes } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Cell, Column, ColumnHeaderCell, Table2 } from "@blueprintjs/table";

// this will obviously get outdated, it's valid only as of August 2021
const USD_TO_EURO_CONVERSION = 0.85;

export class TableDollarExample extends React.PureComponent<IExampleProps> {
    public render() {
        const dollarCellRenderer = (rowIndex: number) => <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
        const euroCellRenderer = (rowIndex: number) => (
            <Cell>{`€${(rowIndex * 10 * USD_TO_EURO_CONVERSION).toFixed(2)}`}</Cell>
        );
        return (
            <Example options={false} showOptionsBelowExample={true} {...this.props}>
                <Table2 numRows={20} enableGhostCells={true} enableFocusedCell={true}>
                    <Column cellRenderer={dollarCellRenderer} columnHeaderCellRenderer={renderColumnHeader} />
                    <Column cellRenderer={euroCellRenderer} columnHeaderCellRenderer={renderColumnHeader} />
                </Table2>
            </Example>
        );
    }
}

function renderColumnHeader(index: number) {
    const name = ["Dollars", "Euros"][index]!;
    return <ColumnHeaderCell name={name} index={index} nameRenderer={renderName} />;
}

function renderName(name: string) {
    return (
        <div style={{ lineHeight: "24px" }}>
            <div className={Classes.TEXT_LARGE}>
                <strong>{name}</strong>
            </div>
            <div className={Classes.MONOSPACE_TEXT}>Number</div>
        </div>
    );
}
