/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import { assert } from "chai";
import { mount, ReactWrapper, shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

// this is an awkward import across the monorepo, but we'd rather not introduce a cyclical dependency or create another package
import { IQueryListProps } from "@blueprintjs/select";
import { IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/examples/select-examples/films";
import { IQueryListRendererProps, IQueryListState, ItemListPredicate, ItemListRenderer, QueryList } from "../src/index";

type FilmQueryListWrapper = ReactWrapper<IQueryListProps<IFilm>, IQueryListState<IFilm>>;

describe("<QueryList>", () => {
    const FilmQueryList = QueryList.ofType<IFilm>();
    const testProps = {
        itemRenderer: sinon.spy(renderFilm),
        items: TOP_100_FILMS.slice(0, 20),
        onActiveItemChange: sinon.spy(),
        onItemSelect: sinon.spy(),
        renderer: sinon.spy((props: IQueryListRendererProps<IFilm>) => <div>{props.itemList}</div>),
    };

    beforeEach(() => {
        testProps.itemRenderer.resetHistory();
        testProps.onActiveItemChange.resetHistory();
        testProps.onItemSelect.resetHistory();
        testProps.renderer.resetHistory();
    });

    describe("itemListRenderer", () => {
        const itemListRenderer: ItemListRenderer<IFilm> = props => (
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
            const predicate = sinon.spy((query: string, film: IFilm) => film.year === +query);
            shallow(<FilmQueryList {...testProps} itemPredicate={predicate} query="1994" />);

            assert.equal(predicate.callCount, testProps.items.length, "called once per item");
            const { filteredItems } = testProps.renderer.args[0][0] as IQueryListRendererProps<IFilm>;
            assert.lengthOf(filteredItems, 3, "returns only films from 1994");
        });

        it("itemListPredicate filters entire list by query", () => {
            const predicate = sinon.spy((query: string, films: IFilm[]) => films.filter(f => f.year === +query));
            shallow(<FilmQueryList {...testProps} itemListPredicate={predicate} query="1994" />);

            assert.equal(predicate.callCount, 1, "called once for entire list");
            const { filteredItems } = testProps.renderer.args[0][0] as IQueryListRendererProps<IFilm>;
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
            const { filteredItems } = testProps.renderer.args[0][0] as IQueryListRendererProps<IFilm>;
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
            const props: IQueryListProps<IFilm> = {
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
            const props: IQueryListProps<IFilm> = {
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
    });

    describe("activeItem state initialization", () => {
        it("initializes to first filtered item when uncontrolled", () => {
            const props: IQueryListProps<IFilm> = {
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
            const props: IQueryListProps<IFilm> = {
                ...testProps,
                // List is not filtered, and item at index 11 is explicitly chosen as activeItem
                activeItem: TOP_100_FILMS[11],
            };
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            assert(filmQueryList.state().activeItem === TOP_100_FILMS[11]);
        });

        it("initializes to controlled activeItem prop (null)", () => {
            const props: IQueryListProps<IFilm> = {
                ...testProps,
                activeItem: null,
            };
            const filmQueryList: FilmQueryListWrapper = mount(<FilmQueryList {...props} />);
            assert(filmQueryList.state().activeItem === null);
        });
    });

    describe("scrolling", () => {
        it("brings active item into view");
    });
});
