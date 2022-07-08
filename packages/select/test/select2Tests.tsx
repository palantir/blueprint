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

import { InputGroup, Keys, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

import { IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/common/films";
import { IItemRendererProps, Select2, Select2Props, Select2State } from "../src";
import { selectComponentSuite } from "./selectComponentSuite";
import { selectPopoverTestSuite } from "./selectPopoverTestSuite";

describe("<Select2>", () => {
    const FilmSelect = Select2.ofType<IFilm>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
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
        for (const spy of Object.values(handlers)) {
            spy.resetHistory();
        }
        testsContainerElement?.remove();
    });

    selectComponentSuite<Select2Props<IFilm>, Select2State>(props =>
        mount(<Select2 {...props} popoverProps={{ isOpen: true, usePortal: false }} />),
    );

    selectPopoverTestSuite<Select2Props<IFilm>, Select2State>(props =>
        mount(<Select2 {...props} />, { attachTo: testsContainerElement }),
    );

    it("renders a Popover2 around children that contains InputGroup and items", () => {
        const wrapper = select();
        assert.lengthOf(wrapper.find(InputGroup), 1, "should render InputGroup");
        assert.lengthOf(wrapper.find(Popover2), 1, "should render Popover2");
    });

    it("filterable=false hides InputGroup", () => {
        const wrapper = select({ filterable: false });
        assert.lengthOf(wrapper.find(InputGroup), 0, "should not render InputGroup");
        assert.lengthOf(wrapper.find(Popover2), 1, "should render Popover2");
    });

    it("disabled=true disables Popover2", () => {
        const wrapper = select({ disabled: true });
        assert.strictEqual(wrapper.find(Popover2).prop("disabled"), true);
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

    it("Popover2 can be controlled with popoverProps", () => {
        // Select defines its own onOpening so this ensures that the passthrough happens
        const onOpening = sinon.spy();
        const modifiers = {}; // our own instance
        const wrapper = select({ popoverProps: { onOpening, modifiers } });
        wrapper.find("[data-testid='target-button']").simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("modifiers"), modifiers);
        assert.isTrue(onOpening.calledOnce);
    });

    // TODO(adahiya): move into selectComponentSuite, generalize for Suggest & MultiSelect
    it("opens Popover2 when arrow key pressed on target while closed", () => {
        // override isOpen in defaultProps
        const wrapper = select({ popoverProps: { usePortal: false } });
        // should be closed to start
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);
        wrapper.find("[data-testid='target-button']").simulate("keydown", { which: Keys.ARROW_DOWN });
        // ...then open after key down
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), true);
    });

    // HACKHACK: see https://github.com/palantir/blueprint/issues/5364
    it.skip("invokes onItemSelect when clicking first MenuItem", () => {
        const wrapper = select();
        wrapper.find(Popover2).find(MenuItem).first().simulate("click");
        assert.isTrue(handlers.onItemSelect.calledOnce);
    });

    function select(props: Partial<Select2Props<IFilm>> = {}, query?: string) {
        const wrapper = mount(
            <FilmSelect {...defaultProps} {...handlers} {...props}>
                <button data-testid="target-button">Target</button>
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
