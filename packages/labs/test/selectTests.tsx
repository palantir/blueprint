/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Button, Classes, InputGroup, Popover } from "@blueprintjs/core";
import { assert } from "chai";
import * as classNames from "classnames";
import { mount } from "enzyme";
import * as React from "react";

import { Film, TOP_100_FILMS } from "../examples/data";
import { ISelectItemRendererProps, ISelectProps, Select } from "../src/index";

describe("<Select>", () => {
    const FilmSelect = Select.ofType<Film>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { inline: true, isOpen: true },
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
        assert.lengthOf(wrapper.find(Popover), 1, "should render Popover");
    });

    it("filterable=false hides InputGroup", () => {
        const wrapper = select({ filterable: false });
        assert.lengthOf(wrapper.find(InputGroup), 0, "should not render InputGroup");
        assert.lengthOf(wrapper.find(Popover), 1, "should render Popover");
    });

    it("disabled=false disables Popover", () => {
        const wrapper = select({ disabled: true, popoverProps: {} });
        wrapper.find("table").simulate("click");
        assert.strictEqual(wrapper.find(Popover).prop("isOpen"), false);
    });

    it("itemRenderer is called for each filtered child", () => {
        const wrapper = select({ query: "" });
        wrapper.setProps({ query: "1999" });
        // each item rendered before setting query, then 4 items filtered rendered twice (TODO: why)
        assert.equal(handlers.itemRenderer.callCount, 108);
    });

    it("renders noResults when given empty list", () => {
        const wrapper = select({ items: [], noResults: <address /> });
        assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
    });

    it("renders noResults when filtering returns empty list", () => {
        const wrapper = select({ noResults: <address />, query: "non-existent film name" });
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
        const wrapper = select({ resetOnSelect: false, query: "1972" });
        wrapper
            .find("a")
            .at(0)
            .simulate("click");
        assert.strictEqual(wrapper.state("activeItem"), TOP_100_FILMS[1]);
        assert.strictEqual(wrapper.state("query"), "1972");
    });

    it("clicking item resets state when resetOnSelect=true", () => {
        const wrapper = select({ resetOnSelect: true, query: "1972" });
        wrapper
            .find("a")
            .at(0)
            .simulate("click");
        assert.strictEqual(wrapper.state("activeItem"), TOP_100_FILMS[0]);
        assert.strictEqual(wrapper.state("query"), "");
    });

    it("if query is non-empty, the input value will stay in sync with the query prop", () => {
        const query = "nailed it";
        const wrapper = select({ query });
        const input = wrapper.find("input");

        assert.equal(input.prop("value"), query);
        assert.equal(wrapper.state("query"), query);

        (input.getDOMNode() as HTMLInputElement).value = "some other value";
        input.simulate("change");

        assert.equal(input.prop("value"), query);
        assert.equal(wrapper.state("query"), query);
    });

    it("if both query and inputProps.value are non-empty, query will take precedence", () => {
        const query = "nailed it";
        const wrapper = select({ query, inputProps: { value: "some other value" } });
        assert.equal(wrapper.find("input").prop("value"), query);
        assert.equal(wrapper.state("query"), query);
    });

    it("onQueryChange is called when the input value changes", () => {
        const onQueryChange = sinon.spy();
        const wrapper = select({ onQueryChange });
        const query = "nailed it";
        const input = wrapper.find("input");
        (input.getDOMNode() as HTMLInputElement).value = query;
        input.simulate("change");
        assert.isTrue(onQueryChange.calledOnce);
        assert.isTrue(onQueryChange.calledWithExactly(query));
    });

    it("if onQueryChange and inputProps.onChange are passed, both will be called", () => {
        const onQueryChange = sinon.spy();
        const onInputChange = sinon.spy();
        const wrapper = select({ onQueryChange, inputProps: { onChange: onInputChange } });
        wrapper.find("input").simulate("change");
        assert.isTrue(onQueryChange.calledOnce);
        assert.isTrue(onInputChange.calledOnce);
    });

    it("onQueryChange is called when resetOnSelect=true", () => {
        const onQueryChange = sinon.spy();
        const wrapper = select({ onQueryChange, resetOnSelect: true, query: "1972" });
        wrapper
            .find("a")
            .at(0)
            .simulate("click");
        assert.isTrue(onQueryChange.calledOnce);
        assert.isTrue(onQueryChange.calledWithExactly(""));
    });

    it("onQueryChange is called when resetOnClose=true", () => {
        const onQueryChange = sinon.spy();
        const wrapper = select({ onQueryChange, resetOnClose: true, popoverProps: {}, query: "1972" });
        wrapper.find("table").simulate("click");
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));
        wrapper.find("table").simulate("click");
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
        assert.isTrue(onQueryChange.calledOnce);
        assert.isTrue(onQueryChange.calledWithExactly(""));
    });

    it("onQueryChange is called when clear button pressed", () => {
        const onQueryChange = sinon.spy();
        const wrapper = select({ onQueryChange, query: "1972" });
        wrapper
            .find(InputGroup)
            .find(Button)
            .simulate("click");
        assert.isTrue(onQueryChange.calledOnce);
        assert.isTrue(onQueryChange.calledWithExactly(""));
    });

    it("input can be controlled with inputProps", () => {
        const value = "nailed it";
        const onChange = sinon.spy();

        const wrapper = select({ inputProps: { value, onChange } });
        assert.equal(wrapper.state("query"), value);

        const input = wrapper.find("input");
        assert.equal(input.prop("value"), value);
        assert.equal(wrapper.state("query"), value);

        input.simulate("change");
        assert.isTrue(onChange.calledOnce);

        const value2 = "nailed it again";
        wrapper.setProps({ inputProps: { value: value2 } });
        assert.equal(wrapper.find("input").prop("value"), value2);
        assert.equal(wrapper.state("query"), value2);
    });

    it("popover can be controlled with popoverProps", () => {
        // Select defines its own popoverWillOpen so this ensures that the passthrough happens
        const popoverWillOpen = sinon.spy();
        const tetherOptions = {}; // our own instance
        const wrapper = select({ popoverProps: { popoverWillOpen, tetherOptions } });
        wrapper.find("table").simulate("click");
        assert.strictEqual(wrapper.find(Popover).prop("tetherOptions"), tetherOptions);
        assert.isTrue(popoverWillOpen.calledOnce);
    });

    it("popover can be controlled with popoverProps.isOpen", () => {
        const wrapper = select({ popoverProps: { isOpen: false } });
        wrapper.find("table").simulate("click");
        assert.strictEqual(wrapper.find(Popover).prop("isOpen"), false);
        wrapper.setProps({ popoverProps: { isOpen: true } });
        assert.strictEqual(wrapper.find(Popover).prop("isOpen"), true);
    });

    it("returns focus to focusable target after popover closed");

    function select(props: Partial<ISelectProps<Film>> = {}) {
        return mount(
            <FilmSelect {...defaultProps} {...handlers} {...props}>
                <table />
            </FilmSelect>,
        );
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
