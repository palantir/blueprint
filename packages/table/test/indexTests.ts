/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { expect } from "chai";

import * as tableExports from "../src";

describe("@blueprintjs/table", () => {
    interface IKnownKeysMap {
        [key: string]: boolean;
    }

    const knownKeys: IKnownKeysMap = {};

    describe("Exports all expected values", () => {
        runValueExportTest("Cell", tableExports.Cell);
        runValueExportTest("Clipboard", tableExports.Clipboard);
        runValueExportTest("Column", tableExports.Column);
        runValueExportTest("ColumnHeaderCell", tableExports.ColumnHeaderCell);
        runValueExportTest("ColumnLoadingOption", tableExports.ColumnLoadingOption);
        runValueExportTest("CopyCellsMenuItem", tableExports.CopyCellsMenuItem);
        runValueExportTest("Draggable", tableExports.Draggable);
        runValueExportTest("DragSelectable", tableExports.DragSelectable);
        runValueExportTest("EditableCell", tableExports.EditableCell);
        runValueExportTest("EditableName", tableExports.EditableName);
        runValueExportTest("Grid", tableExports.Grid);
        runValueExportTest("HorizontalCellDivider", tableExports.HorizontalCellDivider);
        runValueExportTest("JSONFormat", tableExports.JSONFormat);
        runValueExportTest("Orientation", tableExports.Orientation);
        runValueExportTest("Rect", tableExports.Rect);
        runValueExportTest("RegionCardinality", tableExports.RegionCardinality);
        runValueExportTest("Regions", tableExports.Regions);
        runValueExportTest("RenderMode", tableExports.RenderMode);
        runValueExportTest("ResizeHandle", tableExports.ResizeHandle);
        runValueExportTest("RowHeaderCell", tableExports.RowHeaderCell);
        runValueExportTest("RowLoadingOption", tableExports.RowLoadingOption);
        runValueExportTest("SelectionModes", tableExports.SelectionModes);
        runValueExportTest("Table", tableExports.Table);
        runValueExportTest("TableLoadingOption", tableExports.TableLoadingOption);
        runValueExportTest("TruncatedFormat", tableExports.TruncatedFormat);
        runValueExportTest("TruncatedPopoverMode", tableExports.TruncatedPopoverMode);
        runValueExportTest("Utils", tableExports.Utils);
    });

    describe("Exports all expected types", () => {
        runTypeExportTest<tableExports.ICellInterval>("ICellInterval");
        runTypeExportTest<tableExports.ICellProps>("ICellProps");
        runTypeExportTest<tableExports.ICellRenderer>("ICellRenderer");
        runTypeExportTest<tableExports.IClientCoordinates>("IClientCoordinates");
        runTypeExportTest<tableExports.IColumnHeaderCellProps>("IColumnHeaderCellProps");
        runTypeExportTest<tableExports.IColumnHeaderRenderer>("IColumnHeaderRenderer");
        runTypeExportTest<tableExports.IColumnProps>("IColumnProps");
        runTypeExportTest<tableExports.IContextMenuRenderer>("IContextMenuRenderer");
        runTypeExportTest<tableExports.ICoordinateData>("ICoordinateData");
        runTypeExportTest<tableExports.IDraggableProps>("IDraggableProps");
        runTypeExportTest<tableExports.IDragHandler>("IDragHandler");
        runTypeExportTest<tableExports.IDragSelectableProps>("IDragSelectableProps");
        runTypeExportTest<tableExports.IEditableCellProps>("IEditableCellProps");
        runTypeExportTest<tableExports.IEditableNameProps>("IEditableNameProps");
        runTypeExportTest<tableExports.IJSONFormatProps>("IJSONFormatProps");
        runTypeExportTest<tableExports.ILockableLayout>("ILockableLayout");
        runTypeExportTest<tableExports.IMenuContext>("IMenuContext");
        runTypeExportTest<tableExports.IRegion>("IRegion");
        runTypeExportTest<tableExports.IResizeHandleProps>("IResizeHandleProps");
        runTypeExportTest<tableExports.IRowHeaderCellProps>("IRowHeaderCellProps");
        runTypeExportTest<tableExports.ISelectableProps>("ISelectableProps");
        runTypeExportTest<tableExports.IStyledRegionGroup>("IStyledRegionGroup");
        runTypeExportTest<tableExports.ITableProps>("ITableProps");
        runTypeExportTest<tableExports.ITruncatedFormatProps>("ITruncatedFormatProps");
    });

    it("[meta] has tested each exported key", () => {
        let didFindUntestedKey = false;
        Object.keys(tableExports).forEach((exportedKey) => {
            if (knownKeys[exportedKey]) {
                didFindUntestedKey = false;
            }
        });
        expect(didFindUntestedKey).to.be.false;
    });

    function runValueExportTest(valueName: string, value: any) {
        it(`${valueName}`, () => {
            knownKeys[valueName] = true;
            expect(typeof value !== "undefined").to.be.true;
        });
    }

    function runTypeExportTest<T>(typeName: string, _value: T = null) {
        it(`${typeName}`, () => {
            knownKeys[typeName] = true;
            // no-op. if this compiles, then the test is effectively satisfied.
            return;
        });
    }
});
