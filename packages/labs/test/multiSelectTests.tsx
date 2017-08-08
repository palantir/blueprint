/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, MenuItem } from "@blueprintjs/core";
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
        tagRenderer: renderTag,
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

    it("placeholder can be controlled with TagInput's inputProps", () => {
        const placeholder = "look here";

        const input = multiselect({ tagInputProps: { inputProps: { placeholder } } }).find("input");
        assert.equal((input.getDOMNode() as HTMLInputElement).placeholder, placeholder);
    });

    function multiselect(props: Partial<IMultiSelectProps<Film>> = {}, query?: string) {
        const wrapper = mount(<FilmMultiSelect {...defaultProps} {...handlers} {...props}><table /></FilmMultiSelect>);
        if (query !== undefined) {
            wrapper.setState({ query });
        }
        return wrapper;
    }
});

const renderFilm = ({ handleClick, isActive, item: film }: ISelectItemRendererProps<Film>) => {
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
};

const renderTag = (film: Film) => {
    return film.title;
};

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}
