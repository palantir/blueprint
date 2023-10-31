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

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import sinon from "sinon";

import { Classes as CoreClasses, Tag } from "@blueprintjs/core";
import { dispatchTestKeyboardEvent } from "@blueprintjs/test-commons";

import { type ItemRendererProps, MultiSelect, type MultiSelectProps } from "../src";
import { type Film, renderFilm, TOP_100_FILMS } from "../src/__examples__";
import type { MultiSelectState } from "../src/components/multi-select/multiSelect";
import { selectComponentSuite } from "./selectComponentSuite";

describe("<MultiSelect>", () => {
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
        selectedItems: [] as Film[],
        tagRenderer: renderTag,
    };
    let handlers: {
        itemPredicate: sinon.SinonSpy<[string, Film], boolean>;
        itemRenderer: sinon.SinonSpy<[Film, ItemRendererProps], JSX.Element | null>;
        onItemSelect: sinon.SinonSpy;
    };

    beforeEach(() => {
        handlers = {
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
    });

    selectComponentSuite<MultiSelectProps<Film>, MultiSelectState>(props =>
        mount(
            <MultiSelect<Film>
                selectedItems={[]}
                {...props}
                popoverProps={{ isOpen: true, usePortal: false }}
                tagRenderer={renderTag}
            />,
        ),
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

    it("only triggers QueryList key up events when focus is on TagInput's <input>", () => {
        const itemSelectSpy = sinon.spy();
        const wrapper = multiselect({
            onItemSelect: itemSelectSpy,
            selectedItems: [TOP_100_FILMS[1]],
        });

        const firstTagRemoveButton = wrapper.find(`.${CoreClasses.TAG_REMOVE}`).at(0).getDOMNode();
        dispatchTestKeyboardEvent(firstTagRemoveButton, "keyup", "Enter");

        // checks for the bug in https://github.com/palantir/blueprint/issues/3674
        // where the first item in the dropdown list would get selected upon hitting Enter inside
        // a TAG_REMOVE button
        assert.isFalse(itemSelectSpy.calledWith(TOP_100_FILMS[0]));
    });

    it("triggers onRemove", () => {
        const handleRemove = sinon.spy();
        const wrapper = multiselect({
            onRemove: handleRemove,
            selectedItems: [TOP_100_FILMS[2], TOP_100_FILMS[3], TOP_100_FILMS[4]],
        });
        wrapper.find(`.${CoreClasses.TAG_REMOVE}`).at(1).simulate("click");
        assert.isTrue(handleRemove.calledOnceWithExactly(TOP_100_FILMS[3], 1));
    });

    function multiselect(props: Partial<MultiSelectProps<Film>> = {}, query?: string) {
        const wrapper = mount(
            <MultiSelect<Film> {...defaultProps} {...handlers} {...props}>
                <article />
            </MultiSelect>,
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
