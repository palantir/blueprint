/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 *
 * Demonstrates sample usage of the table component.
 */

// tslint:disable:max-classes-per-file

import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    Button,
    Intent,
    Menu,
    MenuDivider,
    MenuItem,
} from "@blueprintjs/core";

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
} from "../src/index";

import { Nav } from "./nav";
ReactDOM.render(<Nav selected="index" />, document.getElementById("nav"));

function getTableComponent(numCols: number, numRows: number, columnProps?: any, tableProps?: any) {
    // combine table overrides
    const getCellClipboardData = (row: number, col: number) => {
        return Utils.toBase26Alpha(col) + (row + 1);
    };

    const tablePropsWithDefaults = {numRows, getCellClipboardData, allowFocus: true, ...tableProps};

    // combine column overrides
    const columnPropsWithDefaults = {
        renderCell: (rowIndex: number, columnIndex: number) => {
            return <Cell>{Utils.toBase26Alpha(columnIndex) + (rowIndex + 1)}</Cell>;
        },
        ...columnProps,
    };
    const columns = Utils.times(numCols, (index) => {
        return <Column key={index} {...columnPropsWithDefaults} />;
    });
    return <Table {...tablePropsWithDefaults}>{columns}</Table>;
};

// tslint:disable:no-console jsx-no-lambda
const testMenu = (
    <Menu>
        <MenuItem
            iconName="export"
            onClick={() => console.log("Beam me up!")}
            text="Teleport"
        />
        <MenuItem
            iconName="sort-alphabetical-desc"
            onClick={() => console.log("ZA is the worst")}
            text="Down with ZA!"
        />
        <MenuDivider />
        <MenuItem
            iconName="curved-range-chart"
            onClick={() => console.log("You clicked the trident!")}
            text="Psi"
        />
    </Menu>
);
// tslint:enable:no-console jsx-no-lambda

ReactDOM.render(
    getTableComponent(3, 7),
    document.getElementById("table-0"),
);

class FormatsTable extends React.Component<{}, {}> {
    private static ROWS = 1000;

    private objects = Utils.times(FormatsTable.ROWS, (row: number) => {
        // tslint:disable-next-line:switch-default
        switch (row) {
            case 1: return "string";
            case 2: return 3.14;
            case 5: return undefined;
            case 6: return null;
            case 8: return "this is a very long string";
        }
        const obj: {[key: string]: string} = {};
        for (let i = 0; i < 1000; i++) {
            obj[`KEY-${(Math.random() * 10000).toFixed(2)}`] = (Math.random() * 10000).toFixed(2);
        }
        return obj;
    });

    private strings = Utils.times(FormatsTable.ROWS, () => ("ABC " + (Math.random() * 10000)));

    public render() {
        return (
            <Table numRows={FormatsTable.ROWS} isRowResizable={true}>
                <Column name="Default" renderCell={this.renderDefaultCell}/>
                <Column name="Wrapped Text" renderCell={this.renderDefaultCellWrapped}/>
                <Column name="JSON" renderCell={this.renderJSONCell}/>
                <Column name="JSON wrapped text" renderCell={this.renderJSONCellWrappedText}/>
                <Column name="JSON wrapped cell" renderCell={this.renderJSONWrappedCell}/>
            </Table>
        );
    }

    private renderDefaultCell = (row: number) => <Cell>{this.strings[row]}</Cell>;
    private renderDefaultCellWrapped = (row: number) => <Cell wrapText={true}>{this.strings[row]}</Cell>;
    private renderJSONCell = (row: number) =>
        <Cell><JSONFormat preformatted={true}>{this.objects[row]}</JSONFormat></Cell>;
    private renderJSONCellWrappedText = (row: number) =>
        <Cell wrapText={true}><JSONFormat preformatted={true}>{this.objects[row]}</JSONFormat></Cell>;
    private renderJSONWrappedCell = (row: number) =>
        <Cell><JSONFormat preformatted={false}>{this.objects[row]}</JSONFormat></Cell>;
}

ReactDOM.render(
    <FormatsTable />,
    document.getElementById("table-formats"),
);

class EditableTable extends React.Component<{}, {}> {
    public static dataKey = (rowIndex: number, columnIndex: number) => {
        return `${rowIndex}-${columnIndex}`;
    }

    public state = {
        intents : [] as Intent[],
        names: [
            "Please",
            "Rename",
            "Me",
        ] as string[],
        sparseCellData : {} as {[key: string]: string},
        sparseCellIntent : {} as {[key: string]: Intent},
    };
    public render() {
        const columns = this.state.names.map((_, index) => (
            <Column key={index} renderCell={this.renderCell} renderColumnHeader={this.renderColumnHeader} />
        ));
        return (
            <Table numRows={7} selectionModes={SelectionModes.COLUMNS_AND_CELLS} allowFocus={true}>
                {columns}
            </Table>
        );
    }

