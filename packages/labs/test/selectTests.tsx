/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, InputGroup } from "@blueprintjs/core";
import { assert } from "chai";
import * as classNames from "classnames";
import { mount } from "enzyme";
import * as React from "react";

import { Film, TOP_100_FILMS } from "../examples/data";
import { ISelectItemRendererProps, ISelectProps, Select, Popover2 } from "../src/index";

describe("<Select>", () => {
    const FilmSelect = Select.ofType<Film>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { inline: true, isOpen: true },
        query: "",
    };
    let handlers: {
        itemPredicate: Sinon.SinonSpy;
        itemRenderer: Sinon.SinonSpy;
        onItemSelect: Sinon.SinonSpy;
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
        assert.lengthOf(wrapper.find(Popover2), 1, "should render Popover");
    });

    it("filterable=false hides InputGroup", () => {
        const wrapper = select({ filterable: false });
        assert.lengthOf(wrapper.find(InputGroup), 0, "should not render InputGroup");
        assert.lengthOf(wrapper.find(Popover2), 1, "should render Popover");
    });

    it("disabled=false disables Popover", () => {
        const wrapper = select({ disabled: true, popoverProps: {} });
        wrapper.find("table").simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);
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

    it("clicking item invokes onItemSelect", () => {
        const wrapper = select();
        wrapper
            .find("a")
            .at(4)
            .simulate("click");
        assert.strictEqual(handlers.onItemSelect.args[0][0], TOP_100_FILMS[4]);
    });

    it("clicking item preserves state when resetOnSelect=false", () => {
        const wrapper = select({ resetOnSelect: false }, "1972");
        wrapper
            .find("a")
            .at(0)
            .simulate("click");
        assert.strictEqual(wrapper.state("activeItem"), TOP_100_FILMS[1]);
        assert.strictEqual(wrapper.state("query"), "1972");
    });

    it("clicking item resets state when resetOnSelect=true", () => {
        const wrapper = select({ resetOnSelect: true }, "1972");
        wrapper
            .find("a")
            .at(0)
            .simulate("click");
        assert.strictEqual(wrapper.state("activeItem"), TOP_100_FILMS[0]);
        assert.strictEqual(wrapper.state("query"), "");
    });

    it("input can be controlled with inputProps", () => {
        const value = "nailed it";
        const onChange = sinon.spy();

        const input = select({ inputProps: { value, onChange } }).find("input");
        assert.equal(input.prop("value"), value);

        input.simulate("change");
        assert.isTrue(onChange.calledOnce);
    });

    it("popover can be controlled with popoverProps", () => {
        // Select defines its own popoverWillOpen so this ensures that the passthrough happens
        const popoverWillOpen = sinon.spy();
        const modifiers = {}; // our own instance
        const wrapper = select({ popoverProps: { isOpen: undefined, popoverWillOpen, modifiers } });
        wrapper.find("table").simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("modifiers"), modifiers);
        assert.isTrue(popoverWillOpen.calledOnce);
    });

    it("returns focus to focusable target after popover closed");

    function select(props: Partial<ISelectProps<Film>> = {}, query?: string) {
        const wrapper = mount(
            <FilmSelect {...defaultProps} {...handlers} {...props}>
                <table />
            </FilmSelect>,
        );
        if (query !== undefined) {
            wrapper.setState({ query });
        }
        return wrapper;
    }
});

function renderFilm({ handleClick, isActive, item: film }: ISelectItemRendererProps<Film>) {
    const classes = classNames({
        [Classes.ACTIVE]: isActive,
        [Classes.INTENT_PRIMARY]: isActive,
    });
    return (
        <a className={classes} key={film.rank} onClick={handleClick}>
            {film.rank}. {film.title}
        </a>
    );
}

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}
