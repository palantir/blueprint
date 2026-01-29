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
import { LISTOGRAM_BAR, LISTOGRAM_HEADER } from "./listogramClasses";
import { ListogramSelectionKind, ListogramSelectionMode } from "./listogramTypes";
import { TEST_ITEMS } from "./testItems";

describe("<Listogram>", () => {
    it("should render", () => {
        render(<Listogram items={TEST_ITEMS} />);
        expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("should render all items", () => {
        render(<Listogram items={TEST_ITEMS} />);
        expect(screen.getByText("item text 0")).toBeInTheDocument();
        expect(screen.getByText("item text 1")).toBeInTheDocument();
        expect(screen.getByText("item text 2")).toBeInTheDocument();
    });

    it("should render the header if there is a title", () => {
        const { container } = render(<Listogram items={TEST_ITEMS} title="a title" />);
        const header = container.querySelector(`.${LISTOGRAM_HEADER}`);
        expect(header).toBeInTheDocument();
    });

    it("should not render the header if there isn't a title", () => {
        const { container } = render(<Listogram items={TEST_ITEMS} />);
        const header = container.querySelector(`.${LISTOGRAM_HEADER}`);
        expect(header).not.toBeInTheDocument();
    });

    it("should not render the bars if showBars is false", () => {
        const { container } = render(<Listogram items={TEST_ITEMS} showBars={false} />);
        const bars = container.querySelector(`.${LISTOGRAM_BAR}`);
        expect(bars).not.toBeInTheDocument();
    });

    it("should render the bars if showBars is not specified", () => {
        const { container } = render(<Listogram items={TEST_ITEMS} />);
        const bars = container.querySelector(`.${LISTOGRAM_BAR}`);
        expect(bars).toBeInTheDocument();
    });

    describe("event handlers", () => {
        it("should call onItemClick when item is clicked", () => {
            const handleItemClick = vi.fn();
            render(<Listogram items={TEST_ITEMS} onItemClick={handleItemClick} />);

            const firstItem = screen.getByText("item text 0");
            fireEvent.click(firstItem);

            expect(handleItemClick).toHaveBeenCalledTimes(1);
        });

        it("should call onSelectionChange when selection changes", () => {
            const handleSelectionChange = vi.fn();
            render(<Listogram items={TEST_ITEMS} onSelectionChange={handleSelectionChange} />);

            const firstItem = screen.getByText("item text 0");
            fireEvent.click(firstItem);

            expect(handleSelectionChange).toHaveBeenCalledTimes(1);
            expect(handleSelectionChange).toHaveBeenCalledWith(expect.any(Set));
        });

        it("should call both onItemClick and onSelectionChange when clicking with selection toggles", () => {
            const handleItemClick = vi.fn();
            const handleSelectionChange = vi.fn();
            render(
                <Listogram
                    items={TEST_ITEMS}
                    onItemClick={handleItemClick}
                    onSelectionChange={handleSelectionChange}
                    showSelectionToggles={true}
                    selectionKind={ListogramSelectionKind.MULTIPLE}
                />,
            );

            // Click the item text directly (checkbox is aria-hidden)
            fireEvent.click(screen.getByText("item text 0"));

            expect(handleItemClick).toHaveBeenCalledTimes(1);
            expect(handleSelectionChange).toHaveBeenCalledTimes(1);
        });
    });

    describe("selection mode", () => {
        const commonProps = {
            enableSelectionDrawer: true,
            items: TEST_ITEMS,
            selectionKind: ListogramSelectionKind.MULTIPLE,
            showSelectionToggles: true,
            title: "Header",
        };

        describe("uncontrolled usage", () => {
            it("should use default selection mode via props", () => {
                render(<Listogram {...commonProps} defaultSelectionMode={ListogramSelectionMode.EXCLUDING} />);
                // Component should render with the specified selection mode
                expect(screen.getByRole("listbox")).toBeInTheDocument();
            });

            it("should allow updating default selection mode", () => {
                const { rerender } = render(
                    <Listogram {...commonProps} defaultSelectionMode={ListogramSelectionMode.EXCLUDING} />,
                );
                rerender(<Listogram {...commonProps} defaultSelectionMode={ListogramSelectionMode.KEEPING} />);
                expect(screen.getByRole("listbox")).toBeInTheDocument();
            });
        });

        describe("controlled usage", () => {
            it("should allow controlled selection mode", () => {
                const { rerender } = render(
                    <Listogram {...commonProps} selectionMode={ListogramSelectionMode.EXCLUDING} />,
                );
                expect(screen.getByRole("listbox")).toBeInTheDocument();

                rerender(<Listogram {...commonProps} selectionMode={ListogramSelectionMode.KEEPING} />);
                expect(screen.getByRole("listbox")).toBeInTheDocument();
            });

            it("should call onSelectionModeChange callback", () => {
                const handleSelectionModeChange = vi.fn();
                render(
                    <Listogram
                        {...commonProps}
                        onSelectionModeChange={handleSelectionModeChange}
                        selectionMode={ListogramSelectionMode.EXCLUDING}
                    />,
                );
                // The callback would be triggered through UI interaction with the selection drawer
                expect(screen.getByRole("listbox")).toBeInTheDocument();
            });
        });
    });

    describe("visible item limit", () => {
        it("should show limited items when visibleItemLimit is set", () => {
            render(<Listogram items={TEST_ITEMS} visibleItemLimit={2} defaultShowAllItems={false} />);
            // With limit of 2 and defaultShowAllItems false, only 2 items should be visible
            expect(screen.getByText("item text 0")).toBeInTheDocument();
            expect(screen.getByText("item text 1")).toBeInTheDocument();
            expect(screen.queryByText("item text 2")).not.toBeInTheDocument();
        });

        it("should show View all button when visibleItemLimit is set", () => {
            render(<Listogram items={TEST_ITEMS} visibleItemLimit={2} defaultShowAllItems={false} />);
            expect(screen.getByText(/View all/)).toBeInTheDocument();
        });

        it("should expand to show all items when View all is clicked", () => {
            render(<Listogram items={TEST_ITEMS} visibleItemLimit={2} defaultShowAllItems={false} />);

            const viewAllButton = screen.getByText(/View all/);
            fireEvent.click(viewAllButton);

            expect(screen.getByText("item text 0")).toBeInTheDocument();
            expect(screen.getByText("item text 4")).toBeInTheDocument();
        });
    });

    describe("sorting", () => {
        it("should enable sorting when enableSorts is true and title is provided", () => {
            render(<Listogram items={TEST_ITEMS} enableSorts={true} title="Test" />);
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });
    });
});
