/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import type { ReactWrapper } from "enzyme";
import sinon from "sinon";

import { Classes, type HTMLInputProps } from "@blueprintjs/core";
import { afterEach, beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";
import { unmountWrappers } from "@blueprintjs/test-commons/vitest-utils";

import {
    areFilmsEqual,
    createFilm,
    createFilms,
    type Film,
    filterFilm,
    renderFilm,
    TOP_100_FILMS,
} from "../../__examples__";
import type { ListItemsProps } from "../../common/listItemsProps";

export function selectComponentSuite<P extends ListItemsProps<Film>, S>(
    render: (props: ListItemsProps<Film>) => ReactWrapper<P, S>,
    findInput: (wrapper: ReactWrapper<P, S>) => ReactWrapper<HTMLInputProps> = wrapper =>
        wrapper.find("input") as ReactWrapper<HTMLInputProps>,
    findItems: (wrapper: ReactWrapper<P, S>) => ReactWrapper = wrapper => wrapper.find("a"),
) {
    const testProps = {
        itemPredicate: filterFilm,
        itemRenderer: sinon.spy(renderFilm),
        items: TOP_100_FILMS.slice(0, 20),
        itemsEqual: areFilmsEqual,
        onActiveItemChange: sinon.spy(),
        onItemSelect: sinon.spy(),
        onQueryChange: sinon.spy(),
        query: "19",
    };

    let mountedWrappers: Array<ReactWrapper<P, S>> = [];
    const originalRender = render;
    render = (props: ListItemsProps<Film>) => {
        const wrapper = originalRender(props);
        mountedWrappers.push(wrapper);
        return wrapper;
    };

    beforeEach(() => {
        testProps.itemRenderer.resetHistory();
        testProps.onActiveItemChange.resetHistory();
        testProps.onItemSelect.resetHistory();
        testProps.onQueryChange.resetHistory();
    });

    afterEach(async () => {
        try {
            await unmountWrappers(mountedWrappers);
        } finally {
            mountedWrappers = [];
        }
    });

    describe("common behavior", () => {
        it("itemRenderer is called for each child", () => {
            const wrapper = render(testProps);
            // each item is rendered once
            expect(wrapper.find(`.${Classes.MENU_ITEM}`).hostNodes()).toHaveLength(15);
            wrapper.setProps({ query: "1999" });
            wrapper.update();
            expect(wrapper.find(`.${Classes.MENU_ITEM}`).hostNodes()).toHaveLength(2);
        });

        it("renders noResults when given empty list", () => {
            const wrapper = render({ ...testProps, items: [], noResults: <address /> });
            expect(wrapper.find("address")).toHaveLength(1);
        });

        it("renders noResults when filtering returns empty list", () => {
            const wrapper = render({
                ...testProps,
                noResults: <address />,
                query: "non-existent film name",
            });
            expect(wrapper.find("address")).toHaveLength(1);
        });

        it("clicking item invokes onItemSelect and changes active item", () => {
            const wrapper = render(testProps);
            findItems(wrapper).at(4).simulate("click");
            expect(testProps.onItemSelect.args[0][0].rank).toBe(6);
            expect(testProps.onActiveItemChange.args[0][0].rank).toBe(6);
        });

        it("clicking item resets state when resetOnSelect=true", () => {
            const wrapper = render({
                ...testProps,
                query: "19",
                resetOnQuery: false,
                resetOnSelect: true,
            });
            findItems(wrapper).at(3).simulate("click");
            const ranks = testProps.onActiveItemChange.args.map(args => (args[0] as Film).rank);
            // clicking changes to 5, then resets to 1
            expect(ranks).toEqual([5, 1]);
            expect(testProps.onQueryChange.lastCall.args[0]).toBe("");
        });

        it("querying does not reset active item when resetOnQuery=false", () => {
            const wrapper = render({ ...testProps, query: "19", resetOnQuery: false });
            // more specific query does not change active item.
            wrapper.setProps({ query: "199" });
            expect(testProps.onActiveItemChange.lastCall).toBe(null);
        });

        it("querying resets active item when resetOnQuery=true", () => {
            const wrapper = render({ ...testProps, query: "19", resetOnQuery: true });
            // more specific query picks the first item.
            wrapper.setProps({ query: "199" });
            expect(testProps.onActiveItemChange.lastCall.args[0].rank).toBe(1);
        });

        it("querying resets active item if it does not match", () => {
            const wrapper = render({ ...testProps, query: "19", resetOnQuery: false });
            // a different query altogether invalidates the previous active item, so QL chooses the first.
            wrapper.setProps({ query: "Forrest" });
            expect(testProps.onActiveItemChange.lastCall.args[0].title).toBe("Forrest Gump");
        });
    });

    describe("keyboard", () => {
        it("arrow down invokes onActiveItemChange with next filtered item", () => {
            const wrapper = render(testProps);
            findInput(wrapper).simulate("keydown", { key: "ArrowDown" }).simulate("keydown", { key: "ArrowDown" });
            expect((testProps.onActiveItemChange.lastCall.args[0] as Film).rank).toBe(3);
        });

        it("arrow up invokes onActiveItemChange with previous filtered item", () => {
            const wrapper = render(testProps);
            findInput(wrapper).simulate("keydown", { key: "ArrowUp" });
            expect((testProps.onActiveItemChange.lastCall.args[0] as Film).rank).toBe(20);
        });

        it("arrow up/down does not invokes onActiveItemChange, when all items are disabled", () => {
            const wrapper = render({ ...testProps, itemDisabled: () => true });
            findInput(wrapper).simulate("keydown", { key: "ArrowDown" });
            expect(testProps.onActiveItemChange.lastCall).toBeNull();
            findInput(wrapper).simulate("keyup", { key: "ArrowUp" });
            expect(testProps.onActiveItemChange.lastCall).toBeNull();
        });

        it("enter invokes onItemSelect with active item", () => {
            const wrapper = render(testProps);
            findInput(wrapper).simulate("keydown", { key: "Enter" });
            findInput(wrapper).simulate("keyup", { key: "Enter" });
            const activeItem = testProps.onActiveItemChange.lastCall.args[0];
            expect(testProps.onItemSelect.lastCall.args[0]).toBe(activeItem);
        });
    });

    describe("create", () => {
        const testCreateProps = {
            ...testProps,
            createNewItemFromQuery: sinon.spy(),
            createNewItemRenderer: () => <textarea />,
            noResults: <address />,
        };

        beforeEach(() => {
            testCreateProps.createNewItemFromQuery.resetHistory();
        });

        it("doesn't render create item if input is empty", () => {
            const wrapper = render({
                ...testCreateProps,
                query: "",
            });
            expect(findCreateItem(wrapper)).toHaveLength(0);
        });

        it("doesn't render create item if query is non-empty and matches one of the items", () => {
            const EXISTING_FILM_TITLE = TOP_100_FILMS[0].title;
            const wrapper = render({
                ...testCreateProps,
                // We need this callback to return a real item this time, and we
                // don't need to spy on it.
                createNewItemFromQuery: createFilm,
                query: EXISTING_FILM_TITLE,
            });
            expect(wrapper.find("address")).toHaveLength(0);
            expect(findCreateItem(wrapper)).toHaveLength(0);
        });

        it("renders create item if query is not empty and doesn't match any items exactly", () => {
            const wrapper = render({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title + " a few extra chars",
            });
            expect(wrapper.find("address")).toHaveLength(0);
            expect(findCreateItem(wrapper)).toHaveLength(1);
        });

        it("renders create item if filtering returns empty list", () => {
            const wrapper = render({
                ...testCreateProps,
                query: "non-existent film name",
            });
            expect(wrapper.find("address")).toHaveLength(0);
            expect(findCreateItem(wrapper)).toHaveLength(1);
        });

        it("enter invokes createNewItemFromQuery", () => {
            const wrapper = render({
                ...testCreateProps,
                query: "non-existent film name",
            });
            findInput(wrapper).simulate("keyup", { key: "Enter" });
            expect(testCreateProps.createNewItemFromQuery.args[0][0]).toBe("non-existent film name");
        });

        it("when createNewItemFromQuery returns an array, it should invoke onItemSelect once per each item in the array", () => {
            const wrapper = render({
                ...testCreateProps,
                createNewItemFromQuery: createFilms,
                query: "non-existent film name, second film name",
            });
            expect(findCreateItem(wrapper)).toHaveLength(1);
            findInput(wrapper).simulate("keydown", { key: "Enter" });
            findInput(wrapper).simulate("keyup", { key: "Enter" });
            expect(testCreateProps.onItemSelect.calledTwice).toBe(true);
            expect((testCreateProps.onItemSelect.args[0][0] as Film).title).toBe("non-existent film name");
            expect((testCreateProps.onItemSelect.args[1][0] as Film).title).toBe("second film name");
        });

        it("when create item is rendered, arrow down invokes onActiveItemChange with activeItem=null and isCreateNewItem=true", () => {
            const wrapper = render({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title,
            });
            findInput(wrapper).simulate("keydown", { key: "ArrowDown" });
            expect(testProps.onActiveItemChange.lastCall.args[0]).toBeNull();
            expect(testProps.onActiveItemChange.lastCall.args[1]).toBe(true);
            findInput(wrapper).simulate("keydown", { key: "ArrowDown" });
            expect((testProps.onActiveItemChange.lastCall.args[0] as unknown as Film).rank).toBe(TOP_100_FILMS[0].rank);
            expect(testProps.onActiveItemChange.lastCall.args[1]).toBe(false);
        });

        it("when create item is rendered, arrow up invokes onActiveItemChange with an `CreateNewItem`", () => {
            const wrapper = render({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title,
            });
            findInput(wrapper).simulate("keydown", { key: "ArrowUp" });
            expect(testProps.onActiveItemChange.lastCall.args[0]).toBeNull();
            expect(testProps.onActiveItemChange.lastCall.args[1]).toBe(true);
            findInput(wrapper).simulate("keydown", { key: "ArrowUp" });
            expect((testProps.onActiveItemChange.lastCall.args[0] as unknown as Film).rank).toBe(TOP_100_FILMS[0].rank);
            expect(testProps.onActiveItemChange.lastCall.args[1]).toBe(false);
        });

        it("when create item is rendered, updating the query to exactly match one of the items hides the create item", () => {
            const wrapper = render({
                ...testCreateProps,
                // Again, we need this callback to return a real item this time.
                createNewItemFromQuery: createFilm,
                query: "non-empty, non-matching initial value",
            });

            expect(findCreateItem(wrapper)).toHaveLength(1);

            const EXISTING_FILM_TITLE = TOP_100_FILMS[0].title;
            findInput(wrapper).simulate("change", { target: { value: EXISTING_FILM_TITLE } });

            expect(findCreateItem(wrapper)).toHaveLength(0);
        });
    });

    function findCreateItem(wrapper: ReactWrapper<P, S>) {
        return wrapper.find("textarea");
    }
}
