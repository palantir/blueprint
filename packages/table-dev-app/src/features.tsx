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

// tslint:disable:max-classes-per-file

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Button, Classes, H4, Intent, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";

import {
    Cell,
    Column,
    ColumnHeaderCell,
    CopyCellsMenuItem,
    EditableCell,
    EditableName,
    IColumnHeaderCellProps,
    IMenuContext,
    IRegion,
    JSONFormat,
    RegionCardinality,
    Regions,
    RowHeaderCell,
    SelectionModes,
    Table,
    Utils,
} from "@blueprintjs/table/src";

import { Nav } from "./nav";
ReactDOM.render(<Nav selected="features" />, document.getElementById("nav"));

function getTableComponent(numCols: number, numRows: number, columnProps?: any, tableProps?: any) {
    // combine table overrides
    const getCellClipboardData = (row: number, col: number) => {
        return Utils.toBase26Alpha(col) + (row + 1);
    };

    const tablePropsWithDefaults = { numRows, getCellClipboardData, enableFocusedCell: true, ...tableProps };

    // combine column overrides
    const columnPropsWithDefaults = {
        cellRenderer: (rowIndex: number, columnIndex: number) => {
            return <Cell>{Utils.toBase26Alpha(columnIndex) + (rowIndex + 1)}</Cell>;
        },
        ...columnProps,
    };
    const columns = Utils.times(numCols, index => {
        return <Column key={index} {...columnPropsWithDefaults} />;
    });
    return <Table {...tablePropsWithDefaults}>{columns}</Table>;
}

// tslint:disable:no-console jsx-no-lambda
const renderTestMenu = () => (
    <Menu>
        <MenuItem icon="export" onClick={() => console.log("Beam me up!")} text="Teleport" />
        <MenuItem icon="sort-alphabetical-desc" onClick={() => console.log("ZA is the worst")} text="Down with ZA!" />
        <MenuDivider />
        <MenuItem icon="curved-range-chart" onClick={() => console.log("You clicked the trident!")} text="Psi" />
    </Menu>
);
// tslint:enable:no-console jsx-no-lambda

ReactDOM.render(getTableComponent(3, 7), document.getElementById("table-0"));

class FormatsTable extends React.Component<{}, {}> {
    private static ROWS = 1000;

    private objects = Utils.times(FormatsTable.ROWS, (row: number) => {
        // tslint:disable-next-line:switch-default
        switch (row) {
            case 1:
                return "string";
            case 2:
                return 3.14;
            case 5:
                return undefined;
            case 6:
                return null;
            case 8:
                return "this is a very long string";
        }
        const obj: { [key: string]: string } = {};
        for (let i = 0; i < 1000; i++) {
            obj[`KEY-${(Math.random() * 10000).toFixed(2)}`] = (Math.random() * 10000).toFixed(2);
        }
        return obj;
    });

    private strings = Utils.times(FormatsTable.ROWS, () => "ABC " + Math.random() * 10000);
    private formatsTable: Table;

    public render() {
        const saveTable = (table: Table) => {
            this.formatsTable = table;
        };

        return (
            <Table ref={saveTable} numRows={FormatsTable.ROWS} enableRowResizing={true}>
                <Column name="Default" cellRenderer={this.renderDefaultCell} />
                <Column name="Wrapped Text" cellRenderer={this.renderDefaultCellWrapped} />
                <Column name="JSON" cellRenderer={this.renderJSONCell} />
                <Column name="JSON wrapped text" cellRenderer={this.renderJSONCellWrappedText} />
                <Column name="JSON wrapped cell" cellRenderer={this.renderJSONWrappedCell} />
            </Table>
        );
    }

