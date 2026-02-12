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

import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import { beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";
import { Button, Classes as CoreClasses } from "@blueprintjs/core";

import { type ItemRendererProps, MultiSelect, type MultiSelectProps } from "../../index";
import { type Film, renderFilm, TOP_100_FILMS } from "../../__examples__";
import { selectComponentSuite } from "../select/selectComponentSuite";
import type { ListItemsProps } from "../../common";

describe("<MultiSelect>", () => {
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
        selectedItems: [] as Film[],
        tagRenderer: renderTag,
    };
    let handlers: {
        itemPredicate: sinon.SinonSpy<[string, Film], boolean>;
        itemRenderer: sinon.SinonSpy<[Film, ItemRendererProps], React.JSX.Element | null>;
        onItemSelect: sinon.SinonSpy;
    };

    beforeEach(() => {
        handlers = {
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
    });

    selectComponentSuite(
        (props: ListItemsProps<Film>) => {
            const { rerender: rtlRerender } = render(
                <MultiSelect<Film>
                    selectedItems={[]}
                    {...props}
                    popoverProps={{ isOpen: true, usePortal: false }}
                    tagRenderer={renderTag}
                />,
            );
            return {
                rerender: (newProps: ListItemsProps<Film>) => {
                    rtlRerender(
                        <MultiSelect<Film>
                            selectedItems={[]}
                            {...newProps}
                            popoverProps={{ isOpen: true, usePortal: false }}
                            tagRenderer={renderTag}
                        />,
                    );
                },
            };
        },
        () => {
            // Find the input within the multi-select (not within custom targets)
            const inputs = screen.queryAllByRole("textbox");
            // When the popover is open, we want the input inside the TagInput
            // which has the class bp6-multi-select-tag-input-input
            const tagInput = document.querySelector(".bp6-multi-select-tag-input-input") as HTMLInputElement;
            return tagInput || inputs[0];
        },
        () => {
            // Find all menu items (options) in the popover
            // Use querySelectorAll since the items might not have proper role="option" in all cases
            const items = document.querySelectorAll("a.bp6-menu-item");
            return Array.from(items) as HTMLElement[];
        },
    );

    it("should control placeholder with placeholder prop", () => {
        const placeholder = "look here";
        multiselect({ placeholder });
        const input = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.placeholder).to.equal(placeholder);
    });

    it("should control placeholder with TagInput's inputProps", () => {
        const placeholder = "look here";
        multiselect({ tagInputProps: { placeholder } });
        const input = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.placeholder).to.equal(placeholder);
    });

    it("should tagRenderer can return JSX", () => {
        const { container } = multiselect({
            selectedItems: [TOP_100_FILMS[0]],
            tagRenderer: film => <strong>{film.title}</strong>,
        });
        const tags = container.querySelectorAll(`.${CoreClasses.TAG}`);
        expect(tags.length).to.be.greaterThan(0);
        const strongElement = container.querySelector("strong");
        expect(strongElement).to.exist;
    });

    it("should only trigger QueryList key up events when focus is on TagInput's <input>", async () => {
        const user = userEvent.setup();
        const itemSelectSpy = sinon.spy();
        const { container } = multiselect({
            onItemSelect: itemSelectSpy,
            selectedItems: [TOP_100_FILMS[1]],
        });

        const firstTagRemoveButton = container.querySelector(`.${CoreClasses.TAG_REMOVE}`) as HTMLElement;
        expect(firstTagRemoveButton).to.exist;

        firstTagRemoveButton.focus();
        await user.keyboard("{Enter}");

        // checks for the bug in https://github.com/palantir/blueprint/issues/3674
        // where the first item in the dropdown list would get selected upon hitting Enter inside
        // a TAG_REMOVE button
        expect(itemSelectSpy.calledWith(TOP_100_FILMS[0])).to.be.false;
    });

    it("should trigger onRemove", async () => {
        const user = userEvent.setup();
        const handleRemove = sinon.spy();
        const { container } = multiselect({
            onRemove: handleRemove,
            selectedItems: [TOP_100_FILMS[2], TOP_100_FILMS[3], TOP_100_FILMS[4]],
        });
        const removeButtons = container.querySelectorAll(`.${CoreClasses.TAG_REMOVE}`);
        await user.click(removeButtons[1] as HTMLElement);
        expect(handleRemove.calledOnceWithExactly(TOP_100_FILMS[3], 1)).to.be.true;
    });

    it("should open popover with custom target", async () => {
        const user = userEvent.setup();
        const customTarget = () => <Button data-testid="custom-target-button" text="Target" />;
        const { container } = multiselect({
            customTarget,
            popoverProps: { usePortal: false },
        });

        // Initially the popover should not be open
        let popover = container.querySelector(`.${CoreClasses.POPOVER_OPEN}`);
        expect(popover).to.be.null;

        const targetButton = screen.getByTestId("custom-target-button");
        await user.click(targetButton);

        // After clicking, the popover should be open
        popover = container.querySelector(`.${CoreClasses.POPOVER_OPEN}`);
        expect(popover).to.exist;
    });

    it("should allow searching within popover content when custom target provided", async () => {
        const user = userEvent.setup();
        const customTarget = () => <Button data-testid="custom-target-button" text="Target" />;
        const handleQueryChange = sinon.spy();
        const props = {
            customTarget,
            onQueryChange: handleQueryChange,
            popoverProps: { usePortal: false },
        };

        multiselect(props);

        const targetButton = screen.getByTestId("custom-target-button");
        await user.click(targetButton);

        // There's a slight delay between the Popover rendering and input getting focus
        await waitFor(() => {
            const input = screen.getByRole("textbox") as HTMLInputElement;
            expect(input).to.exist;
        });

        const input = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.value).to.equal("");
        expect(handleQueryChange.notCalled).to.be.true;

        // Check if activeElement is the input
        await waitFor(() => {
            expect(document.activeElement).to.equal(input);
        });

        await user.type(input, "Hello World");

        expect(input.value).to.equal("Hello World");
    });

    function multiselect(props: Partial<MultiSelectProps<Film>> = {}) {
        return render(
            <MultiSelect<Film> {...defaultProps} {...handlers} {...props}>
                <article />
            </MultiSelect>,
        );
    }
});

function renderTag(film: Film) {
    return film.title;
}

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}
