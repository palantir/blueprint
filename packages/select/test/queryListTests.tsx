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

import { assert } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import { Menu } from "@blueprintjs/core";
import { QueryListProps } from "@blueprintjs/select";

import { Film, renderFilm, TOP_100_FILMS } from "../../docs-app/src/common/films";
import {
    QueryListRendererProps,
    QueryListState,
    ItemListPredicate,
    ItemListRenderer,
    ItemPredicate,
    QueryList,
} from "../src";

// this is an awkward import across the monorepo, but we'd rather not introduce a cyclical dependency or create another package

type FilmQueryListWrapper = ReactWrapper<QueryListProps<Film>, QueryListState<Film>>;

describe("<QueryList>", () => {
    const FilmQueryList = QueryList.ofType<Film>();
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
            const wrapper = shallow(<FilmQueryList {...testProps} />);
            const newItems = TOP_100_FILMS.slice(0, 1);
            wrapper.setProps({ items: newItems });
            assert.deepEqual(wrapper.state("filteredItems"), newItems);
        });
    });

    describe("itemListRenderer", () => {
        const itemListRenderer: ItemListRenderer<Film> = props => (
            <ul className="foo">{props.items.map(props.renderItem)}</ul>
        );

        it("renderItem calls itemRenderer", () => {
            const wrapper = shallow(<FilmQueryList {...testProps} itemListRenderer={itemListRenderer} />);
            assert.lengthOf(wrapper.find("ul.foo"), 1, "should find element");
            assert.equal(testProps.itemRenderer.callCount, 20);
        });
    });

    describe("filtering", () => {
        it("itemPredicate filters each item by query", () => {
            const predicate = sinon.spy((query: string, film: Film) => film.year === +query);
            shallow(<FilmQueryList {...testProps} itemPredicate={predicate} query="1994" />);

            assert.equal(predicate.callCount, testProps.items.length, "called once per item");
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            assert.lengthOf(filteredItems, 3, "returns only films from 1994");
        });

        it("itemListPredicate filters entire list by query", () => {
            const predicate = sinon.spy((query: string, films: Film[]) => films.filter(f => f.year === +query));
            shallow(<FilmQueryList {...testProps} itemListPredicate={predicate} query="1994" />);

            assert.equal(predicate.callCount, 1, "called once for entire list");
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            assert.lengthOf(filteredItems, 3, "returns only films from 1994");
        });

        it("prefers itemListPredicate if both are defined", () => {
            const predicate = sinon.spy(() => true);
            const listPredicate: ItemListPredicate<any> = (_q, items) => items;
            const listPredicateSpy = sinon.spy(listPredicate);
            shallow(
                <FilmQueryList
                    {...testProps}
                    itemPredicate={predicate}
                    itemListPredicate={listPredicateSpy}
                    query="1980"
                />,
            );
            assert.isTrue(listPredicateSpy.called, "listPredicate should be invoked");
            assert.isFalse(predicate.called, "item predicate should not be invoked");
        });

        it("omitting both predicate props is supported", () => {
            shallow(<FilmQueryList {...testProps} query="1980" />);
            const { filteredItems } = testProps.renderer.args[0][0] as QueryListRendererProps<Film>;
            assert.lengthOf(filteredItems, testProps.items.length, "returns all films");
        });

        it("ensure onActiveItemChange is not called with undefined and empty list", () => {
            const myItem = { title: "Toy Story 3", year: 2010, rank: 1 };
            const filmQueryList = mount(<FilmQueryList {...testProps} items={[myItem]} activeItem={myItem} query="" />);
            filmQueryList.setState({ query: "query" });
            filmQueryList.setState({ activeItem: undefined });
            assert.equal(testProps.onActiveItemChange.callCount, 0);
        });

        it("ensure onActiveItemChange is not called updating props and query doesn't change", () => {
            const myItem = { title: "Toy Story 3", year: 2010, rank: 1 };
            const props: QueryListProps<Film> = {
                ...testProps,
                activeItem: myItem,
                items: [myItem],
                query: "",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            filmQueryList.setProps(props);
            assert.equal(testProps.onActiveItemChange.callCount, 0);
        });

        it("ensure activeItem changes on query change", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                items: [TOP_100_FILMS[0]],
                query: "abc",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            assert.deepEqual(filmQueryList.state().activeItem, TOP_100_FILMS[0]);
            filmQueryList.setProps({
                items: [TOP_100_FILMS[1]],
                query: "123",
            });
            assert.deepEqual(filmQueryList.state().activeItem, TOP_100_FILMS[1]);
        });

        it("ensure activeItem changes on when no longer in new items", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                items: [TOP_100_FILMS[0]],
                query: "abc",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            assert.deepEqual(filmQueryList.state().activeItem, TOP_100_FILMS[0]);
            filmQueryList.setProps({
                items: [TOP_100_FILMS[1]],
            });
            assert.deepEqual(filmQueryList.state().activeItem, TOP_100_FILMS[1]);
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
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            assert(filmQueryList.state().activeItem === TOP_100_FILMS[11]);
        });

        it("initializes to controlled activeItem prop (non-null)", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                // List is not filtered, and item at index 11 is explicitly chosen as activeItem
                activeItem: TOP_100_FILMS[11],
            };
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            assert(filmQueryList.state().activeItem === TOP_100_FILMS[11]);
        });

        it("initializes to controlled activeItem prop (null)", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                activeItem: null,
            };
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            assert(filmQueryList.state().activeItem === null);
        });

        it("createNewItemPosition affects position of create new item", () => {
            const props: QueryListProps<Film> = {
                ...testProps,
                createNewItemFromQuery: sinon.spy(),
                createNewItemRenderer: () => <article />,
                items: TOP_100_FILMS.slice(0, 4),
                query: "the",
            };
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            assert(filmQueryList.find(Menu).children().children().last().is("article"));
            filmQueryList.setProps({ createNewItemPosition: "first" });
            assert(filmQueryList.find(Menu).children().children().first().is("article"));
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

            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
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

            assert.isTrue(onItemsPaste.calledOnce);
            assert.deepEqual(onItemsPaste.args[0][0], [TOP_100_FILMS[0]]);
            assert.deepEqual(filmQueryList.state().activeItem, TOP_100_FILMS[0]);
            assert.deepEqual(filmQueryList.state().query, "");
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

            handlePaste([pastedValue1, pastedValue2, pastedValue3]);

            assert.isTrue(onItemsPaste.calledOnce);
            // Emits all three items.
            assert.deepEqual(onItemsPaste.args[0][0], [item1, item2, item3]);
            // Highlight the last item pasted.
            assert.deepEqual(filmQueryList.state().activeItem, item3);
            assert.deepEqual(filmQueryList.state().query, "");
        });

        it("concatenates unrecognized values into the ghost input by default", () => {
            const { filmQueryList, handlePaste } = mountForPasteTest();

            const item2 = TOP_100_FILMS[6];
            const item4 = TOP_100_FILMS[3];

            const pastedValue1 = "unrecognized1";
            const pastedValue2 = item2.title;
            const pastedValue3 = "unrecognized2";
            const pastedValue4 = item4.title;

            handlePaste([pastedValue1, pastedValue2, pastedValue3, pastedValue4]);

            assert.isTrue(onItemsPaste.calledOnce);
            // Emits just the 2 valid items.
            assert.deepEqual(onItemsPaste.args[0][0], [item2, item4]);
            // Highlight the last item pasted.
            assert.deepEqual(filmQueryList.state().activeItem, item4);
            assert.deepEqual(filmQueryList.state().query, "unrecognized1, unrecognized2");
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

            handlePaste([pastedValue1, pastedValue2, pastedValue3]);
            const createdItem = { title: "unrecognized", rank: createdRank, year: createdYear };

            assert.isTrue(onItemsPaste.calledOnce);
            // Emits 2 existing items and 1 newly created item.
            assert.deepEqual(onItemsPaste.args[0][0], [item1, item2, createdItem]);
            // Highlight the last *already existing* item pasted.
            assert.deepEqual(filmQueryList.state().activeItem, item2);
            assert.deepEqual(filmQueryList.state().query, "");
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
                <FilmQueryList
                    {...testProps}
                    renderer={renderer}
                    createNewItemFromQuery={createNewItemFromQuerySpy}
                    createNewItemRenderer={createNewItemRendererSpy}
                />,
            );

            const untrimmedQuery = " foo ";
            const trimmedQuery = untrimmedQuery.trim();

            assert.isDefined(triggerInputQueryChange, "query list should render with input change callbacks");
            triggerInputQueryChange!({ target: { value: untrimmedQuery } });
            assert.isTrue(createNewItemFromQuerySpy.calledWith(trimmedQuery));
            assert.isTrue(createNewItemRendererSpy.calledWith(trimmedQuery));
        });

        it("resets the query after creating new item if resetOnSelect=true", () => {
            const onQueryChangeSpy = runResetOnSelectTest(true);
            assert.isTrue(onQueryChangeSpy.calledWith(""));
        });

        it("does not reset the query after creating new item if resetOnSelect=false", () => {
            const onQueryChangeSpy = runResetOnSelectTest(false);
            assert.isTrue(onQueryChangeSpy.notCalled);
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
                <FilmQueryList
                    {...testProps}
                    // Must return something in order for item creation to work.
                    // tslint:disable-next-line jsx-no-lambda
                    createNewItemFromQuery={() => ({ title: "irrelevant", rank: 0, year: 0 })}
                    createNewItemRenderer={createNewItemRenderer}
                    onQueryChange={onQueryChangeSpy}
                    resetOnSelect={resetOnSelect}
                />,
            );

            // Change the query to something non-empty so we can ensure it wasn't cleared.
            // Ignore this change in the spy.
            (queryList.instance() as QueryList<Film>).setQuery("some query");
            onQueryChangeSpy.resetHistory();

            assert.isDefined(triggerItemCreate, "query list should pass click handler to createNewItemRenderer");
            triggerItemCreate!({});

            return onQueryChangeSpy;
        }
    });
});
