/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Tag } from "@blueprintjs/core";
import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

// this is an awkward import across the monorepo, but we'd rather not introduce a cyclical dependency or create another package
import { IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/examples/select-examples/films";
import { IMultiSelectProps, IMultiSelectState, MultiSelect } from "../src/index";
import { selectComponentSuite } from "./selectComponentSuite";

describe("<MultiSelect>", () => {
    const FilmMultiSelect = MultiSelect.ofType<IFilm>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
        selectedItems: [] as IFilm[],
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
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
    });

    selectComponentSuite<IMultiSelectProps<IFilm>, IMultiSelectState>(props =>
        mount(<MultiSelect {...props} popoverProps={{ isOpen: true, usePortal: false }} tagRenderer={renderTag} />),
    );

    it("placeholder can be controlled with placeholder prop", () => {
        const placeholder = "look here";

        const input = multiselect({ placeholder }).find("input");
        assert.equal((input.getDOMNode() as HTMLInputElement).placeholder, placeholder);
    });

    it("placeholder can be controlled with TagInput's inputProps", () => {
        const placeholder = "look here";

        const input = multiselect({ tagInputProps: { placeholder } }).find("input");
        assert.equal((input.getDOMNode() as HTMLInputElement).placeholder, placeholder);
    });

    it("tagRenderer can return JSX", () => {
        const wrapper = multiselect({
            selectedItems: [TOP_100_FILMS[0]],
            tagRenderer: film => <strong>{film.title}</strong>,
        });
        assert.equal(wrapper.find(Tag).find("strong").length, 1);
    });

    it("selectedItems is optional", () => {
        assert.doesNotThrow(() => multiselect({ selectedItems: undefined }));
    });

    function multiselect(props: Partial<IMultiSelectProps<IFilm>> = {}, query?: string) {
        const wrapper = mount(
            <FilmMultiSelect {...defaultProps} {...handlers} {...props}>
                <article />
            </FilmMultiSelect>,
        );
        if (query !== undefined) {
            wrapper.setState({ query });
        }
        return wrapper;
    }
});

function renderTag(film: IFilm) {
    return film.title;
}

function filterByYear(query: string, film: IFilm) {
    return query === "" || film.year.toString() === query;
}
