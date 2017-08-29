/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes } from "@blueprintjs/core";
import { assert } from "chai";
import * as classNames from "classnames";
import { mount } from "enzyme";
import * as React from "react";

import { Film, TOP_100_FILMS } from "../examples/data";
import { ISelectItemRendererProps } from "../src/components/select/select";
import { ISuggestProps, Suggest } from "../src/components/select/suggest";

describe.only("Suggest", () => {
    const FilmSuggest = Suggest.ofType<Film>();
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

    describe("Basic behavior", () => {
        it("renders a input that triggers a popover containing items");
        it("returns focus to focusable target after popover closed");
    });

    describe("closeOnSelect", () => {
        it("clicking an item closes the popover if closeOnSelect=true");
        it("clicking an item does not close the popover if closeOnSelect=false");
    });

    describe("itemRenderer", () => {
        it("itemRenderer is called for each filtered child");
    });

    describe("inputProps", () => {
        it("input can be controlled with inputProps", () => {
            const value = "nailed it";
            const onChange = sinon.spy();

            const input = mountSuggest({ inputProps: { value, onChange } }).find("input");
            assert.equal(input.prop("value"), value);

            input.simulate("change");
            assert.isTrue(onChange.calledOnce);
        });
    });

    describe("inputValueRenderer", () => {
        it("invokes inputValueRenderer when rendering an item in the input field");
    });

    describe("itemListPredicate", () => {
        it("filters list using itemListPredicate if provided");
        it("filters with only itemListPredicate when itemPredicate also provided");
    });

    describe("itemPredicate", () => {
        it("filters list using itemPredicate if provided");
        it("does not invoke itemPredicate if itemListPredicate provided");
    });

    describe("noResults", () => {
        describe("if not provided", () => {
            it("renders nothing when given empty list");
            it("renders nothing when filtering returns empty list");
        });

        describe("if provided", () => {
            it("renders noResults when given empty list");
            it("renders noResults when filtering returns empty list");
        });
    });

    describe("onItemSelect", () => {
        it("invokes onItemSelect when item selected");
    });

    describe("openOnKeyDown", () => {
        it("opens the popover on key down if openOnKeyDown=true");
        it("opens the popover on focus if openOnKeyDown=false");
    });

    describe("popoverProps", () => {
        it("popover can be controlled with popoverProps");
    });

    function mountSuggest(props: Partial<ISuggestProps<Film>> = {}, query?: string) {
        const wrapper = mount(<FilmSuggest {...defaultProps} {...handlers} {...props} />);
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
        <a className={classes} key={film.rank} onClick={handleClick}>{film.rank}. {film.title}</a>
    );
}

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}