    public componentDidMount() {
        document.querySelector(".resize-default").addEventListener("click", () => {
            this.formatsTable.resizeRowsByTallestCell(0);
        });
        document.querySelector(".resize-wrapped").addEventListener("click", () => {
            this.formatsTable.resizeRowsByTallestCell(1);
        });
        document.querySelector(".resize-json").addEventListener("click", () => {
            this.formatsTable.resizeRowsByTallestCell(2);
        });
        document.querySelector(".resize-json-wrapped").addEventListener("click", () => {
            this.formatsTable.resizeRowsByTallestCell(3);
        });
        document.querySelector(".resize-wrapped-and-json").addEventListener("click", () => {
            this.formatsTable.resizeRowsByTallestCell([1, 3]);
        });
        document.querySelector(".resize-viewport").addEventListener("click", () => {
            this.formatsTable.resizeRowsByTallestCell();
        });
    }

    private renderDefaultCell = (row: number) => <Cell>{this.strings[row]}</Cell>;
    private renderDefaultCellWrapped = (row: number) => <Cell wrapText={true}>{this.strings[row]}</Cell>;
    private renderJSONCell = (row: number) => (
        <Cell>
            <JSONFormat preformatted={true}>{this.objects[row]}</JSONFormat>
        </Cell>
    );
    private renderJSONCellWrappedText = (row: number) => (
        <Cell wrapText={true}>
            <JSONFormat preformatted={true}>{this.objects[row]}</JSONFormat>
        </Cell>
    );
    private renderJSONWrappedCell = (row: number) => (
        <Cell>
            <JSONFormat preformatted={false}>{this.objects[row]}</JSONFormat>
        </Cell>
    );
}

ReactDOM.render(<FormatsTable />, document.getElementById("table-formats"));

interface IEditableTableState {
    intents: Intent[];
    names: string[];
    sparseCellData: { [key: string]: string };
    sparseCellIntent: { [key: string]: Intent };
}

class EditableTable extends React.Component<{}, IEditableTableState> {
    public static dataKey = (rowIndex: number, columnIndex: number) => {
        return `${rowIndex}-${columnIndex}`;
    };

    public state: IEditableTableState = {
        intents: [],
        names: ["Please", "Rename", "Me"],
        sparseCellData: {},
        sparseCellIntent: {},
    };

    public render() {
        const columns = this.state.names.map((_, index) => (
            <Column key={index} cellRenderer={this.renderCell} columnHeaderCellRenderer={this.renderColumnHeader} />
        ));
        return (
            <Table
                numRows={7}
                selectionModes={SelectionModes.COLUMNS_AND_CELLS}
                enableFocusedCell={true}
                enableColumnInteractionBar={true}
            >
                {columns}
            </Table>
        );
    }

    public renderCell = (rowIndex: number, columnIndex: number) => {
        const dataKey = EditableTable.dataKey(rowIndex, columnIndex);
        const value = this.state.sparseCellData[dataKey];
        return (
            <EditableCell
                value={value == null ? "" : value}
                intent={this.state.sparseCellIntent[dataKey]}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                onCancel={this.cellValidator}
                onChange={this.cellValidator}
                onConfirm={this.cellSetter}
            />
        );
    };

    public renderColumnHeader = (columnIndex: number) => {
        const nameRenderer = (name: string) => {
            return (
                <EditableName
                    name={name}
                    index={columnIndex}
                    intent={this.state.intents[columnIndex]}
                    onChange={this.nameValidator}
                    onCancel={this.nameValidator}
                    onConfirm={this.nameSetter}
                />
            );
        };
        return (
            <ColumnHeaderCell
                menuRenderer={renderTestMenu}
                name={this.state.names[columnIndex]}
                nameRenderer={nameRenderer}
            />
        );
    };

    private isValidValue(value: string) {
        return /^[a-zA-Z]*$/.test(value);
    }

    private nameValidator = (name: string, index: number) => {
        const intent = this.isValidValue(name) ? null : Intent.DANGER;
        this.setArrayState("intents", index, intent);
        this.setArrayState("names", index, name);
    };

    private nameSetter = (name: string, index: number) => {
        this.setArrayState("names", index, name);
    };

    private cellValidator = (value: string, rowIndex: number, columnIndex: number) => {
        const dataKey = EditableTable.dataKey(rowIndex, columnIndex);
        const intent = this.isValidValue(value) ? null : Intent.DANGER;
        this.setSparseState("sparseCellIntent", dataKey, intent);
        this.setSparseState("sparseCellData", dataKey, value);
    };

