/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { createEvent, fireEvent, render } from "@testing-library/react";
import { createRef, useState } from "react";

import { HotkeysProvider } from "@blueprintjs/core";
import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Cell } from "./cell/cell";
import { Column } from "./column";
import { type FocusedRegion, FocusMode } from "./common/cellTypes";
import * as Classes from "./common/classes";
import { RenderMode } from "./common/renderMode";
import { type Region, Regions, SelectionModes } from "./regions";
import { Table } from "./table";

describe("Table select all focus", () => {
    function renderTable({
        initialRegions = [Regions.column(0), Regions.column(1)],
        focusMode = FocusMode.CELL,
        controlledFocus = false,
        acceptFocus = true,
        enableFocus = true,
        enableTableSelection = true,
    }: {
        initialRegions?: Region[];
        focusMode?: FocusMode;
        controlledFocus?: boolean;
        acceptFocus?: boolean;
        enableFocus?: boolean;
        enableTableSelection?: boolean;
    } = {}) {
        const tableRef = createRef<Table>();
        const onFocus = vi.fn();
        function SelectionTable() {
            const [selectedRegions, setSelectedRegions] = useState(initialRegions);
            const [focusedRegion, setFocusedRegion] = useState<FocusedRegion>(() => {
                const { row, col } = Regions.getFocusCellCoordinatesFromRegion(initialRegions.at(-1)!);
                return focusMode === FocusMode.CELL
                    ? { col, focusSelectionIndex: initialRegions.length - 1, row, type: focusMode }
                    : { focusSelectionIndex: initialRegions.length - 1, row, type: focusMode };
            });
            return (
                <Table
                    focusedRegion={controlledFocus ? focusedRegion : undefined}
                    focusMode={enableFocus ? focusMode : undefined}
                    numRows={3}
                    onFocusedRegion={region => {
                        onFocus(region);
                        if (acceptFocus) {
                            setFocusedRegion(region);
                        }
                    }}
                    onSelection={setSelectedRegions}
                    ref={tableRef}
                    renderMode={RenderMode.NONE}
                    selectedRegions={selectedRegions}
                    selectionModes={enableTableSelection ? SelectionModes.ALL : SelectionModes.COLUMNS_ONLY}
                >
                    {["A", "B", "C"].map(name => (
                        <Column cellRenderer={row => <Cell>{`${name}${row}`}</Cell>} key={name} name={name} />
                    ))}
                </Table>
            );
        }
        const { container } = render(
            <HotkeysProvider>
                <SelectionTable />
            </HotkeysProvider>,
        );
        const root = container.querySelector<HTMLElement>(`.${Classes.TABLE_CONTAINER}`)!;
        const menu = container.querySelector<HTMLElement>(`.${Classes.TABLE_MENU}`)!;
        const state = () => tableRef.current!.state;
        function selectAll() {
            const event = createEvent.keyDown(root, { code: "KeyA", ctrlKey: true, key: "a" });
            fireEvent(root, event);
            return event;
        }
        return { menu, onFocus, root, selectAll, state };
    }

    for (const controlledFocus of [false, true]) {
        for (const initialRegions of [
            [Regions.column(0), Regions.column(1)],
            [Regions.row(0), Regions.row(1)],
            [Regions.cell(0, 0), Regions.cell(1, 1)],
        ]) {
            it(`preserves coordinates and resets the index after keyboard select all (${controlledFocus ? "controlled" : "uncontrolled"} focus, ${Regions.getRegionCardinality(initialRegions[0])})`, () => {
                const { root, selectAll, state } = renderTable({ controlledFocus, initialRegions });
                const previousFocus = state().focusedRegion!;
                expect(previousFocus.focusSelectionIndex).to.equal(1);

                expect(selectAll().defaultPrevented).to.equal(true);

                expect(state().selectedRegions).to.deep.equal([Regions.table()]);
                expect(state().focusedRegion).to.deep.equal({ ...previousFocus, focusSelectionIndex: 0 });
                const tab = createEvent.keyDown(root, { code: "Tab", key: "Tab" });
                fireEvent(root, tab);
                expect(tab.defaultPrevented).to.equal(true);
                expect(state().focusedRegion).to.deep.equal({
                    ...previousFocus,
                    col: (previousFocus as { col: number }).col + 1,
                    focusSelectionIndex: 0,
                });
            });
        }
    }

    for (const [key, shiftKey, row, col] of [
        ["Tab", true, 1, 0],
        ["Enter", false, 2, 1],
        ["Enter", true, 0, 1],
    ] as const) {
        it(`navigates with ${shiftKey ? "Shift+" : ""}${key} after select all`, () => {
            const { root, selectAll, state } = renderTable({
                initialRegions: [Regions.cell(0, 0), Regions.cell(1, 1)],
            });
            selectAll();
            const event = createEvent.keyDown(root, { code: key, key, shiftKey });
            fireEvent(root, event);
            expect(event.defaultPrevented).to.equal(true);
            expect(state().focusedRegion).to.deep.equal({ col, focusSelectionIndex: 0, row, type: FocusMode.CELL });
        });
    }

    it("keeps ordinary disjoint-selection Tab navigation", () => {
        const { root, state } = renderTable();
        fireEvent.keyDown(root, { code: "Tab", key: "Tab" });
        expect(state().selectedRegions).to.deep.equal([Regions.column(0), Regions.column(1)]);
        expect(state().focusedRegion).to.deep.equal({ col: 1, focusSelectionIndex: 1, row: 1, type: FocusMode.CELL });
    });

    it("keeps single-selection Tab navigation after select all", () => {
        const { root, selectAll, state } = renderTable({ initialRegions: [Regions.column(1)] });
        selectAll();
        fireEvent.keyDown(root, { code: "Tab", key: "Tab" });
        expect(state().focusedRegion).to.deep.equal({ col: 2, focusSelectionIndex: 0, row: 0, type: FocusMode.CELL });
    });

    it("preserves coordinates and resets the index on Shift+click of the table corner", () => {
        const { menu, state } = renderTable();
        fireEvent.mouseDown(menu, { shiftKey: true });
        expect(state().selectedRegions).to.deep.equal([Regions.table()]);
        expect(state().focusedRegion).to.deep.equal({ col: 1, focusSelectionIndex: 0, row: 0, type: FocusMode.CELL });
    });

    it("moves focus to the first cell on an ordinary table corner click", () => {
        const { menu, state } = renderTable();
        fireEvent.mouseDown(menu);
        expect(state().focusedRegion).to.deep.equal({ col: 0, focusSelectionIndex: 0, row: 0, type: FocusMode.CELL });
    });

    for (const controlledFocus of [false, true]) {
        it(`preserves row focus after select all (${controlledFocus ? "controlled" : "uncontrolled"})`, () => {
            const { selectAll, state } = renderTable({
                controlledFocus,
                focusMode: FocusMode.ROW,
                initialRegions: [Regions.row(0), Regions.row(1)],
            });
            selectAll();
            expect(state().focusedRegion).to.deep.equal({ focusSelectionIndex: 0, row: 1, type: FocusMode.ROW });
        });
    }

    it("requests controlled focus changes without overriding the supplied focus", () => {
        const { onFocus, selectAll, state } = renderTable({ acceptFocus: false, controlledFocus: true });
        selectAll();
        expect(onFocus).toHaveBeenLastCalledWith({ col: 1, focusSelectionIndex: 0, row: 0, type: FocusMode.CELL });
        expect(state().focusedRegion).to.deep.equal({ col: 1, focusSelectionIndex: 1, row: 0, type: FocusMode.CELL });
    });

    it("does not enable focus when selecting all", () => {
        const { onFocus, selectAll, state } = renderTable({ enableFocus: false });
        selectAll();
        expect(state().selectedRegions).to.deep.equal([Regions.table()]);
        expect(state().focusedRegion).to.equal(undefined);
        expect(onFocus).not.toHaveBeenCalled();
    });

    it("does not handle the select all hotkey when table selection is disabled", () => {
        const { onFocus, selectAll, state } = renderTable({ enableTableSelection: false });
        expect(selectAll().defaultPrevented).to.equal(false);
        expect(state().selectedRegions).to.deep.equal([Regions.column(0), Regions.column(1)]);
        expect(state().focusedRegion?.focusSelectionIndex).to.equal(1);
        expect(onFocus).not.toHaveBeenCalled();
    });

    it("does not change focus on Shift+corner click when table selection is disabled", () => {
        const { menu, onFocus, state } = renderTable({ enableTableSelection: false });
        fireEvent.mouseDown(menu, { shiftKey: true });
        expect(state().selectedRegions).to.deep.equal([]);
        expect(state().focusedRegion?.focusSelectionIndex).to.equal(1);
        expect(onFocus).not.toHaveBeenCalled();
    });
});
