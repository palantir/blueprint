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
import * as sinon from "sinon";

import { Classes, InputGroup, Keys, Popover } from "@blueprintjs/core";

import { IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/common/films";
import { IItemRendererProps, ISelectProps, ISelectState, Select } from "../src";
import { selectComponentSuite } from "./selectComponentSuite";

describe("<Select>", () => {
    const FilmSelect = Select.ofType<IFilm>();
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
        testsContainerElement?.remove();
    });

    selectComponentSuite<ISelectProps<IFilm>, ISelectState>(props =>
        mount(<Select {...props} popoverProps={{ isOpen: true, usePortal: false }} />),
    );

    it("renders a Popover around children that contains InputGroup and items", () => {
        const wrapper = select();
        assert.lengthOf(wrapper.find(InputGroup), 1, "should render InputGroup");
        /* eslint-disable-next-line deprecation/deprecation */
        assert.lengthOf(wrapper.find(Popover), 1, "should render Popover");
    });

    it("filterable=false hides InputGroup", () => {
        const wrapper = select({ filterable: false });
        assert.lengthOf(wrapper.find(InputGroup), 0, "should not render InputGroup");
        /* eslint-disable-next-line deprecation/deprecation */
        assert.lengthOf(wrapper.find(Popover), 1, "should render Popover");
    });

    it("disabled=true disables Popover", () => {
        const wrapper = select({ disabled: true });
        /* eslint-disable-next-line deprecation/deprecation */
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
        wrapper.find("[data-testid='target-button']").simulate("click");
        /* eslint-disable-next-line deprecation/deprecation */
        assert.strictEqual(wrapper.find(Popover).prop("modifiers"), modifiers);
        assert.isTrue(onOpening.calledOnce);
    });

    // TODO(adahiya): move into selectComponentSuite, generalize for Suggest & MultiSelect
    it("opens popover when arrow key pressed on target while closed", () => {
        const wrapper = select({ popoverProps: { usePortal: false } });
        // should be closed to start
        assert.strictEqual(wrapper.find(Popover).prop("isOpen"), false);
        wrapper.find("[data-testid='target-button']").simulate("keydown", { which: Keys.ARROW_DOWN });
        // ...then open after key down
        assert.strictEqual(wrapper.find(Popover).prop("isOpen"), true);
    });

    it("matchTargetWidth={true} makes popover same width as target", done => {
        const wrapper = select({ matchTargetWidth: true });
        // wait one frame for popper.js v1 to position the popover and apply our custom modifier
        setTimeout(() => {
            const popoverWidth = wrapper.find(`.${Classes.POPOVER}`).hostNodes().getDOMNode().clientWidth;
            const targetWidth = wrapper.find(`.${Classes.POPOVER_TARGET}`).hostNodes().getDOMNode().clientWidth;
            assert.notEqual(popoverWidth, 0, "popover width should be > 0");
            assert.notEqual(targetWidth, 0, "target width should be > 0");
            assert.closeTo(targetWidth, popoverWidth, 1, "popover width should be close to target width");
            wrapper.detach();
            done();
        });
    });

    function select(props: Partial<ISelectProps<IFilm>> = {}, query?: string) {
        const wrapper = mount(
            <FilmSelect {...defaultProps} {...handlers} {...props}>
                <button data-testid="target-button">Target</button>
            </FilmSelect>,
            { attachTo: testsContainerElement },
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
