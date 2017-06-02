/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, InputGroup, MenuItem, Popover } from "@blueprintjs/core";
import { assert } from "chai";
import * as classNames from "classnames";
import { mount } from "enzyme";
import * as React from "react";

import { Film, TOP_100_FILMS } from "../examples/data";
import { ISelectProps, Select } from "../src/index";

describe("<Select>", () => {
    const FilmSelect = Select.ofType<Film>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { inline: true, isOpen: true },
        query: "",
    };
    let handlers: {
        itemPredicate: Sinon.SinonSpy,
        itemRenderer: Sinon.SinonSpy,
        onItemSelect: Sinon.SinonSpy,
    };

    beforeEach(() => {
        handlers = {
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
    });

    it("renders a Popover around children that contains InputGroup and items", () => {
        const wrapper = select();
        assert.lengthOf(wrapper.find(InputGroup), 1, "should render InputGroup");
        assert.lengthOf(wrapper.find(Popover), 1, "should render Popover");
    });

    it("filterable=false hides InputGroup", () => {
        const wrapper = select({ filterable: false });
        assert.lengthOf(wrapper.find(InputGroup), 0, "should not render InputGroup");
        assert.lengthOf(wrapper.find(Popover), 1, "should render Popover");

    });

    it("itemRenderer is called for each filtered child", () => {
        select({}, "1999");
        // each item rendered before setting query, then 4 items filtered rendered twice (TODO: why)
        assert.equal(handlers.itemRenderer.callCount, 108);
    });

    it("renders noResults when given empty list", () => {
        const wrapper = select({ items: [], noResults: <address /> });
        assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
    });

    it("renders noResults when filtering returns empty list", () => {
        const wrapper = select({ noResults: <address /> }, "non-existent film name");
        assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
    });

    // it("clicking item invokes onSelectItem");

    function select(props: Partial<ISelectProps<Film>> = {}, query?: string) {
        const wrapper = mount(<FilmSelect {...defaultProps} {...handlers} {...props} />);
        if (query !== undefined) {
            wrapper.setState({ query });
        }
        return wrapper;
    }
});

function renderFilm(film: Film, isSelected: boolean, onClick: React.MouseEventHandler<HTMLElement>) {
    const classes = classNames({
        [Classes.ACTIVE]: isSelected,
        [Classes.INTENT_PRIMARY]: isSelected,
    });
    return (
        <MenuItem
            className={classes}
            label={film.year.toString()}
            key={film.rank}
            onClick={onClick}
            text={`${film.rank}. ${film.title}`}
        />
    );
}

function filterByYear(film: Film, query: string) {
    return query === "" || film.year.toString() === query;
}
