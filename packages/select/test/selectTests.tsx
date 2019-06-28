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

    it("disabled=true doesn't call itemRenderer", () => {
        select({ disabled: true });
        assert.equal(handlers.itemRenderer.callCount, 0);
    });

    it("disabled=false calls itemRenderer", () => {
        select({ disabled: false });
        assert.equal(handlers.itemRenderer.callCount, 100);
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
