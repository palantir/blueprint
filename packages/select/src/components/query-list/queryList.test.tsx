/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { mount, type ReactWrapper, shallow } from "enzyme";
import { act } from "react";
import sinon from "sinon";

import { Menu } from "@blueprintjs/core";
import { afterEach, beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { type Film, renderFilm, TOP_100_FILMS } from "../../__examples__";
import type { ItemListRenderer } from "../../common/itemListRenderer";
import type { ItemListPredicate, ItemPredicate } from "../../common/predicate";

import { QueryList, type QueryListProps, type QueryListRendererProps, type QueryListState } from "./queryList";

type FilmQueryListWrapper = ReactWrapper<QueryListProps<Film>, QueryListState<Film>>;

describe("<QueryList>", () => {
    const testProps = {
        itemRenderer: sinon.spy(renderFilm),
        items: TOP_100_FILMS.slice(0, 20),
        onActiveItemChange: sinon.spy(),
        onItemSelect: sinon.spy(),
        renderer: sinon.spy((props: QueryListRendererProps<Film>) => <div>{props.itemList}</div>),
    };

    beforeEach(() => {
        testProps.itemRenderer.resetHistory();
        testProps.onActiveItemChange.resetHistory();
        testProps.onItemSelect.resetHistory();
        testProps.renderer.resetHistory();
    });

    describe("items", () => {
        it("handles controlled changes to the whole items list", () => {
            const wrapper = shallow(<QueryList<Film> {...testProps} />);
            const newItems = TOP_100_FILMS.slice(0, 1);
            wrapper.setProps({ items: newItems });
            expect(wrapper.state("filteredItems")).toEqual(newItems);
        });
    });

    describe("itemListRenderer", () => {
        const itemListRenderer: ItemListRenderer<Film> = props => (
            <ul className="foo">{props.items.map(props.renderItem)}</ul>
        );

        it("renderItem calls itemRenderer", () => {
            const wrapper = shallow(<QueryList<Film> {...testProps} itemListRenderer={itemListRenderer} />);
            expect(wrapper.find("ul.foo")).toHaveLength(1);
            expect(testProps.itemRenderer.callCount).toBe(20);
        });
    });

    describe("filtering", () => {
        it("itemPredicate filters each item by query", () => {
            const predicate = sinon.spy((query: string, film: Film) => film.year === +query);
            shallow(<QueryList<Film> {...testProps} itemPredicate={predicate} query="1994" />);

            expect(predicate.callCount).toBe(testProps.items.length);
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            expect(filteredItems).toHaveLength(3);
        });

        it("itemListPredicate filters entire list by query", () => {
            const predicate = sinon.spy((query: string, films: Film[]) => films.filter(f => f.year === +query));
            shallow(<QueryList<Film> {...testProps} itemListPredicate={predicate} query="1994" />);

            expect(predicate.callCount).toBe(1);
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            expect(filteredItems).toHaveLength(3);
        });

        it("prefers itemListPredicate if both are defined", () => {
            const predicate = sinon.spy(() => true);
            const listPredicate: ItemListPredicate<any> = (_q, items) => items;
            const listPredicateSpy = sinon.spy(listPredicate);
            shallow(
                <QueryList<Film>
                    {...testProps}
                    itemPredicate={predicate}
                    itemListPredicate={listPredicateSpy}
                    query="1980"
                />,
            );
            expect(listPredicateSpy.called).toBe(true);
            expect(predicate.called).toBe(false);
        });

        it("omitting both predicate props is supported", () => {
            shallow(<QueryList<Film> {...testProps} query="1980" />);
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            expect(filteredItems).toHaveLength(testProps.items.length);
        });

        it("ensure onActiveItemChange is not called with undefined and empty list", () => {
            const myItem = { rank: 1, title: "Toy Story 3", year: 2010 };
            const filmQueryList = mount(
                <QueryList<Film> {...testProps} items={[myItem]} activeItem={myItem} query="" />,
            );
            act(() => {
                filmQueryList.setState({ query: "query" });
            });
            act(() => {
                filmQueryList.setState({ activeItem: undefined });
            });
            expect(testProps.onActiveItemChange.callCount).toBe(0);
        });

        it("ensure onActiveItemChange is not called updating props and query doesn't change", () => {
            const myItem = { rank: 1, title: "Toy Story 3", year: 2010 };
            const props: QueryListProps<Film> = {
                ...testProps,
                activeItem: myItem,
                items: [myItem],
                query: "",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<QueryList<Film> {...props} />);
            filmQueryList.setProps(props);
            expect(testProps.onActiveItemChange.callCount).toBe(0);
        });

        it("ensure activeItem changes on query change", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                items: [TOP_100_FILMS[0]],
                query: "abc",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<QueryList<Film> {...props} />);
            expect(filmQueryList.state().activeItem).toEqual(TOP_100_FILMS[0]);
            filmQueryList.setProps({
                items: [TOP_100_FILMS[1]],
                query: "123",
            });
            expect(filmQueryList.state().activeItem).toEqual(TOP_100_FILMS[1]);
        });

        it("ensure activeItem changes on when no longer in new items", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                items: [TOP_100_FILMS[0]],
                query: "abc",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<QueryList<Film> {...props} />);
            expect(filmQueryList.state().activeItem).toEqual(TOP_100_FILMS[0]);
            filmQueryList.setProps({
                items: [TOP_100_FILMS[1]],
            });
            expect(filmQueryList.state().activeItem).toEqual(TOP_100_FILMS[1]);
        });
    });

    describe("activeItem state initialization", () => {
        it("initializes to first filtered item when uncontrolled", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                // Filter down to only item at index 11, so item at index 11 should be
                // chosen as default activeItem
                itemPredicate: (_query, item) => item === TOP_100_FILMS[11],
                query: "123",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<QueryList<Film> {...props} />);
            expect(filmQueryList.state().activeItem === TOP_100_FILMS[11]).toBeTruthy();
        });

        it("initializes to controlled activeItem prop (non-null)", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                // List is not filtered, and item at index 11 is explicitly chosen as activeItem
                activeItem: TOP_100_FILMS[11],
            };
            const filmQueryList: FilmQueryListWrapper = mount(<QueryList<Film> {...props} />);
            expect(filmQueryList.state().activeItem === TOP_100_FILMS[11]).toBeTruthy();
        });

        it("initializes to controlled activeItem prop (null)", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                activeItem: null,
            };
            const filmQueryList: FilmQueryListWrapper = mount(<QueryList<Film> {...props} />);
            expect(filmQueryList.state().activeItem === null).toBeTruthy();
        });

        it("createNewItemPosition affects position of create new item", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                createNewItemFromQuery: sinon.spy(),
                createNewItemRenderer: () => <article />,
                items: TOP_100_FILMS.slice(0, 4),
                query: "the",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<QueryList<Film> {...props} />);
            expect(filmQueryList.find(Menu).children().children().last().is("article")).toBeTruthy();
            filmQueryList.setProps({ createNewItemPosition: "first" });
            expect(filmQueryList.find(Menu).children().children().first().is("article")).toBeTruthy();
        });
    });

    describe("scrolling", () => {
        it("brings active item into view");
    });

    describe("pasting", () => {
        const onItemsPaste = sinon.spy();

        const itemPredicate: ItemPredicate<Film> = (query: string, film: Film, _i?: number, exactMatch?: boolean) => {
            return exactMatch === true ? query.toLowerCase() === film.title.toLowerCase() : true;
        };

        function mountForPasteTest(overrideProps: Partial<QueryListProps<Film>> = {}) {
            // Placeholder. This will be overwritten by the mounted component.
            let handlePaste: (queries: string[]) => void;

            const props: QueryListProps<Film> = {
                ...testProps,
                itemPredicate,
                onItemsPaste,
                renderer: sinon.spy((listItemsProps: QueryListRendererProps<Film>) => {
                    handlePaste = listItemsProps.handlePaste;
                    return testProps.renderer(listItemsProps);
                }),
                ...overrideProps,
            };

            const filmQueryList: FilmQueryListWrapper = mount(<QueryList<Film> {...props} />);
            // `handlePaste` will have been set by now, because `props.renderer`
            // will have been called.
            return { filmQueryList, handlePaste: handlePaste! };
        }

        afterEach(() => {
            onItemsPaste.resetHistory();
        });

        it("converts 1 pasted value into an item", () => {
            const { filmQueryList, handlePaste } = mountForPasteTest();

            const pastedValue = TOP_100_FILMS[0].title;
            handlePaste([pastedValue]);

            expect(onItemsPaste.calledOnce).toBe(true);
            expect(onItemsPaste.args[0][0]).toEqual([TOP_100_FILMS[0]]);
            expect(filmQueryList.state().activeItem).toEqual(TOP_100_FILMS[0]);
            expect(filmQueryList.state().query).toEqual("");
        });

        it("convert multiple pasted values into items", () => {
            const { filmQueryList, handlePaste } = mountForPasteTest();

            // Paste items in unsorted order for fun.
            const item1 = TOP_100_FILMS[6];
            const item2 = TOP_100_FILMS[0];
            const item3 = TOP_100_FILMS[3];

            const pastedValue1 = item1.title;
            const pastedValue2 = item2.title;
            const pastedValue3 = item3.title;

            act(() => {
                handlePaste([pastedValue1, pastedValue2, pastedValue3]);
            });

            expect(onItemsPaste.calledOnce).toBe(true);
            // Emits all three items.
            expect(onItemsPaste.args[0][0]).toEqual([item1, item2, item3]);
            // Highlight the last item pasted.
            expect(filmQueryList.state().activeItem).toEqual(item3);
            expect(filmQueryList.state().query).toEqual("");
        });

        it("concatenates unrecognized values into the ghost input by default", () => {
            const { filmQueryList, handlePaste } = mountForPasteTest();

            const item2 = TOP_100_FILMS[6];
            const item4 = TOP_100_FILMS[3];

            const pastedValue1 = "unrecognized1";
            const pastedValue2 = item2.title;
            const pastedValue3 = "unrecognized2";
            const pastedValue4 = item4.title;

            act(() => {
                handlePaste([pastedValue1, pastedValue2, pastedValue3, pastedValue4]);
            });

            expect(onItemsPaste.calledOnce).toBe(true);
            // Emits just the 2 valid items.
            expect(onItemsPaste.args[0][0]).toEqual([item2, item4]);
            // Highlight the last item pasted.
            expect(filmQueryList.state().activeItem).toEqual(item4);
            expect(filmQueryList.state().query).toEqual("unrecognized1, unrecognized2");
        });

        it("creates new items out of unrecognized values if 'Create item' option is enabled", () => {
            const createdRank = 0;
            const createdYear = 2019;

            const { filmQueryList, handlePaste } = mountForPasteTest({
                // Must pass these two props to enable the "Create item" option.
                createNewItemFromQuery: query => ({
                    rank: createdRank,
                    title: query,
                    year: createdYear,
                }),
                createNewItemRenderer: () => <div>Create item</div>,
            });

            const item1 = TOP_100_FILMS[6];
            const item2 = TOP_100_FILMS[3];

            const pastedValue1 = item1.title;
            const pastedValue2 = item2.title;
            // Paste this item last.
            const pastedValue3 = "unrecognized";

            act(() => {
                handlePaste([pastedValue1, pastedValue2, pastedValue3]);
            });

            const createdItem = { rank: createdRank, title: "unrecognized", year: createdYear };

            expect(onItemsPaste.calledOnce).toBe(true);
            // Emits 2 existing items and 1 newly created item.
            expect(onItemsPaste.args[0][0]).toEqual([item1, item2, createdItem]);
            // Highlight the last *already existing* item pasted.
            expect(filmQueryList.state().activeItem).toEqual(item2);
            expect(filmQueryList.state().query).toEqual("");
        });
    });

    describe("query", () => {
        it("trims leading and trailing whitespace when creating new items", () => {
            let triggerInputQueryChange: ((e: any) => void) | undefined;
            const createNewItemFromQuerySpy = sinon.spy();
            const createNewItemRendererSpy = sinon.spy();
            // we must supply our own renderer so that we can hook into QueryListRendererProps#handleQueryChange
            const renderer = sinon.spy((props: QueryListRendererProps<Film>) => {
                triggerInputQueryChange = props.handleQueryChange;
                return <div>{props.itemList}</div>;
            });
            shallow(
                <QueryList<Film>
                    {...testProps}
                    renderer={renderer}
                    createNewItemFromQuery={createNewItemFromQuerySpy}
                    createNewItemRenderer={createNewItemRendererSpy}
                />,
            );

            const untrimmedQuery = " foo ";
            const trimmedQuery = untrimmedQuery.trim();

            expect(triggerInputQueryChange).toBeDefined();
            triggerInputQueryChange!({ target: { value: untrimmedQuery } });
            expect(createNewItemFromQuerySpy.calledWith(trimmedQuery)).toBe(true);
            expect(createNewItemRendererSpy.calledWith(trimmedQuery)).toBe(true);
        });

        it("resets the query after creating new item if resetOnSelect=true", () => {
            const onQueryChangeSpy = runResetOnSelectTest(true);
            expect(onQueryChangeSpy.calledWith("")).toBe(true);
        });

        it("does not reset the query after creating new item if resetOnSelect=false", () => {
            const onQueryChangeSpy = runResetOnSelectTest(false);
            expect(onQueryChangeSpy.notCalled).toBe(true);
        });

        function runResetOnSelectTest(resetOnSelect: boolean): sinon.SinonSpy {
            let triggerItemCreate: ((e: any) => void) | undefined;
            const onQueryChangeSpy = sinon.spy();
            // supply a custom renderer so we can hook into handleClick and invoke it ourselves later
            const createNewItemRenderer = sinon.spy(
                (_query: string, _active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => {
                    triggerItemCreate = handleClick;
                    return <div />;
                },
            );
            const queryList = shallow(
                <QueryList<Film>
                    {...testProps}
                    // Must return something in order for item creation to work.
                    createNewItemFromQuery={() => ({ rank: 0, title: "irrelevant", year: 0 })}
                    createNewItemRenderer={createNewItemRenderer}
                    onQueryChange={onQueryChangeSpy}
                    resetOnSelect={resetOnSelect}
                />,
            );

            // Change the query to something non-empty so we can ensure it wasn't cleared.
            // Ignore this change in the spy.
            (queryList.instance() as QueryList<Film>).setQuery("some query");
            onQueryChangeSpy.resetHistory();

            expect(triggerItemCreate).toBeDefined();
            triggerItemCreate!({});

            return onQueryChangeSpy;
        }
    });
});
