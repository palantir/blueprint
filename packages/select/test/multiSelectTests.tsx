/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { MenuItem, Tag } from "@blueprintjs/core";
import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

// this is an awkward import across the monorepo, but we'd rather not introduce a cyclical dependency or create another package
import * as Films from "../../docs-app/src/examples/select-examples/films";
import { IMultiSelectProps, MultiSelect } from "../src/index";

type Film = Films.Film;

describe("<MultiSelect>", () => {
    const FilmMultiSelect = MultiSelect.ofType<Film>();
    const defaultProps = {
        items: Films.items,
        popoverProps: { inline: true, isOpen: true },
        query: "",
        selectedItems: [] as Film[],
        tagRenderer: renderTag,
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

    it("placeholder can be controlled with TagInput's inputProps", () => {
        const placeholder = "look here";

        const input = multiselect({ tagInputProps: { inputProps: { placeholder } } }).find("input");
        assert.equal((input.getDOMNode() as HTMLInputElement).placeholder, placeholder);
    });

    it("tagRenderer can return JSX", () => {
        const wrapper = multiselect({
            selectedItems: [Films.items[0]],
            tagRenderer: film => <strong>{film.title}</strong>,
        });
        assert.equal(wrapper.find(Tag).find("strong").length, 1);
    });

    it("clicking item invokes onSelectItem with placeholder", () => {
        const placeholder = "look here";

        const wrapper = multiselect({ tagInputProps: { inputProps: { placeholder } } });
        wrapper.setState({ activeItem: Films.items[4] });
        wrapper
            .find(MenuItem)
            .at(4)
            .find("a")
            .simulate("click");
        assert.strictEqual(handlers.onItemSelect.args[0][0], Films.items[4]);
    });

    it("selectedItems is optional", () => {
        assert.doesNotThrow(() => multiselect({ selectedItems: undefined }));
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

function renderTag(film: Film) {
    return film.title;
}

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}
