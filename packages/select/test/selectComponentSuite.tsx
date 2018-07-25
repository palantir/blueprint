/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { HTMLInputProps, Keys } from "@blueprintjs/core";
import { assert } from "chai";
import { ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import { filterFilm, IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/examples/select-examples/films";
import { IListItemsProps } from "../src/index";

export function selectComponentSuite<P extends IListItemsProps<IFilm>, S extends { query: string; activeItem?: IFilm }>(
    render: (props: IListItemsProps<IFilm>) => ReactWrapper<P, S>,
    findInput: (wrapper: ReactWrapper<P, S>) => ReactWrapper<HTMLInputProps> = wrapper => wrapper.find("input"),
    findItems: (wrapper: ReactWrapper<P, S>) => ReactWrapper = wrapper => wrapper.find("a"),
) {
    const testProps = {
        itemPredicate: filterFilm,
        itemRenderer: sinon.spy(renderFilm),
        items: TOP_100_FILMS.slice(0, 20),
        onItemSelect: sinon.spy(),
    };

    beforeEach(() => {
        testProps.itemRenderer.resetHistory();
        testProps.onItemSelect.resetHistory();
    });

    describe("common behavior", () => {
        it("itemRenderer is called for each child", () => {
            const wrapper = render(testProps);
            // each item is rendered once
            assert.equal(testProps.itemRenderer.callCount, 20);
            // only filtered items re-rendered
            testProps.itemRenderer.resetHistory();
            wrapper.setState({ query: "1999" });
            assert.equal(testProps.itemRenderer.callCount, 2, "re-render");
        });

        it("renders noResults when given empty list", () => {
            const wrapper = render({ ...testProps, items: [], noResults: <address /> }).setState({ query: "19" });
            assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
        });

        it("renders noResults when filtering returns empty list", () => {
            const wrapper = render({ ...testProps, noResults: <address /> }).setState({
                query: "non-existent film name",
            });
            assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
        });

        it("clicking item invokes onItemSelect and changes active item", () => {
            const wrapper = render(testProps).setState({ query: "19" });
            findItems(wrapper)
                .at(4)
                .simulate("click");
            assert.strictEqual(testProps.onItemSelect.args[0][0].rank, 6, "onItemSelect");
            assert.strictEqual(wrapper.state("activeItem"), TOP_100_FILMS[5], "activeItem");
        });
    });

    describe("keyboard", () => {
        it("arrow down changes ativeItem to next filtered item", () => {
            const wrapper = render(testProps);
            findInput(wrapper)
                .simulate("keydown", { keyCode: Keys.ARROW_DOWN })
                .simulate("keydown", { keyCode: Keys.ARROW_DOWN })
                .simulate("keydown", { keyCode: Keys.ARROW_DOWN });
            assert.equal(wrapper.state("activeItem"), TOP_100_FILMS[2]);
        });

        it("arrow up changes ativeItem to previous filtered item", () => {
            const wrapper = render(testProps);
            findInput(wrapper).simulate("keydown", { keyCode: Keys.ARROW_UP });
            assert.equal(wrapper.state("activeItem"), TOP_100_FILMS[19]);
        });

        it("enter invokes onItemSelect with active item", () => {
            const wrapper = render(testProps);
            findInput(wrapper)
                .simulate("keydown", { keyCode: Keys.ARROW_DOWN })
                .simulate("keyup", { keyCode: Keys.ENTER });
            assert.equal(testProps.onItemSelect.lastCall.args[0], wrapper.state("activeItem"));
        });
    });
}
