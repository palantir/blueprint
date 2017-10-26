/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, MenuItem, Tag } from "@blueprintjs/core";
import { assert } from "chai";
import * as classNames from "classnames";
import { mount } from "enzyme";
import * as React from "react";

import { Film, TOP_100_FILMS } from "../examples/data";
import { IMultiSelectProps, ISelectItemRendererProps, MultiSelect } from "../src/index";

describe("<MultiSelect>", () => {
    const FilmMultiSelect = MultiSelect.ofType<Film>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { inline: true, isOpen: true },
        query: "",
        selectedItems: [] as Film[],
        tagRenderer: renderTag,
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

    it("placeholder can be controlled with TagInput's inputProps", () => {
        const placeholder = "look here";

        const input = multiselect({ tagInputProps: { inputProps: { placeholder } } }).find("input");
        assert.equal((input.getDOMNode() as HTMLInputElement).placeholder, placeholder);
    });

    it("tagRenderer can return JSX", () => {
        const wrapper = multiselect({
            selectedItems: [TOP_100_FILMS[0]],
            tagRenderer: film => <strong>{film.title}</strong>,
        });
        assert.equal(wrapper.find(Tag).find("strong").length, 1);
    });

    it("clicking item invokes onSelectItem with placeholder", () => {
        const placeholder = "look here";

        const wrapper = multiselect({ tagInputProps: { inputProps: { placeholder } } });
        wrapper.setState({ activeItem: TOP_100_FILMS[4] });
        wrapper
            .find(MenuItem)
            .at(4)
            .find("a")
            .simulate("click");
        assert.strictEqual(handlers.onItemSelect.args[0][0], TOP_100_FILMS[4]);
    });

    function multiselect(props: Partial<IMultiSelectProps<Film>> = {}, query?: string) {
        const wrapper = mount(
            <FilmMultiSelect {...defaultProps} {...handlers} {...props}>
                <table />
            </FilmMultiSelect>,
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
        <MenuItem
            className={classes}
            key={film.rank}
            label={film.year.toString()}
            onClick={handleClick}
            text={`${film.rank}. ${film.title}`}
            shouldDismissPopover={false}
        />
    );
}

function renderTag(film: Film) {
    return film.title;
}

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}
