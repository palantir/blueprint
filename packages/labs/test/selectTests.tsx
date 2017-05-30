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
import { Select } from "../src/index";

describe("<Select>", () => {
    const POPOVER_PROPS = { inline: true, isOpen: true };
    const FilmSelect = Select.ofType<Film>();
    let props: {
        items: Film[],
        itemPredicate: Sinon.SinonSpy,
        itemRenderer: Sinon.SinonSpy,
        onItemSelect: Sinon.SinonSpy,
        onQueryChange: Sinon.SinonSpy,
    };

    beforeEach(() => {
        props = {
            itemPredicate: sinon.spy((film: Film, query: string) => query === "" || film.year === +query),
            itemRenderer: sinon.spy(renderFilm),
            items: TOP_100_FILMS,
            onItemSelect: sinon.spy(),
            onQueryChange: sinon.spy(),
        };
    });

    it("renders a Popover around children that contains InputGroup and items", () => {
        const wrapper = mount(<FilmSelect {...props} query="" popoverProps={POPOVER_PROPS} />);
        assert.lengthOf(wrapper.find(InputGroup), 1, "should render InputGroup");
        assert.lengthOf(wrapper.find(Popover), 1, "should render Popover");
    });

    it("filterable=false hides InputGroup", () => {
        const wrapper = mount(<FilmSelect {...props} filterable={false} query="" popoverProps={POPOVER_PROPS} />);
        assert.lengthOf(wrapper.find(InputGroup), 0, "should not render InputGroup");
        assert.lengthOf(wrapper.find(Popover), 1, "should render Popover");

    });

    it("itemRenderer is called for each filtered child", () => {
        mount(<FilmSelect {...props} query="1999" popoverProps={POPOVER_PROPS} />);
        assert.equal(props.itemRenderer.callCount, 4);
    });

    it("renders noResults when given empty list", () => {
        const wrapper = mount(<FilmSelect
            {...props}
            items={[]}
            noResults={<address />}
            query=""
            popoverProps={POPOVER_PROPS}
        />);
        assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
    });
    it("renders noResults when filtering returns empty list", () => {
        const wrapper = mount(<FilmSelect
            {...props}
            noResults={<address />}
            query="non-existent film name"
            popoverProps={POPOVER_PROPS}
        />);
        assert.lengthOf(wrapper.find("address"), 1, "should find noResults");

    });
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
