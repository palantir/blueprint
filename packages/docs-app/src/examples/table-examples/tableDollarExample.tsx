/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Cell, Column, Table } from "@blueprintjs/table";

export class TableDollarExample extends React.PureComponent<IExampleProps> {
    public render() {
        const cellRenderer = (rowIndex: number) => <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
        return (
            <Example options={false} showOptionsBelowExample={true} {...this.props}>
                <Table numRows={10}>
                    <Column name="Dollars" cellRenderer={cellRenderer} />
                </Table>
            </Example>
        );
    }
}
