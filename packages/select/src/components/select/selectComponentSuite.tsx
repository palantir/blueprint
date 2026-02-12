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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { spy } from "sinon";
import { beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "@blueprintjs/core";

import type { ListItemsProps } from "../../common";
import {
    areFilmsEqual,
    createFilm,
    createFilms,
    type Film,
    filterFilm,
    renderFilm,
    TOP_100_FILMS,
} from "../../__examples__";

type RenderFn = (props: ListItemsProps<Film>) => { rerender: (props: ListItemsProps<Film>) => void };

export function selectComponentSuite(
    renderFn: RenderFn,
    findInput: () => HTMLElement = () => screen.getByRole("textbox"),
    findItems: () => HTMLElement[] = () => Array.from(document.querySelectorAll(`.${Classes.MENU_ITEM}`)),
) {
    const testProps = {
        itemPredicate: filterFilm,
        itemRenderer: spy(renderFilm),
        items: TOP_100_FILMS.slice(0, 20),
        itemsEqual: areFilmsEqual,
        onActiveItemChange: spy(),
        onItemSelect: spy(),
        onQueryChange: spy(),
        query: "19",
    };

    beforeEach(() => {
        testProps.itemRenderer.resetHistory();
        testProps.onActiveItemChange.resetHistory();
        testProps.onItemSelect.resetHistory();
        testProps.onQueryChange.resetHistory();
    });

    describe("common behavior", () => {
        it("should render itemRenderer for each child", () => {
            const { rerender } = renderFn(testProps);
            // each item is rendered once - query "19" filters to 15 films
            expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.equal(15);
            rerender({ ...testProps, query: "1999" });
            // query "1999" filters to 2 films
            expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.equal(2);
        });

        it("should render noResults when given empty list", () => {
            renderFn({ ...testProps, items: [], noResults: <address /> });
            expect(document.querySelector("address")).to.exist;
        });

        it("should render noResults when filtering returns empty list", () => {
            renderFn({
                ...testProps,
                noResults: <address />,
                query: "non-existent film name",
            });
            expect(document.querySelector("address")).to.exist;
        });

        it("should invoke onItemSelect and change active item when clicking item", async () => {
            const user = userEvent.setup();
            renderFn(testProps);
            const items = findItems();
            await user.click(items[4]);
            expect(testProps.onItemSelect.args[0][0].rank).to.equal(6);
            expect(testProps.onActiveItemChange.args[0][0].rank).to.equal(6);
        });

        it("should reset state when clicking item with resetOnSelect=true", async () => {
            const user = userEvent.setup();
            renderFn({
                ...testProps,
                query: "19",
                resetOnQuery: false,
                resetOnSelect: true,
            });
            const items = findItems();
            await user.click(items[3]);
            const ranks = testProps.onActiveItemChange.args.map((args: any[]) => (args[0] as Film).rank);
            // clicking changes to 5, then resets to 1
            // userEvent may trigger hover/focus which can cause duplicate activeItem changes
            // so we accept either [5, 1] or [5, 5, 1]
            const isValidSequence =
                (ranks.length === 2 && ranks[0] === 5 && ranks[1] === 1) ||
                (ranks.length === 3 && ranks[0] === 5 && ranks[1] === 5 && ranks[2] === 1);
            expect(isValidSequence).to.be.true;
            expect(testProps.onQueryChange.lastCall.args[0]).to.equal("");
        });

        it("should not reset active item when querying with resetOnQuery=false", () => {
            const { rerender } = renderFn({ ...testProps, query: "19", resetOnQuery: false });
            // more specific query does not change active item.
            rerender({ ...testProps, query: "199", resetOnQuery: false });
            expect(testProps.onActiveItemChange.lastCall).to.be.null;
        });

        it("should reset active item when querying with resetOnQuery=true", () => {
            const { rerender } = renderFn({ ...testProps, query: "19", resetOnQuery: true });
            // more specific query picks the first item.
            rerender({ ...testProps, query: "199", resetOnQuery: true });
            expect(testProps.onActiveItemChange.lastCall.args[0].rank).to.equal(1);
        });

        it("should reset active item if query does not match", () => {
            const { rerender } = renderFn({ ...testProps, query: "19", resetOnQuery: false });
            // a different query altogether invalidates the previous active item, so QL chooses the first.
            rerender({ ...testProps, query: "Forrest", resetOnQuery: false });
            expect(testProps.onActiveItemChange.lastCall.args[0].title).to.equal("Forrest Gump");
        });
    });

    describe("keyboard", () => {
        it("should invoke onActiveItemChange with next filtered item on arrow down", async () => {
            const user = userEvent.setup();
            renderFn(testProps);
            const input = findInput();
            input.focus();
            await user.keyboard("{ArrowDown}{ArrowDown}");
            expect((testProps.onActiveItemChange.lastCall.args[0] as Film).rank).to.equal(3);
        });

        it("should invoke onActiveItemChange with previous filtered item on arrow up", async () => {
            const user = userEvent.setup();
            renderFn(testProps);
            const input = findInput();
            input.focus();
            await user.keyboard("{ArrowUp}");
            expect((testProps.onActiveItemChange.lastCall.args[0] as Film).rank).to.equal(20);
        });

        it("should not invoke onActiveItemChange when all items are disabled", async () => {
            const user = userEvent.setup();
            renderFn({ ...testProps, itemDisabled: () => true });
            const input = findInput();
            input.focus();
            await user.keyboard("{ArrowDown}");
            expect(testProps.onActiveItemChange.lastCall).to.be.null;
            await user.keyboard("{ArrowUp}");
            expect(testProps.onActiveItemChange.lastCall).to.be.null;
        });

        it("should invoke onItemSelect with active item on enter", async () => {
            const user = userEvent.setup();
            renderFn(testProps);
            const input = findInput();
            input.focus();
            await user.keyboard("{Enter}");
            const activeItem = testProps.onActiveItemChange.lastCall.args[0];
            expect(testProps.onItemSelect.lastCall.args[0]).to.equal(activeItem);
        });
    });

    describe("create", () => {
        const testCreateProps = {
            ...testProps,
            createNewItemFromQuery: spy(),
            createNewItemRenderer: () => <textarea />,
            noResults: <address />,
        };

        beforeEach(() => {
            testCreateProps.createNewItemFromQuery.resetHistory();
        });

        it("should not render create item if input is empty", () => {
            renderFn({
                ...testCreateProps,
                query: "",
            });
            expect(findCreateItem()).to.be.null;
        });

        it("should not render create item if query is non-empty and matches one of the items", () => {
            const EXISTING_FILM_TITLE = TOP_100_FILMS[0].title;
            renderFn({
                ...testCreateProps,
                // We need this callback to return a real item this time, and we
                // don't need to spy on it.
                createNewItemFromQuery: createFilm,
                query: EXISTING_FILM_TITLE,
            });
            expect(document.querySelector("address")).to.be.null;
            expect(findCreateItem()).to.be.null;
        });

        it("should render create item if query is not empty and doesn't match any items exactly", () => {
            renderFn({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title + " a few extra chars",
            });
            expect(document.querySelector("address")).to.be.null;
            expect(findCreateItem()).to.exist;
        });

        it("should render create item if filtering returns empty list", () => {
            renderFn({
                ...testCreateProps,
                query: "non-existent film name",
            });
            expect(document.querySelector("address")).to.be.null;
            expect(findCreateItem()).to.exist;
        });

        it("should invoke createNewItemFromQuery on enter", async () => {
            const user = userEvent.setup();
            renderFn({
                ...testCreateProps,
                query: "non-existent film name",
            });
            const input = findInput();
            input.focus();
            await user.keyboard("{Enter}");
            expect(testCreateProps.createNewItemFromQuery.args[0][0]).to.equal("non-existent film name");
        });

        it("should invoke onItemSelect once per each item when createNewItemFromQuery returns an array", async () => {
            const user = userEvent.setup();
            renderFn({
                ...testCreateProps,
                createNewItemFromQuery: createFilms,
                query: "non-existent film name, second film name",
            });
            expect(findCreateItem()).to.exist;
            const input = findInput();
            input.focus();
            await user.keyboard("{Enter}");
            expect(testCreateProps.onItemSelect.calledTwice).to.be.true;
            expect((testCreateProps.onItemSelect.args[0][0] as Film).title).to.equal("non-existent film name");
            expect((testCreateProps.onItemSelect.args[1][0] as Film).title).to.equal("second film name");
        });

        it("should invoke onActiveItemChange with activeItem=null and isCreateNewItem=true when arrow down to create item", async () => {
            const user = userEvent.setup();
            renderFn({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title,
            });
            const input = findInput();
            input.focus();
            await user.keyboard("{ArrowDown}");
            expect(testProps.onActiveItemChange.lastCall.args[0]).to.be.null;
            expect(testProps.onActiveItemChange.lastCall.args[1]).to.be.true;
            await user.keyboard("{ArrowDown}");
            expect((testProps.onActiveItemChange.lastCall.args[0] as unknown as Film).rank).to.equal(
                TOP_100_FILMS[0].rank,
            );
            expect(testProps.onActiveItemChange.lastCall.args[1]).to.be.false;
        });

        it("should invoke onActiveItemChange with an CreateNewItem when arrow up to create item", async () => {
            const user = userEvent.setup();
            renderFn({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title,
            });
            const input = findInput();
            input.focus();
            await user.keyboard("{ArrowUp}");
            expect(testProps.onActiveItemChange.lastCall.args[0]).to.be.null;
            expect(testProps.onActiveItemChange.lastCall.args[1]).to.be.true;
            await user.keyboard("{ArrowUp}");
            expect((testProps.onActiveItemChange.lastCall.args[0] as unknown as Film).rank).to.equal(
                TOP_100_FILMS[0].rank,
            );
            expect(testProps.onActiveItemChange.lastCall.args[1]).to.be.false;
        });

        it("should hide create item when updating query to exactly match one of the items", async () => {
            const user = userEvent.setup();
            renderFn({
                ...testCreateProps,
                // Again, we need this callback to return a real item this time.
                createNewItemFromQuery: createFilm,
                query: "non-empty, non-matching initial value",
            });

            expect(findCreateItem()).to.exist;

            const EXISTING_FILM_TITLE = TOP_100_FILMS[0].title;
            const input = findInput();
            await user.clear(input);
            await user.type(input, EXISTING_FILM_TITLE);

            expect(findCreateItem()).to.be.null;
        });
    });

    function findCreateItem() {
        return document.querySelector("textarea");
    }
}
