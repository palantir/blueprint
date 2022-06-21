/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
import * as sinon from "sinon";

import { Classes as CoreClasses, Keys, Tag } from "@blueprintjs/core";
import { dispatchTestKeyboardEventWithCode } from "@blueprintjs/test-commons";

// this is an awkward import across the monorepo, but we'd rather not introduce a cyclical dependency or create another package
import { IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/common/films";
import { IItemRendererProps, MultiSelect2, MultiSelect2Props, MultiSelect2State } from "../src";
import { selectComponentSuite } from "./selectComponentSuite";
import { selectPopoverTestSuite } from "./selectPopoverTestSuite";

describe("<MultiSelect2>", () => {
    const FilmMultiSelect = MultiSelect2.ofType<IFilm>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
        selectedItems: [] as IFilm[],
        tagRenderer: renderTag,
    };
    let handlers: {
        itemPredicate: sinon.SinonSpy<[string, IFilm], boolean>;
        itemRenderer: sinon.SinonSpy<[IFilm, IItemRendererProps], JSX.Element | null>;
        onItemSelect: sinon.SinonSpy;
    };
    let testsContainerElement: HTMLElement | undefined;

    beforeEach(() => {
        handlers = {
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        testsContainerElement?.remove();
    });

    selectComponentSuite<MultiSelect2Props<IFilm>, MultiSelect2State>(props =>
        mount(
            <MultiSelect2
                selectedItems={[]}
                {...props}
                popoverProps={{ isOpen: true, usePortal: false }}
                tagRenderer={renderTag}
            />,
        ),
    );

    selectPopoverTestSuite<MultiSelect2Props<IFilm>, MultiSelect2State>(props =>
        mount(<MultiSelect2 {...props} selectedItems={[]} tagRenderer={renderTag} />, {
            attachTo: testsContainerElement,
        }),
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
        dispatchTestKeyboardEventWithCode(firstTagRemoveButton, "keyup", "Enter", Keys.ENTER);

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

    function multiselect(props: Partial<MultiSelect2Props<IFilm>> = {}, query?: string) {
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
