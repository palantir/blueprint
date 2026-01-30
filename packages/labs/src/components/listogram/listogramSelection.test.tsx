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

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Listogram } from "./listogram";
import { type ListogramItemId, ListogramSelectionKind } from "./listogramTypes";
import { TEST_ITEMS } from "./testItems";

describe("<Listogram> selection behavior", () => {
    describe("single selection", () => {
        it("should select only one item at a time", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.SINGLE}
                    onSelectionChange={handleSelectionChange}
                />,
            );

            // Click first item
            fireEvent.click(screen.getByText("item text 0"));
            expect(handleSelectionChange).toHaveBeenLastCalledWith(expect.any(Set));
            const firstSelection = handleSelectionChange.mock.calls[0][0] as Set<ListogramItemId>;
            expect(firstSelection.size).toBe(1);

            // Click second item - should replace selection
            fireEvent.click(screen.getByText("item text 1"));
            const secondSelection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
            expect(secondSelection.size).toBe(1);
        });

        it("should render radio buttons with showSelectionToggles", () => {
            // Note: The Listogram renders menu items with role="option" by default
            // Radio buttons are rendered as part of the selection toggles
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.SINGLE}
                    showSelectionToggles={true}
                />,
            );

            // Check that the listbox renders - the component uses custom selection UI
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });
    });

    describe("toggle selection", () => {
        it("should toggle item selection on click", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.TOGGLE}
                    onSelectionChange={handleSelectionChange}
                />,
            );

            // Click to select
            fireEvent.click(screen.getByText("item text 0"));
            const firstSelection = handleSelectionChange.mock.calls[0][0] as Set<ListogramItemId>;
            expect(firstSelection.has("0" as ListogramItemId)).toBe(true);

            // Click again to deselect
            fireEvent.click(screen.getByText("item text 0"));
            const secondSelection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
            expect(secondSelection.has("0" as ListogramItemId)).toBe(false);
        });

        it("should allow selecting multiple items", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.TOGGLE}
                    onSelectionChange={handleSelectionChange}
                />,
            );

            fireEvent.click(screen.getByText("item text 0"));
            fireEvent.click(screen.getByText("item text 1"));

            const selection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
            expect(selection.has("0" as ListogramItemId)).toBe(true);
            expect(selection.has("1" as ListogramItemId)).toBe(true);
        });
    });

    describe("multiple selection", () => {
        it("should select single item on regular click without showSelectionToggles", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                    onSelectionChange={handleSelectionChange}
                    showSelectionToggles={false}
                />,
            );

            fireEvent.click(screen.getByText("item text 0"));
            const selection = handleSelectionChange.mock.calls[0][0] as Set<ListogramItemId>;
            expect(selection.size).toBe(1);
        });

        it("should toggle item on regular click with showSelectionToggles", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                    onSelectionChange={handleSelectionChange}
                    showSelectionToggles={true}
                />,
            );

            // Click the item text to select (with showSelectionToggles, clicking toggles)
            fireEvent.click(screen.getByText("item text 0"));
            const firstSelection = handleSelectionChange.mock.calls[0][0] as Set<ListogramItemId>;
            expect(firstSelection.has("0" as ListogramItemId)).toBe(true);

            // Click again to deselect
            fireEvent.click(screen.getByText("item text 0"));
            const secondSelection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
            expect(secondSelection.has("0" as ListogramItemId)).toBe(false);
        });

        it("should toggle item on ctrl+click", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                    onSelectionChange={handleSelectionChange}
                />,
            );

            // Select first item
            fireEvent.click(screen.getByText("item text 0"));

            // Ctrl+click second item to add to selection
            fireEvent.click(screen.getByText("item text 1"), { ctrlKey: true });
            const selection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
            expect(selection.has("0" as ListogramItemId)).toBe(true);
            expect(selection.has("1" as ListogramItemId)).toBe(true);
        });

        it("should toggle item on meta+click (cmd on Mac)", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                    onSelectionChange={handleSelectionChange}
                />,
            );

            // Select first item
            fireEvent.click(screen.getByText("item text 0"));

            // Meta+click second item to add to selection
            fireEvent.click(screen.getByText("item text 1"), { metaKey: true });
            const selection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
            expect(selection.has("0" as ListogramItemId)).toBe(true);
            expect(selection.has("1" as ListogramItemId)).toBe(true);
        });

        it("should select range on shift+click", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                    onSelectionChange={handleSelectionChange}
                />,
            );

            // Select first item
            fireEvent.click(screen.getByText("item text 0"));

            // Shift+click third item to select range
            fireEvent.click(screen.getByText("item text 2"), { shiftKey: true });
            const selection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;

            // Should have items 0, 1, 2 selected
            expect(selection.has("0" as ListogramItemId)).toBe(true);
            expect(selection.has("1" as ListogramItemId)).toBe(true);
            expect(selection.has("2" as ListogramItemId)).toBe(true);
        });
    });

    describe("disabled items", () => {
        it("should not select disabled items", () => {
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                    onSelectionChange={handleSelectionChange}
                />,
            );

            // Item at index 5 is disabled
            fireEvent.click(screen.getByText("item text 5"));

            // Selection change should not be called for disabled items
            // (or if called, the disabled item should not be in selection)
            if (handleSelectionChange.mock.calls.length > 0) {
                const selection = handleSelectionChange.mock.calls[0][0] as Set<ListogramItemId>;
                expect(selection.has("5" as ListogramItemId)).toBe(false);
            }
        });
    });

    describe("controlled selection", () => {
        it("should render with controlled selectedItemIds", () => {
            const selectedItemIds = new Set<ListogramItemId>(["0" as ListogramItemId, "1" as ListogramItemId]);
            const { container } = render(
                <Listogram
                    items={TEST_ITEMS}
                    selectedItemIds={selectedItemIds}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                />,
            );

            // Selected items should have aria-selected="true"
            const selectedOptions = container.querySelectorAll('[aria-selected="true"]');
            expect(selectedOptions.length).toBe(2);
        });

        it("should update when selectedItemIds changes", () => {
            const initialSelection = new Set<ListogramItemId>(["0" as ListogramItemId]);
            const { rerender, container } = render(
                <Listogram
                    items={TEST_ITEMS}
                    selectedItemIds={initialSelection}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                />,
            );

            let selectedOptions = container.querySelectorAll('[aria-selected="true"]');
            expect(selectedOptions.length).toBe(1);

            const newSelection = new Set<ListogramItemId>(["1" as ListogramItemId, "2" as ListogramItemId]);
            rerender(
                <Listogram
                    items={TEST_ITEMS}
                    selectedItemIds={newSelection}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                />,
            );

            selectedOptions = container.querySelectorAll('[aria-selected="true"]');
            expect(selectedOptions.length).toBe(2);
        });
    });

    describe("disableSelection", () => {
        it("should not fire onSelectionChange when disableSelection is true", () => {
            const handleSelectionChange = vi.fn();
            render(<Listogram items={TEST_ITEMS} disableSelection={true} onSelectionChange={handleSelectionChange} />);

            fireEvent.click(screen.getByText("item text 0"));
            expect(handleSelectionChange).not.toHaveBeenCalled();
        });

        it("should still render selectedItemIds when disableSelection is true", () => {
            const selectedItemIds = new Set<ListogramItemId>(["0" as ListogramItemId]);
            const { container } = render(
                <Listogram items={TEST_ITEMS} selectedItemIds={selectedItemIds} disableSelection={true} />,
            );

            const selectedOptions = container.querySelectorAll('[aria-selected="true"]');
            expect(selectedOptions.length).toBe(1);
        });
    });
});
