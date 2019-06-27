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

import { HTMLInputProps, Keys } from "@blueprintjs/core";
import { assert } from "chai";
import { ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import {
    areFilmsEqual,
    createFilm,
    filterFilm,
    IFilm,
    renderFilm,
    TOP_100_FILMS,
} from "../../docs-app/src/examples/select-examples/films";
import { IListItemsProps } from "../src/index";

export function selectComponentSuite<P extends IListItemsProps<IFilm>, S>(
    render: (props: IListItemsProps<IFilm>) => ReactWrapper<P, S>,
    findInput: (wrapper: ReactWrapper<P, S>) => ReactWrapper<HTMLInputProps> = wrapper => wrapper.find("input"),
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

    beforeEach(() => {
        testProps.itemRenderer.resetHistory();
        testProps.onActiveItemChange.resetHistory();
        testProps.onItemSelect.resetHistory();
        testProps.onQueryChange.resetHistory();
    });

    describe("common behavior", () => {
        it("itemRenderer is called for each child", () => {
            const wrapper = render(testProps);
            // each item is rendered once
            assert.equal(testProps.itemRenderer.callCount, 15);
            // only filtered items re-rendered
            testProps.itemRenderer.resetHistory();
            wrapper.setProps({ query: "1999" });
            assert.equal(testProps.itemRenderer.callCount, 2, "re-render");
        });

        it("renders noResults when given empty list", () => {
            const wrapper = render({ ...testProps, items: [], noResults: <address /> });
            assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
        });

        it("renders noResults when filtering returns empty list", () => {
            const wrapper = render({ ...testProps, noResults: <address />, query: "non-existent film name" });
            assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
        });

        it("clicking item invokes onItemSelect and changes active item", () => {
            const wrapper = render(testProps);
            findItems(wrapper)
                .at(4)
                .simulate("click");
            assert.strictEqual(testProps.onItemSelect.args[0][0].rank, 6, "onItemSelect");
            assert.strictEqual(testProps.onActiveItemChange.args[0][0].rank, 6, "onActiveItemChange");
        });

        it("clicking item resets state when resetOnSelect=true", () => {
            const wrapper = render({ ...testProps, query: "19", resetOnSelect: true, resetOnQuery: false });
            findItems(wrapper)
                .at(3)
                .simulate("click");
            const ranks = testProps.onActiveItemChange.args.map(args => (args[0] as IFilm).rank);
            // clicking changes to 5, then resets to 1
            assert.deepEqual(ranks, [5, 1]);
            assert.strictEqual(testProps.onQueryChange.lastCall.args[0], "");
        });

        it("querying does not reset active item when resetOnQuery=false", () => {
            const wrapper = render({ ...testProps, query: "19", resetOnQuery: false });
            // more specific query does not change active item.
            wrapper.setProps({ query: "199" });
            assert.strictEqual(testProps.onActiveItemChange.lastCall, null);
        });

        it("querying resets active item when resetOnQuery=true", () => {
            const wrapper = render({ ...testProps, query: "19", resetOnQuery: true });
            // more specific query picks the first item.
            wrapper.setProps({ query: "199" });
            assert.strictEqual(testProps.onActiveItemChange.lastCall.args[0].rank, 1);
        });

        it("querying resets active item if it does not match", () => {
            const wrapper = render({ ...testProps, query: "19", resetOnQuery: false });
            // a different query altogether invalidates the previous active item, so QL chooses the first.
            wrapper.setProps({ query: "Forrest" });
            assert.strictEqual(testProps.onActiveItemChange.lastCall.args[0].title, "Forrest Gump");
        });
    });

    describe("keyboard", () => {
        it("arrow down invokes onActiveItemChange with next filtered item", () => {
            const wrapper = render(testProps);
            findInput(wrapper)
                .simulate("keydown", { keyCode: Keys.ARROW_DOWN })
                .simulate("keydown", { keyCode: Keys.ARROW_DOWN });
            assert.equal((testProps.onActiveItemChange.lastCall.args[0] as IFilm).rank, 3);
        });

        it("arrow up invokes onActiveItemChange with previous filtered item", () => {
            const wrapper = render(testProps);
            findInput(wrapper).simulate("keydown", { keyCode: Keys.ARROW_UP });
            assert.equal((testProps.onActiveItemChange.lastCall.args[0] as IFilm).rank, 20);
        });

        it("arrow up/down does not invokes onActiveItemChange, when all items are disabled", () => {
            const wrapper = render({ ...testProps, itemDisabled: () => true });
            findInput(wrapper).simulate("keydown", { keyCode: Keys.ARROW_DOWN });
            assert.isNull(testProps.onActiveItemChange.lastCall);
            findInput(wrapper).simulate("keyup", { keyCode: Keys.ARROW_UP });
            assert.isNull(testProps.onActiveItemChange.lastCall);
        });

        it("enter invokes onItemSelect with active item", () => {
            const wrapper = render(testProps);
            findInput(wrapper).simulate("keyup", { keyCode: Keys.ENTER });
            const activeItem = testProps.onActiveItemChange.lastCall.args[0];
            assert.equal(testProps.onItemSelect.lastCall.args[0], activeItem);
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
            assert.lengthOf(findCreateItem(wrapper), 0, "should not find createItem");
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
            assert.lengthOf(wrapper.find("address"), 0, "should not find noResults");
            assert.lengthOf(findCreateItem(wrapper), 0, "should not find createItem");
        });

        it("renders create item if query is not empty and doesn't match any items exactly", () => {
            const wrapper = render({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title + " a few extra chars",
            });
            assert.lengthOf(wrapper.find("address"), 0, "should not find noResults");
            assert.lengthOf(findCreateItem(wrapper), 1, "should find createItem");
        });

        it("renders create item if filtering returns empty list", () => {
            const wrapper = render({
                ...testCreateProps,
                query: "non-existent film name",
            });
            assert.lengthOf(wrapper.find("address"), 0, "should not find noResults");
            assert.lengthOf(findCreateItem(wrapper), 1, "should find createItem");
        });

        it("enter invokes createNewItemFromQuery", () => {
            const wrapper = render({
                ...testCreateProps,
                query: "non-existent film name",
            });
            findInput(wrapper).simulate("keyup", { keyCode: Keys.ENTER });
            assert.equal(testCreateProps.createNewItemFromQuery.args[0][0], "non-existent film name");
        });

        it("when create item is rendered, arrow down invokes onActiveItemChange with activeItem=null and isCreateNewItem=true", () => {
            const wrapper = render({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title,
            });
            findInput(wrapper).simulate("keydown", { keyCode: Keys.ARROW_DOWN });
            assert.equal(testProps.onActiveItemChange.lastCall.args[0], null);
            assert.equal(testProps.onActiveItemChange.lastCall.args[1], true);
            findInput(wrapper).simulate("keydown", { keyCode: Keys.ARROW_DOWN });
            assert.equal((testProps.onActiveItemChange.lastCall.args[0] as IFilm).rank, TOP_100_FILMS[0].rank);
            assert.equal(testProps.onActiveItemChange.lastCall.args[1], false);
        });

        it("when create item is rendered, arrow up invokes onActiveItemChange with an `ICreateNewItem`", () => {
            const wrapper = render({
                ...testCreateProps,
                query: TOP_100_FILMS[0].title,
            });
            findInput(wrapper).simulate("keydown", { keyCode: Keys.ARROW_UP });
            assert.equal(testProps.onActiveItemChange.lastCall.args[0], null);
            assert.equal(testProps.onActiveItemChange.lastCall.args[1], true);
            findInput(wrapper).simulate("keydown", { keyCode: Keys.ARROW_UP });
            assert.equal((testProps.onActiveItemChange.lastCall.args[0] as IFilm).rank, TOP_100_FILMS[0].rank);
            assert.equal(testProps.onActiveItemChange.lastCall.args[1], false);
        });

        it("when create item is rendered, updating the query to exactly match one of the items hides the create item", () => {
            const wrapper = render({
                ...testCreateProps,
                // Again, we need this callback to return a real item this time.
                createNewItemFromQuery: createFilm,
                query: "non-empty, non-matching initial value",
            });

            assert.lengthOf(findCreateItem(wrapper), 1, "should find createItem");

            const EXISTING_FILM_TITLE = TOP_100_FILMS[0].title;
            findInput(wrapper).simulate("change", { target: { value: EXISTING_FILM_TITLE } });

            assert.lengthOf(findCreateItem(wrapper), 0, "should not find createItem");
        });
    });

    function findCreateItem(wrapper: ReactWrapper<P, S>) {
        return wrapper.find("textarea");
    }
}