    public renderCell = (rowIndex: number, columnIndex: number) => {
        const dataKey = EditableTable.dataKey(rowIndex, columnIndex);
        const value = this.state.sparseCellData[dataKey];
        return (<EditableCell
            value={value == null ? "" : value}
            intent={this.state.sparseCellIntent[dataKey]}
            onCancel={this.cellValidator(rowIndex, columnIndex)}
            onChange={this.cellValidator(rowIndex, columnIndex)}
            onConfirm={this.cellSetter(rowIndex, columnIndex)}
        />);
    }

    public renderColumnHeader = (columnIndex: number) => {
        const renderName = (name: string) => {
            return (<EditableName
                name={name}
                intent={this.state.intents[columnIndex]}
                onChange={this.nameValidator(columnIndex)}
                onCancel={this.nameValidator(columnIndex)}
                onConfirm={this.nameSetter(columnIndex)}
            />);
        };
        return (<ColumnHeaderCell
            menu={testMenu}
            name={this.state.names[columnIndex]}
            renderName={renderName}
            useInteractionBar={true}
        />);
    }

    private isValidValue(value: string) {
        return /^[a-zA-Z]*$/.test(value);
    }

    private nameValidator = (index: number) => {
        return (name: string) => {
            const intent = this.isValidValue(name) ? null : Intent.DANGER;
            this.setArrayState("intents", index, intent);
            this.setArrayState("names", index, name);
        };
    }

    private nameSetter = (index: number) => {
        return (name: string) => {
            this.setArrayState("names", index, name);
        };
    }

    private cellValidator = (rowIndex: number, columnIndex: number) => {
        const dataKey = EditableTable.dataKey(rowIndex, columnIndex);
        return (value: string) => {
            const intent = this.isValidValue(value) ? null : Intent.DANGER;
            this.setSparseState("sparseCellIntent", dataKey, intent);
            this.setSparseState("sparseCellData", dataKey, value);
        };
    }

    private cellSetter = (rowIndex: number, columnIndex: number) => {
        const dataKey = EditableTable.dataKey(rowIndex, columnIndex);
        return (value: string) => {
            const intent = this.isValidValue(value) ? null : Intent.DANGER;
            this.setSparseState("sparseCellData", dataKey, value);
            this.setSparseState("sparseCellIntent", dataKey, intent);
        };
    }

    private setArrayState<T>(key: string, index: number, value: T)  {
        const values = (this.state as any)[key].slice() as T[];
        values[index] = value;
        this.setState({ [key] : values });
    }

    private setSparseState<T>(stateKey: string, dataKey: string, value: T)  {
        const stateData = (this.state as any)[stateKey] as { [key: string]: T };
        const values = { ...stateData, [dataKey]: value };
        this.setState({ [stateKey] : values });
    }
}

ReactDOM.render(
    <EditableTable />,
    document.getElementById("table-editable-names"),
);

ReactDOM.render(
    getTableComponent(2, 2, {}, {
        fillBodyWithGhostCells: true,
        selectionModes: SelectionModes.ALL,
    }),
    document.getElementById("table-ghost"),
);

ReactDOM.render(
    getTableComponent(2, 2, {}, {
        fillBodyWithGhostCells: true,
        selectionModes: SelectionModes.ALL,
    }),
    document.getElementById("table-inline-ghost"),
);

ReactDOM.render(
    getTableComponent(200, 100 * 1000, {} , {
        fillBodyWithGhostCells: true,
        selectionModes: SelectionModes.ALL,
    }),
    document.getElementById("table-big"),
);

class RowSelectableTable extends React.Component<{}, {}> {
    public state = {
        selectedRegions: [ Regions.row(2) ],
    };

    public render() {
        return (<div>
            <Table
                renderBodyContextMenu={renderBodyContextMenu}
                numRows={7}
                isRowHeaderShown={false}
                onSelection={this.handleSelection}
                selectedRegions={this.state.selectedRegions}
                selectedRegionTransform={this.selectedRegionTransform}
            >
                <Column name="Cells" />
                <Column name="Select" />
                <Column name="Rows" />
            </Table>
            <br/>
            <Button onClick={this.handleClear} intent={Intent.PRIMARY}>Clear Selection</Button>
        </div>);
    }

    private handleClear = () => {
        this.setState({ selectedRegions: [] });
    }

    private handleSelection = (selectedRegions: IRegion[]) => {
        this.setState({ selectedRegions });
    }

    private selectedRegionTransform = (region: IRegion) => {
        // convert cell selection to row selection
        if (Regions.getRegionCardinality(region) === RegionCardinality.CELLS) {
            return Regions.row(region.rows[0], region.rows[1]);
        }

        return region;
    }
}

ReactDOM.render(
    <RowSelectableTable/>,
    document.getElementById("table-select-rows"),
);

document.getElementById("table-ledger").classList.add("bp-table-striped");

