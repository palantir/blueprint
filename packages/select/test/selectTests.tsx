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

import { IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/examples/select-examples/films";
import { ISelectProps, ISelectState, Select } from "../src/index";
import { selectComponentSuite } from "./selectComponentSuite";

describe("<Select>", () => {
    const FilmSelect = Select.ofType<IFilm>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
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
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
    });

    selectComponentSuite<ISelectProps<IFilm>, ISelectState>(props =>
        mount(<Select {...props} popoverProps={{ isOpen: true, usePortal: false }} />),
    );

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
        const wrapper = select({ disabled: true });
        assert.strictEqual(wrapper.find(Popover).prop("disabled"), true);
    });

    it("inputProps value and onChange are ignored", () => {
        const inputProps = { value: "nailed it", onChange: sinon.spy() };
        const input = select({ inputProps }).find("input");
        assert.notEqual(input.prop("onChange"), inputProps.onChange);
        assert.notEqual(input.prop("value"), inputProps.value);
    });

    it("popover can be controlled with popoverProps", () => {
        // Select defines its own onOpening so this ensures that the passthrough happens
        const onOpening = sinon.spy();
        const modifiers = {}; // our own instance
        const wrapper = select({ popoverProps: { onOpening, modifiers } });
        wrapper.find("article").simulate("click");
        assert.strictEqual(wrapper.find(Popover).prop("modifiers"), modifiers);
        assert.isTrue(onOpening.calledOnce);
    });

    it("returns focus to focusable target after popover closed");

    function select(props: Partial<ISelectProps<IFilm>> = {}, query?: string) {
        const wrapper = mount(
            <FilmSelect {...defaultProps} {...handlers} {...props}>
                <article />
            </FilmSelect>,
        );
        if (query !== undefined) {
            wrapper.setState({ query });
        }
        return wrapper;
    }
});

function filterByYear(query: string, film: IFilm) {
    return query === "" || film.year.toString() === query;
}
