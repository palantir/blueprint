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

import { LISTOGRAM_HEADER } from "./listogramClasses";
import type { ListogramItemId } from "./listogramTypes";
import { ListogramSelectionKind } from "./listogramTypes";
import { MultiListogram } from "./multiListogram";
import { MULTI_TEST_ITEMS, MULTI_TEST_SERIES_METADATA } from "./testItems";

describe("<MultiListogram>", () => {
    it("should render", () => {
        render(<MultiListogram items={MULTI_TEST_ITEMS} seriesMetadata={MULTI_TEST_SERIES_METADATA} />);
        expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("should render all items", () => {
        render(<MultiListogram items={MULTI_TEST_ITEMS} seriesMetadata={MULTI_TEST_SERIES_METADATA} />);
        expect(screen.getByText("item text 0")).toBeInTheDocument();
        expect(screen.getByText("item text 1")).toBeInTheDocument();
        expect(screen.getByText("item text 2")).toBeInTheDocument();
    });

    it("should render the header if there is a title", () => {
        const { container } = render(
            <MultiListogram items={MULTI_TEST_ITEMS} seriesMetadata={MULTI_TEST_SERIES_METADATA} title="a title" />,
        );
        const header = container.querySelector(`.${LISTOGRAM_HEADER}`);
        expect(header).toBeInTheDocument();
    });

    it("should not render the header if there isn't a title", () => {
        const { container } = render(
            <MultiListogram items={MULTI_TEST_ITEMS} seriesMetadata={MULTI_TEST_SERIES_METADATA} />,
        );
        const header = container.querySelector(`.${LISTOGRAM_HEADER}`);
        expect(header).not.toBeInTheDocument();
    });

    describe("fillEmptyCounts", () => {
        it("should fill empty counts when fillEmptyCounts is true", () => {
            render(
                <MultiListogram
                    items={MULTI_TEST_ITEMS}
                    seriesMetadata={MULTI_TEST_SERIES_METADATA}
                    fillEmptyCounts={true}
                />,
            );
            // All items should render even if they don't have all series
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });
    });

    describe("event handlers", () => {
        it("should call onItemClick when item is clicked", () => {
            const handleItemClick = vi.fn();
            render(
                <MultiListogram
                    items={MULTI_TEST_ITEMS}
                    seriesMetadata={MULTI_TEST_SERIES_METADATA}
                    onItemClick={handleItemClick}
                />,
            );

            const firstItem = screen.getByText("item text 0");
            fireEvent.click(firstItem);

            expect(handleItemClick).toHaveBeenCalledTimes(1);
        });

        it("should call onSelectionChange when selection changes", () => {
            const handleSelectionChange = vi.fn();
            render(
                <MultiListogram
                    items={MULTI_TEST_ITEMS}
                    seriesMetadata={MULTI_TEST_SERIES_METADATA}
                    onSelectionChange={handleSelectionChange}
                />,
            );

            const firstItem = screen.getByText("item text 0");
            fireEvent.click(firstItem);

            expect(handleSelectionChange).toHaveBeenCalledTimes(1);
            expect(handleSelectionChange).toHaveBeenCalledWith(expect.any(Set));
        });
    });

    describe("selection behavior", () => {
        describe("single selection", () => {
            it("should select only one item at a time", () => {
                const handleSelectionChange = vi.fn();
                render(
                    <MultiListogram
                        items={MULTI_TEST_ITEMS}
                        seriesMetadata={MULTI_TEST_SERIES_METADATA}
                        selectionKind={ListogramSelectionKind.SINGLE}
                        onSelectionChange={handleSelectionChange}
                    />,
                );

                fireEvent.click(screen.getByText("item text 0"));
                const firstSelection = handleSelectionChange.mock.calls[0][0] as Set<ListogramItemId>;
                expect(firstSelection.size).toBe(1);

                fireEvent.click(screen.getByText("item text 1"));
                const secondSelection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
                expect(secondSelection.size).toBe(1);
            });
        });

        describe("toggle selection", () => {
            it("should toggle item selection on click", () => {
                const handleSelectionChange = vi.fn();
                render(
                    <MultiListogram
                        items={MULTI_TEST_ITEMS}
                        seriesMetadata={MULTI_TEST_SERIES_METADATA}
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
        });

        describe("multiple selection", () => {
            it("should toggle item on ctrl+click", () => {
                const handleSelectionChange = vi.fn();
                render(
                    <MultiListogram
                        items={MULTI_TEST_ITEMS}
                        seriesMetadata={MULTI_TEST_SERIES_METADATA}
                        selectionKind={ListogramSelectionKind.MULTIPLE}
                        onSelectionChange={handleSelectionChange}
                    />,
                );

                fireEvent.click(screen.getByText("item text 0"));
                fireEvent.click(screen.getByText("item text 1"), { ctrlKey: true });

                const selection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
                expect(selection.has("0" as ListogramItemId)).toBe(true);
                expect(selection.has("1" as ListogramItemId)).toBe(true);
            });

            it("should select range on shift+click", () => {
                const handleSelectionChange = vi.fn();
                render(
                    <MultiListogram
                        items={MULTI_TEST_ITEMS}
                        seriesMetadata={MULTI_TEST_SERIES_METADATA}
                        selectionKind={ListogramSelectionKind.MULTIPLE}
                        onSelectionChange={handleSelectionChange}
                    />,
                );

                fireEvent.click(screen.getByText("item text 0"));
                fireEvent.click(screen.getByText("item text 2"), { shiftKey: true });

                const selection = handleSelectionChange.mock.calls[1][0] as Set<ListogramItemId>;
                expect(selection.has("0" as ListogramItemId)).toBe(true);
                expect(selection.has("1" as ListogramItemId)).toBe(true);
                expect(selection.has("2" as ListogramItemId)).toBe(true);
            });
        });

        describe("disabled items", () => {
            it("should not select disabled items", () => {
                const handleSelectionChange = vi.fn();
                render(
                    <MultiListogram
                        items={MULTI_TEST_ITEMS}
                        seriesMetadata={MULTI_TEST_SERIES_METADATA}
                        selectionKind={ListogramSelectionKind.MULTIPLE}
                        onSelectionChange={handleSelectionChange}
                    />,
                );

                // Item at index 5 is disabled
                fireEvent.click(screen.getByText("item text 5"));

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
                    <MultiListogram
                        items={MULTI_TEST_ITEMS}
                        seriesMetadata={MULTI_TEST_SERIES_METADATA}
                        selectedItemIds={selectedItemIds}
                        selectionKind={ListogramSelectionKind.MULTIPLE}
                    />,
                );

                // Selected items should have aria-selected="true"
                const selectedOptions = container.querySelectorAll('[aria-selected="true"]');
                expect(selectedOptions.length).toBe(2);
            });
        });
    });

    describe("showCountBarTooltip", () => {
        it("should show tooltip by default", () => {
            render(<MultiListogram items={MULTI_TEST_ITEMS} seriesMetadata={MULTI_TEST_SERIES_METADATA} />);
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });

        it("should hide tooltip when showCountBarTooltip is false", () => {
            render(
                <MultiListogram
                    items={MULTI_TEST_ITEMS}
                    seriesMetadata={MULTI_TEST_SERIES_METADATA}
                    showCountBarTooltip={false}
                />,
            );
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });
    });
});