ReactDOM.render(
    getTableComponent(3, 7, {}, { className: "" }),
    document.getElementById("table-ledger"),
);

class AdjustableColumnsTable extends React.Component<{}, {}> {
    public state = {
        columns: [
            <Column name="First" key={0} id={0}/>,
            <Column name="Second" key={1} id={1}/>,
        ],
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
        columns.push(<Column key={columns.length} id={columns.length}/>);
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

ReactDOM.render(
    <AdjustableColumnsTable />,
    document.getElementById("table-cols"),
);

ReactDOM.render(
    getTableComponent(3, 7, {
        renderCell(rowIndex: number, columnIndex: number) {
            return <Cell intent={rowIndex as Intent}>{Utils.toBase26Alpha(columnIndex) + (rowIndex + 1)}</Cell>;
        },
    }, {
        isColumnResizable: false,
        isRowResizable: false,
        selectionModes: SelectionModes.NONE,
    }),
    document.getElementById("table-1"),
);

const renderBodyContextMenu = (context: IMenuContext) => {
    const getCellData = (row: number, col: number) => {
        return Utils.toBase26Alpha(col) + (row + 1);
    };

    return (
        <Menu>
            <CopyCellsMenuItem
                context={context}
                getCellData={getCellData}
                text="Copy Cells"
            />
        </Menu>
    );
};

ReactDOM.render(
    getTableComponent(3, 7, {}, {
        allowMultipleSelection: true,
        isColumnResizable: true,
        isRowResizable: true,
        renderBodyContextMenu,
        selectionModes: SelectionModes.ALL,
    }),
    document.getElementById("table-2"),
);

ReactDOM.render(
    getTableComponent(3, 7, {}, {
        defaultColumnWidth: 60,
        isRowHeaderShown: false,
    }),
    document.getElementById("table-3"),
);

const customRowHeaders = [
    "Superman",
    "Harry James Potter",
    "Deadpool",
    "Ben Folds",
    "Bitcoin",
    "Thorsday",
    ".",
];
ReactDOM.render(
    getTableComponent(3, 7, {}, {
        renderRowHeaderCell: (rowIndex: number) => {
            return <RowHeaderCell name={customRowHeaders[rowIndex]} />;
        },
    }),
    document.getElementById("table-4"),
);

ReactDOM.render(
    getTableComponent(3, 7, {
        renderColumnHeader: (columnIndex: number) => {
            return <ColumnHeaderCell name={Utils.toBase26Alpha(columnIndex)} isActive={columnIndex % 3 === 0} />;
        },
    }, {
        styledRegionGroups: [
            {
                className: "my-group",
                regions: [
                    Regions.cell(0, 0),
                    Regions.row(2),
                    Regions.cell(1, 2, 5, 2),
                ],
            },
        ],
    }),
    document.getElementById("table-5"),
);

ReactDOM.render(
    getTableComponent(10, 70, {
        renderColumnHeader: (columnIndex: number) => {
            const alpha = Utils.toBase26Alpha(columnIndex);
            return (
                <ColumnHeaderCell name={`${alpha} Column with a substantially long header name`} menu={testMenu}>
                    <h4>Header {alpha}</h4>
                    <p>Whatever interactive header content goes here lorem ipsum.</p>
                </ColumnHeaderCell>
            );
        },
    }, {
        renderRowHeaderCell : (rowIndex: number) => {
            return <RowHeaderCell name={`${rowIndex + 1}`} menu={testMenu} />;
        },
    }),
    document.getElementById("table-6"),
);

class CustomHeaderCell extends React.Component<IColumnHeaderCellProps, {}> {
    public render() {
        return (
            <ColumnHeaderCell {...this.props}>
                Hey dawg.
            </ColumnHeaderCell>
        );
    }
}

ReactDOM.render(
    getTableComponent(2, 5, {
        renderColumnHeader: () => <CustomHeaderCell name="sup"/>,
    }, {
        allowMultipleSelection: false,
    }),
    document.getElementById("table-7"),
);

const longContentRenderCell = () => {
    const long = "This-is-an-example-of-long-content-that-we-don't-want-to-wrap";
    return <Cell tooltip={long}>{long}</Cell>;
};

ReactDOM.render(
    <Table numRows={4}>
        <Column name="My" />
        <Column name="Table" renderCell={longContentRenderCell}/>
    </Table>,
    document.getElementById("table-8"),
);

ReactDOM.render(
    <div style={{position: "relative"}}>
        <div style={{zIndex: 0}} className="stack-fill">Z = 0</div>
        <div style={{zIndex: 1}} className="stack-fill">Z = 1</div>
        <div style={{zIndex: 2}} className="stack-fill"><br/>Z = 2</div>
        <Table numRows={3}>
            <Column name="A"/>
            <Column name="B"/>
            <Column name="C"/>
        </Table>
        <div className="stack-fill"><br/><br/>after</div>
    </div>,
    document.getElementById("table-9"),
);