    private cellSetter = (value: string, rowIndex: number, columnIndex: number) => {
        const dataKey = EditableTable.dataKey(rowIndex, columnIndex);
        const intent = this.isValidValue(value) ? null : Intent.DANGER;
        this.setSparseState("sparseCellData", dataKey, value);
        this.setSparseState("sparseCellIntent", dataKey, intent);
    };

    private setArrayState<T>(key: string, index: number, value: T) {
        const values = (this.state as any)[key].slice() as T[];
        values[index] = value;
        // TS doesn't know how to type-check parameterized string-literal keys,
        // so we have to cast to `any`. TS issue:
        // https://github.com/Microsoft/TypeScript/issues/15534
        this.setState({ [key]: values } as any);
    }

    private setSparseState<T>(stateKey: string, dataKey: string, value: T) {
        const stateData = (this.state as any)[stateKey] as { [key: string]: T };
        const values = { ...stateData, [dataKey]: value };
        this.setState({ [stateKey]: values } as any);
    }
}

ReactDOM.render(<EditableTable />, document.getElementById("table-editable-names"));

ReactDOM.render(
    getTableComponent(
        2,
        2,
        {},
        {
            enableGhostCells: true,
            selectionModes: SelectionModes.ALL,
        },
    ),
    document.getElementById("table-ghost"),
);

ReactDOM.render(
    getTableComponent(
        2,
        2,
        {},
        {
            enableGhostCells: true,
            selectionModes: SelectionModes.ALL,
        },
    ),
    document.getElementById("table-inline-ghost"),
);

ReactDOM.render(
    getTableComponent(
        200,
        100 * 1000,
        {},
        {
            enableGhostCells: true,
            selectionModes: SelectionModes.ALL,
        },
    ),
    document.getElementById("table-big"),
);

class RowSelectableTable extends React.Component<{}, {}> {
    public state = {
        selectedRegions: [Regions.row(2)],
    };

    public render() {
        return (
            <div>
                <Table
                    bodyContextMenuRenderer={bodyContextMenuRenderer}
                    numRows={7}
                    enableRowHeader={false}
                    onSelection={this.handleSelection}
                    selectedRegions={this.state.selectedRegions}
                    selectedRegionTransform={this.selectedRegionTransform}
                >
                    <Column name="Cells" />
                    <Column name="Select" />
                    <Column name="Rows" />
                </Table>
                <br />
                <Button onClick={this.handleClear} intent={Intent.PRIMARY}>
                    Clear Selection
                </Button>
            </div>
        );
    }

    private handleClear = () => {
        this.setState({ selectedRegions: [] });
    };

    private handleSelection = (selectedRegions: IRegion[]) => {
        this.setState({ selectedRegions });
    };

    private selectedRegionTransform = (region: IRegion) => {
        // convert cell selection to row selection
        if (Regions.getRegionCardinality(region) === RegionCardinality.CELLS) {
            return Regions.row(region.rows[0], region.rows[1]);
        }

        return region;
    };
}

ReactDOM.render(<RowSelectableTable />, document.getElementById("table-select-rows"));

document.getElementById("table-ledger").classList.add(Classes.HTML_TABLE_STRIPED);

ReactDOM.render(getTableComponent(3, 7, {}, { className: "" }), document.getElementById("table-ledger"));

class AdjustableColumnsTable extends React.Component<{}, {}> {
    public state = {
        columns: [<Column name="First" key={0} id={0} />, <Column name="Second" key={1} id={1} />],
    };

    public render() {
        return <Table numRows={7}>{this.state.columns}</Table>;
    }

    public componentDidMount() {
        document.querySelector(".add-column-button").addEventListener("click", () => {
            this.add();
        });
        document.querySelector(".remove-column-button").addEventListener("click", () => {
            this.remove();
        });
        document.querySelector(".swap-columns-button").addEventListener("click", () => {
            this.swap(0, 1);
        });
    }

