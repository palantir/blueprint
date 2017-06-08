/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Film, TOP_100_FILMS } from "../examples/data";
import { IInputListRendererProps, InputList } from "../src/index";

describe("<InputList>", () => {
    const FilmInputList = InputList.ofType<Film>();
    let props: {
        activeItem: Film,
        items: Film[],
        onActiveItemChange: Sinon.SinonSpy;
        onItemSelect: Sinon.SinonSpy,
        renderer: Sinon.SinonSpy,
    };

    beforeEach(() => {
        props = {
            activeItem: TOP_100_FILMS[0],
            items: TOP_100_FILMS,
            onActiveItemChange: sinon.spy(),
            onItemSelect: sinon.spy(),
            renderer: sinon.spy(() => <div />), // must render something
        };
    });

    describe("filtering", () => {
        it("itemPredicate filters each item by query", () => {
            const predicate = sinon.spy((query: string, film: Film) => film.year === +query);
            shallow(<FilmInputList {...props} itemPredicate={predicate} query="1980" />);

            assert.equal(predicate.callCount, props.items.length, "called once per item");
            const { filteredItems } = props.renderer.args[0][0] as IInputListRendererProps<Film>;
            assert.lengthOf(filteredItems, 2, "returns only films from 1980");
        });

        it("itemListPredicate filters entire list by query", () => {
            const predicate = sinon.spy((query: string, films: Film[]) => films.filter((f) => f.year === +query));
            shallow(<FilmInputList {...props} itemListPredicate={predicate} query="1980" />);

            assert.equal(predicate.callCount, 1, "called once for entire list");
            const { filteredItems } = props.renderer.args[0][0] as IInputListRendererProps<Film>;
            assert.lengthOf(filteredItems, 2, "returns only films from 1980");
        });

        it("prefers itemListPredicate if both are defined", () => {
            const predicate = sinon.spy(() => true);
            const listPredicate = sinon.spy(() => true);
            shallow(<FilmInputList
                {...props}
                itemPredicate={predicate}
                itemListPredicate={listPredicate}
                query="x"
            />);
            assert.isTrue(listPredicate.called, "listPredicate should be invoked");
            assert.isFalse(predicate.called, "item predicate should not be invoked");
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
