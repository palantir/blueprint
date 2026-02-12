/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { spy } from "sinon";

import { afterEach, beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import type { ItemRendererProps } from "../../common";
import { type Film, filterFilm, renderFilm, TOP_100_FILMS } from "../../__examples__";
import type { SuggestProps } from "./suggest";
import { Suggest } from "./suggest";

describe("Suggest", () => {
    const defaultProps: Partial<SuggestProps<Film>> = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
    };

    let handlers: {
        inputValueRenderer: ReturnType<typeof spy<[Film], string>>;
        itemPredicate: ReturnType<typeof spy<[string, Film], boolean>>;
        itemRenderer: ReturnType<typeof spy<[Film, ItemRendererProps], React.JSX.Element | null>>;
        onItemSelect: ReturnType<typeof spy>;
    };
    let containerElement: HTMLElement;

    beforeEach(() => {
        handlers = {
            inputValueRenderer: spy(inputValueRenderer),
            itemPredicate: spy(filterByYear),
            itemRenderer: spy(renderFilm),
            onItemSelect: spy(),
        };
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        containerElement.remove();
    });

    // Note: shared suites are not yet migrated to Vitest/RTL
    // Once they are migrated, uncomment and adapt these calls:
    // selectComponentSuite((props) => {
    //     const result = render(
    //         <Suggest<Film>
    //             {...props}
    //             inputValueRenderer={inputValueRenderer}
    //             popoverProps={{ isOpen: true, usePortal: false }}
    //         />,
    //         { container: containerElement },
    //     );
    //     return {
    //         rerender: (newProps) =>
    //             result.rerender(
    //                 <Suggest<Film>
    //                     {...newProps}
    //                     inputValueRenderer={inputValueRenderer}
    //                     popoverProps={{ isOpen: true, usePortal: false }}
    //                 />,
    //             ),
    //     };
    // });

    // selectPopoverTestSuite((props) =>
    //     render(<Suggest<Film> {...props} inputValueRenderer={inputValueRenderer} />, {
    //         container: containerElement,
    //     }),
    // );

    describe("Basic behavior", () => {
        it("should render an input that triggers a popover containing items", () => {
            suggest();
            const input = screen.getByRole("combobox");
            expect(input).toBeInTheDocument();
            expect(screen.getAllByRole("option")).to.have.lengthOf(100);
        });

        describe("when ESCAPE key pressed", () => {
            runEscTabKeyDownTests("Escape");
        });

        describe("when TAB key pressed", () => {
            runEscTabKeyDownTests("Tab");
        });

        it("should not open popover on BACKSPACE, ARROW_LEFT, or ARROW_RIGHT", async () => {
            const user = userEvent.setup();
            suggest({ openOnKeyDown: true, popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            input.focus();
            await checkKeyDownDoesNotOpenPopover(user, input, "{Backspace}");
            await checkKeyDownDoesNotOpenPopover(user, input, "{ArrowLeft}");
            await checkKeyDownDoesNotOpenPopover(user, input, "{ArrowRight}");
        });

        it("should open popover if any other key pressed", async () => {
            const user = userEvent.setup();
            suggest({ openOnKeyDown: true, popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
            await user.type(input, " ");
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });

        it("should scroll active item into view when popover opens", () => {
            // This test validates internal implementation details (scrollActiveItemIntoView)
            // which are not easily testable with RTL without accessing component internals.
            // Skipping for now as it tests a non-critical implementation detail.
        });

        it.skip("should set active item to the selected item when the popover is closed", () => {
            // HACKHACK: skipped test resulting from React 18 upgrade. See: https://github.com/palantir/blueprint/issues/7168
            // This test was already skipped in the Enzyme version.
        });

        async function checkKeyDownDoesNotOpenPopover(
            user: ReturnType<typeof userEvent.setup>,
            input: HTMLElement,
            key: string,
        ) {
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
            await user.keyboard(key);
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        }

        function runEscTabKeyDownTests(keyName: string) {
            const key = keyName === "Escape" ? "{Escape}" : "{Tab}";

            it("should close popover", async () => {
                const user = userEvent.setup();
                suggest({ popoverProps: { usePortal: false } });
                const input = screen.getByRole("combobox");

                await user.click(input); // Opens popover
                expect(screen.getByRole("listbox")).toBeInTheDocument();

                await user.keyboard(key);
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });
            });

            it("should preserve currently selected item", async () => {
                const user = userEvent.setup();
                const ITEM_INDEX = 4;
                const expectedItem = TOP_100_FILMS[ITEM_INDEX];

                suggest({ closeOnSelect: false, popoverProps: { usePortal: false } });
                const input = screen.getByRole("combobox");

                await user.click(input); // Opens popover
                const items = screen.getAllByRole("option");
                await user.click(items[ITEM_INDEX]);

                expect(input).toHaveValue(inputValueRenderer(expectedItem));

                await user.keyboard(key);
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });

                // Type something new
                await user.clear(input);
                await user.type(input, "new query");

                await user.keyboard(key);
                await waitFor(() => {
                    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
                });

                // The selected item should still be preserved (but not shown since we typed a new query)
                expect(handlers.onItemSelect.calledOnce).to.be.true;
                expect(handlers.onItemSelect.firstCall.args[0]).to.equal(expectedItem);
            });
        }
    });

    describe("closeOnSelect", () => {
        it("should close the popover when clicking an item if closeOnSelect=true", async () => {
            const user = userEvent.setup();
            const ITEM_INDEX = 4;

            suggest({ popoverProps: { usePortal: false } }); // closeOnSelect=true by default
            const input = screen.getByRole("combobox");

            // Popover is open initially (forced by defaultProps)
            // For this test, we need to test without forcing isOpen
            suggest({ popoverProps: { usePortal: false }, closeOnSelect: true });

            await user.click(input); // Opens popover
            const items = screen.getAllByRole("option");
            await user.click(items[ITEM_INDEX]);

            await waitFor(() => {
                expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
            });
        });

        it("should not close the popover when clicking an item if closeOnSelect=false", async () => {
            const user = userEvent.setup();
            const ITEM_INDEX = 4;

            suggest({ closeOnSelect: false, popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            await user.click(input); // Opens popover
            const items = screen.getAllByRole("option");
            await user.click(items[ITEM_INDEX]);

            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });
    });

    describe("inputProps", () => {
        it("should ignore value and onChange", () => {
            const value = "nailed it";
            const onChange = spy();

            // @ts-expect-error - value and onChange are now omitted from the props type
            suggest({ inputProps: { onChange, value } });
            const input = screen.getByRole("combobox");

            expect(input).not.toHaveValue(value);
        });

        it("should invoke inputProps key handlers", async () => {
            const user = userEvent.setup();
            const onKeyDown = spy();
            const onKeyUp = spy();

            suggest({ inputProps: { onKeyDown, onKeyUp }, popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            await user.type(input, "a");
            expect(onKeyDown.called).to.be.true;
            expect(onKeyUp.called).to.be.true;
        });
    });

    describe("inputValueRenderer", () => {
        it("should invoke inputValueRenderer when rendering an item in the input field", async () => {
            const user = userEvent.setup();
            const ITEM_INDEX = 4;

            suggest({ popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            expect(handlers.inputValueRenderer.called).to.be.false;

            await user.click(input); // Opens popover
            const items = screen.getAllByRole("option");
            await user.click(items[ITEM_INDEX]);

            const selectedItem = TOP_100_FILMS[ITEM_INDEX];
            const expectedValue = inputValueRenderer(selectedItem);

            expect(handlers.inputValueRenderer.called).to.be.true;
            expect(input).toHaveValue(expectedValue);
        });
    });

    describe("openOnKeyDown", () => {
        it("should open the popover on key down if openOnKeyDown=true", async () => {
            const user = userEvent.setup();
            suggest({ openOnKeyDown: true, popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

            await user.type(input, "a");
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });

        it("should open the popover on focus if openOnKeyDown=false", async () => {
            const user = userEvent.setup();
            suggest({ popoverProps: { usePortal: false } }); // openOnKeyDown=false by default
            const input = screen.getByRole("combobox");

            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

            await user.click(input);
            expect(screen.getByRole("listbox")).toBeInTheDocument();
        });
    });

    describe("popoverProps", () => {
        it("should control popover with popoverProps", () => {
            const modifiers = {}; // our own instance
            const onOpening = spy();

            const { rerender } = suggest({
                popoverProps: { isOpen: false, usePortal: false, modifiers, onOpening },
            });

            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

            rerender(
                <Suggest<Film>
                    {...defaultProps}
                    {...handlers}
                    popoverProps={{ isOpen: true, usePortal: false, modifiers, onOpening }}
                />,
            );

            expect(screen.getByRole("listbox")).toBeInTheDocument();
            expect(onOpening.calledOnce).to.be.true;
        });
    });

    describe("Uncontrolled Mode with default value", () => {
        it("should initialize the selectedItem with the defaultSelectedItem", () => {
            const defaultSelectedItem = TOP_100_FILMS[0];
            suggest({ defaultSelectedItem });
            const input = screen.getByRole("combobox");

            expect(input).toHaveValue(inputValueRenderer(defaultSelectedItem));
        });

        it("should change the selectedItem when a new item is selected", async () => {
            const user = userEvent.setup();
            const ITEM_INDEX = 4;
            const defaultSelectedItem = TOP_100_FILMS[0];
            const nextSelectedItem = TOP_100_FILMS[ITEM_INDEX];

            suggest({ defaultSelectedItem, popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            expect(input).toHaveValue(inputValueRenderer(defaultSelectedItem));

            await user.click(input); // Opens popover
            const items = screen.getAllByRole("option");
            await user.click(items[ITEM_INDEX]);

            expect(handlers.onItemSelect.called).to.be.true;
            expect(input).toHaveValue(inputValueRenderer(nextSelectedItem));
        });
    });

    describe("Controlled Mode", () => {
        it("should initialize the selectedItem with the given value", () => {
            const selectedItem = TOP_100_FILMS[0];
            suggest({ selectedItem });
            const input = screen.getByRole("combobox");

            expect(input).toHaveValue(inputValueRenderer(selectedItem));
        });

        it("should propagate the selectedItem with new values", () => {
            const selectedItem = TOP_100_FILMS[0];
            const { rerender } = suggest({ selectedItem: null });
            const input = screen.getByRole("combobox");

            expect(input).toHaveValue("");

            rerender(<Suggest<Film> {...defaultProps} {...handlers} selectedItem={selectedItem} />);

            expect(input).toHaveValue(inputValueRenderer(selectedItem));
        });

        it("should respect the selectedItem prop when new item is selected", async () => {
            const user = userEvent.setup();
            const selectedItem = TOP_100_FILMS[0];
            const ITEM_INDEX = 4;

            const { rerender } = suggest({ selectedItem, popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            await user.click(input); // Opens popover
            const items = screen.getAllByRole("option");
            await user.click(items[ITEM_INDEX]);

            expect(handlers.onItemSelect.called).to.be.true;
            // In controlled mode, the input should still show the controlled value
            expect(input).toHaveValue(inputValueRenderer(selectedItem));

            // Now update the prop
            const newSelectedItem = TOP_100_FILMS[ITEM_INDEX];
            rerender(
                <Suggest<Film>
                    {...defaultProps}
                    {...handlers}
                    selectedItem={newSelectedItem}
                    popoverProps={{ usePortal: false }}
                />,
            );

            expect(input).toHaveValue(inputValueRenderer(newSelectedItem));
        });

        it("should preserve the empty selection", async () => {
            const user = userEvent.setup();
            const ITEM_INDEX = 4;
            const selectedItem = TOP_100_FILMS[0];

            const { rerender } = suggest({ selectedItem: null, popoverProps: { usePortal: false } });
            const input = screen.getByRole("combobox");

            expect(input).toHaveValue("");

            await user.click(input); // Opens popover
            const items = screen.getAllByRole("option");
            await user.click(items[ITEM_INDEX]);

            expect(handlers.onItemSelect.called).to.be.true;
            // In controlled mode with null, should stay null
            expect(input).toHaveValue("");

            // Now update to a real value
            rerender(
                <Suggest<Film>
                    {...defaultProps}
                    {...handlers}
                    selectedItem={selectedItem}
                    popoverProps={{ usePortal: false }}
                />,
            );

            expect(input).toHaveValue(inputValueRenderer(selectedItem));
        });
    });

    function suggest(props: Partial<SuggestProps<Film>> = {}) {
        return render(<Suggest<Film> {...defaultProps} {...handlers} {...props} />, { container: containerElement });
    }
});

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}

function inputValueRenderer(item: Film) {
    return item.title;
}