    private add() {
        const columns = this.state.columns.slice();
        columns.push(<Column key={columns.length} id={columns.length} />);
        this.setState({ columns });
    }

    private remove() {
        if (this.state.columns.length <= 2) {
            return;
        }
        const columns = this.state.columns.slice();
        columns.pop();
        this.setState({ columns });
    }

    private swap(a: number, b: number) {
        const columns = this.state.columns.slice();
        const tmpCol = columns[a];
        columns[a] = columns[b];
        columns[b] = tmpCol;
        this.setState({ columns });
    }
}

ReactDOM.render(<AdjustableColumnsTable />, document.getElementById("table-cols"));

const intentRows: Intent[] = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER];

ReactDOM.render(
    getTableComponent(
        3,
        7,
        {
            cellRenderer(rowIndex: number, columnIndex: number) {
                return <Cell intent={intentRows[rowIndex]}>{Utils.toBase26Alpha(columnIndex) + (rowIndex + 1)}</Cell>;
            },
        },
        {
            enableColumnResizing: false,
            enableRowResizing: false,
            selectionModes: SelectionModes.NONE,
        },
    ),
    document.getElementById("table-1"),
);

const bodyContextMenuRenderer = (context: IMenuContext) => {
    const getCellData = (row: number, col: number) => {
        return Utils.toBase26Alpha(col) + (row + 1);
    };

    return (
        <Menu>
            <CopyCellsMenuItem context={context} getCellData={getCellData} text="Copy Cells" />
        </Menu>
    );
};

ReactDOM.render(
    getTableComponent(
        3,
        7,
        {},
        {
            bodyContextMenuRenderer,
            enableColumnResizing: true,
            enableMultipleSelection: true,
            enableRowResizing: true,
            selectionModes: SelectionModes.ALL,
        },
    ),
    document.getElementById("table-2"),
);

ReactDOM.render(
    getTableComponent(
        3,
        7,
        {},
        {
            defaultColumnWidth: 60,
            enableRowHeader: false,
        },
    ),
    document.getElementById("table-3"),
);

const customRowHeaders = ["Superman", "Harry James Potter", "Deadpool", "Ben Folds", "Bitcoin", "Thorsday", "."];
ReactDOM.render(
    getTableComponent(
        3,
        7,
        {},
        {
            renderRowHeaderCell: (rowIndex: number) => {
                return <RowHeaderCell name={customRowHeaders[rowIndex]} />;
            },
        },
    ),
    document.getElementById("table-4"),
);

ReactDOM.render(
    getTableComponent(
        3,
        7,
        {
            columnHeaderCellRenderer: (columnIndex: number) => {
                return <ColumnHeaderCell name={Utils.toBase26Alpha(columnIndex)} isActive={columnIndex % 3 === 0} />;
            },
        },
        {
            styledRegionGroups: [
                {
                    className: "my-group",
                    regions: [Regions.cell(0, 0), Regions.row(2), Regions.cell(1, 2, 5, 2)],
                },
            ],
        },
    ),
    document.getElementById("table-5"),
);

ReactDOM.render(
    getTableComponent(
        10,
        70,
        {
            columnHeaderCellRenderer: (columnIndex: number) => {
                const alpha = Utils.toBase26Alpha(columnIndex);
                return (
                    <ColumnHeaderCell
                        name={`${alpha} Column with a substantially long header name`}
                        menuRenderer={renderTestMenu}
                    >
                        <H4>Header {alpha}</H4>
                        <p>Whatever interactive header content goes here lorem ipsum.</p>
                    </ColumnHeaderCell>
                );
            },
        },
        {
            renderRowHeaderCell: (rowIndex: number) => {
                return <RowHeaderCell name={`${rowIndex + 1}`} menuRenderer={renderTestMenu} />;
            },
        },
    ),
    document.getElementById("table-6"),
);

class CustomHeaderCell extends React.Component<IColumnHeaderCellProps, {}> {
    public render() {
        return <ColumnHeaderCell {...this.props}>Hey dawg.</ColumnHeaderCell>;
    }
}

