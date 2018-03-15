/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

// this is an awkward import across the monorepo, but we'd rather not introduce a cyclical dependency or create another package
import { IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/examples/select-examples/films";
import { IMenuRendererProps, IQueryListRendererProps, ItemListPredicate, QueryList } from "../src/index";

describe("<QueryList>", () => {
    const FilmQueryList = QueryList.ofType<IFilm>();
    const testProps = {
        activeItem: TOP_100_FILMS[0],
        itemRenderer: renderFilm,
        items: TOP_100_FILMS,
        onActiveItemChange: sinon.spy(),
        onItemSelect: sinon.spy(),
        renderer: sinon.spy(() => <div />), // must render something,
    };

    beforeEach(() => {
        testProps.onActiveItemChange.resetHistory();
        testProps.onItemSelect.resetHistory();
        testProps.renderer.resetHistory();
    });

    describe("filtering", () => {
        it("itemPredicate filters each item by query", () => {
            const predicate = sinon.spy((query: string, film: IFilm) => film.year === +query);
            shallow(<FilmQueryList {...testProps} itemPredicate={predicate} query="1980" />);

            assert.equal(predicate.callCount, testProps.items.length, "called once per item");
            const { filteredItems } = testProps.renderer.args[0][0] as IQueryListRendererProps<IFilm>;
            assert.lengthOf(filteredItems, 2, "returns only films from 1980");
        });

        it("itemListPredicate filters entire list by query", () => {
            const predicate = sinon.spy((query: string, films: IFilm[]) => films.filter(f => f.year === +query));
            shallow(<FilmQueryList {...testProps} itemListPredicate={predicate} query="1980" />);

            assert.equal(predicate.callCount, 1, "called once for entire list");
            const { filteredItems } = testProps.renderer.args[0][0] as IQueryListRendererProps<IFilm>;
            assert.lengthOf(filteredItems, 2, "returns only films from 1980");
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
            const { filteredItems } = testProps.renderer.args[0][0] as IQueryListRendererProps<IFilm>;
            assert.lengthOf(filteredItems, testProps.items.length, "returns all films");
        });

        it("ensure onActiveItemChange is not called with undefined and empty list", () => {
            const myItem = { title: "Toy Story 3", year: 2010, rank: 1 };
            const filmQueryList = mount(<FilmQueryList {...testProps} items={[myItem]} activeItem={myItem} query="" />);
            filmQueryList.setProps({ query: "FAKE_QUERY" });
            filmQueryList.setProps({ activeItem: undefined });
            assert.isTrue(testProps.onActiveItemChange.returned(undefined));
            assert.equal(testProps.onActiveItemChange.callCount, 1);
        });
    });

    describe("renderFilteredItems()", () => {
        const PROPS: IMenuRendererProps<string> = {
            filteredItems: ["one"],
            items: ["one", "two", "three"],
            itemsParentRef: sinon.stub(),
            query: "x",
            renderItem: () => <div />,
        };
        const noResults = <strong />;
        const initialContent = <article />;

        it("returns noResults if filtered items is empty", () => {
            const element = QueryList.renderFilteredItems({ ...PROPS, filteredItems: [] }, noResults);
            assert.equal(element, noResults);
        });

        it("returns initialContent if query is empty", () => {
            const element = QueryList.renderFilteredItems({ ...PROPS, query: "" }, noResults, initialContent);
            assert.equal(element, initialContent);
        });

        it("returns filteredItems mapped through renderItem", () => {
            const elements = QueryList.renderFilteredItems(PROPS) as JSX.Element[];
            assert.lengthOf(elements, PROPS.filteredItems.length);
        });
    });

    describe("keyboard", () => {
        it("arrow down invokes onActiveItemChange with next filtered item");
        it("arrow up invokes onActiveItemChange with previous filtered item");
        it("enter invokes onItemSelect with active item");
    });

    describe("scrolling", () => {
        it("brings active item into view");
    });
});
