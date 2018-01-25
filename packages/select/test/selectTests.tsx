/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { InputGroup, Popover } from "@blueprintjs/core";
import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import * as Films from "../../docs-app/src/examples/select-examples/films";
import { ISelectProps, Select } from "../src/index";

describe("<Select>", () => {
    const FilmSelect = Select.ofType<Films.Film>();
    const defaultProps = {
        items: Films.items,
        popoverProps: { inline: true, isOpen: true },
        query: "",
    };
    let handlers: {
        itemPredicate: sinon.SinonSpy;
        itemRenderer: sinon.SinonSpy;
        onItemSelect: sinon.SinonSpy;
    };

    beforeEach(() => {
        handlers = {
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(Films.itemRenderer),
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

    it("disabled=true disables Popover", () => {
        const wrapper = select({ disabled: true, popoverProps: { inline: true } });
        wrapper.find("table").simulate("click");
        assert.strictEqual(wrapper.find(Popover).prop("isOpen"), false);
    });

    it("itemRenderer is called for each child", () => {
        select({}, "1999");
        // each item is rendered three times :(
        assert.equal(handlers.itemRenderer.callCount, Films.items.length * 3);
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
        assert.strictEqual(handlers.onItemSelect.args[0][0], Films.items[4]);
    });

    it("clicking item preserves state when resetOnSelect=false", () => {
        const wrapper = select({ resetOnSelect: false }, "1972");
        wrapper
            .find("a")
            .at(0)
            .simulate("click");
        assert.strictEqual(wrapper.state("activeItem"), Films.items[1]);
        assert.strictEqual(wrapper.state("query"), "1972");
    });

    it("clicking item resets state when resetOnSelect=true", () => {
        const wrapper = select({ resetOnSelect: true }, "1972");
        wrapper
            .find("a")
            .at(0)
            .simulate("click");
        assert.strictEqual(wrapper.state("activeItem"), Films.items[0]);
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
        assert.strictEqual(wrapper.find(Popover).prop("modifiers"), modifiers);
        assert.isTrue(popoverWillOpen.calledOnce);
    });

    it("returns focus to focusable target after popover closed");

    function select(props: Partial<ISelectProps<Films.Film>> = {}, query?: string) {
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

function filterByYear(query: string, film: Films.Film) {
    return query === "" || film.year.toString() === query;
}