ReactDOM.render(
    getTableComponent(
        2,
        5,
        {
            columnHeaderCellRenderer: () => <CustomHeaderCell name="sup" />,
        },
        {
            enableMultipleSelection: false,
        },
    ),
    document.getElementById("table-7"),
);

const longContentRenderCell = () => {
    const long = "This-is-an-example-of-long-content-that-we-don't-want-to-wrap";
    return <Cell tooltip={long}>{long}</Cell>;
};

ReactDOM.render(
    <Table numRows={4}>
        <Column name="My" />
        <Column name="Table" cellRenderer={longContentRenderCell} />
    </Table>,
    document.getElementById("table-8"),
);

ReactDOM.render(
    <div style={{ position: "relative" }}>
        <div style={{ zIndex: 0 }} className="stack-fill">
            Z = 0
        </div>
        <div style={{ zIndex: 1 }} className="stack-fill">
            Z = 1
        </div>
        <div style={{ zIndex: 2 }} className="stack-fill">
            <br />Z = 2
        </div>
        <Table numRows={3}>
            <Column name="A" />
            <Column name="B" />
            <Column name="C" />
        </Table>
        <div className="stack-fill">
            <br />
            <br />
            after
        </div>
    </div>,
    document.getElementById("table-9"),
);

interface IReorderableTableExampleState {
    children?: JSX.Element[];
    data?: any[];
}

const REORDERABLE_TABLE_DATA = [
    ["A", "Apple", "Ape", "Albania", "Anchorage"],
    ["B", "Banana", "Boa", "Brazil", "Boston"],
    ["C", "Cranberry", "Cougar", "Croatia", "Chicago"],
    ["D", "Dragonfruit", "Deer", "Denmark", "Denver"],
    ["E", "Eggplant", "Elk", "Eritrea", "El Paso"],
].map(([letter, fruit, animal, country, city]) => ({ letter, fruit, animal, country, city }));

class ReorderableTableExample extends React.Component<{}, IReorderableTableExampleState> {
    public state: IReorderableTableExampleState = {
        data: REORDERABLE_TABLE_DATA,
    };

    public componentDidMount() {
        const children = [
            <Column key="1" name="Letter" cellRenderer={this.renderLetterCell} />,
            <Column key="2" name="Fruit" cellRenderer={this.renderFruitCell} />,
            <Column key="3" name="Animal" cellRenderer={this.renderAnimalCell} />,
            <Column key="4" name="Country" cellRenderer={this.renderCountryCell} />,
            <Column key="5" name="City" cellRenderer={this.renderCityCell} />,
        ];
        this.setState({ children });
    }

    public render() {
        return (
            <Table
                enableColumnReordering={true}
                enableRowReordering={true}
                numRows={this.state.data.length}
                onColumnsReordered={this.handleColumnsReordered}
                onRowsReordered={this.handleRowsReordered}
            >
                {this.state.children}
            </Table>
        );
    }

    private renderLetterCell = (row: number) => <Cell>{this.state.data[row].letter}</Cell>;
    private renderFruitCell = (row: number) => <Cell>{this.state.data[row].fruit}</Cell>;
    private renderAnimalCell = (row: number) => <Cell>{this.state.data[row].animal}</Cell>;
    private renderCountryCell = (row: number) => <Cell>{this.state.data[row].country}</Cell>;
    private renderCityCell = (row: number) => <Cell>{this.state.data[row].city}</Cell>;

    private handleColumnsReordered = (oldIndex: number, newIndex: number, length: number) => {
        if (oldIndex === newIndex) {
            return;
        }
        const nextChildren = Utils.reorderArray(this.state.children, oldIndex, newIndex, length);
        this.setState({ children: nextChildren });
    };

    private handleRowsReordered = (oldIndex: number, newIndex: number, length: number) => {
        if (oldIndex === newIndex) {
            return;
        }
        this.setState({ data: Utils.reorderArray(this.state.data, oldIndex, newIndex, length) });
    };
}

ReactDOM.render(<ReorderableTableExample />, document.getElementById("table-10"));
