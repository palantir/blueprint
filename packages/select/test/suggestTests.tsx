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

import { InputGroup, IPopoverProps, Keys, MenuItem, Popover } from "@blueprintjs/core";
import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { IFilm, renderFilm, TOP_100_FILMS } from "../../docs-app/src/examples/select-examples/films";
import { ISuggestProps, ISuggestState, Suggest } from "../src/components/select/suggest";
import { selectComponentSuite } from "./selectComponentSuite";

describe("Suggest", () => {
    const FilmSuggest = Suggest.ofType<IFilm>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
    };
    let handlers: {
        inputValueRenderer: sinon.SinonSpy;
        itemPredicate: sinon.SinonSpy;
        itemRenderer: sinon.SinonSpy;
        onItemSelect: sinon.SinonSpy;
    };

    beforeEach(() => {
        handlers = {
            inputValueRenderer: sinon.spy(inputValueRenderer),
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
    });

    selectComponentSuite<ISuggestProps<IFilm>, ISuggestState<IFilm>>(props =>
        mount(
            <Suggest
                {...props}
                inputValueRenderer={inputValueRenderer}
                popoverProps={{ isOpen: true, usePortal: false }}
            />,
        ),
    );

    describe("Basic behavior", () => {
        it("renders an input that triggers a popover containing items", () => {
            const wrapper = suggest();
            const popover = wrapper.find(Popover);
            assert.lengthOf(wrapper.find(InputGroup), 1, "should render InputGroup");
            assert.lengthOf(popover, 1, "should render Popover");
            assert.lengthOf(popover.find(MenuItem), 100, "should render 100 items in popover");
        });

        describe("when ESCAPE key pressed", () => {
            runEscTabKeyDownTests(Keys.ESCAPE);
        });

        describe("when TAB key pressed", () => {
            runEscTabKeyDownTests(Keys.TAB);
        });

        it("does not open popover on BACKSPACE, ARROW_LEFT, or ARROW_RIGHT", () => {
            const wrapper = suggest({ openOnKeyDown: true, popoverProps: { usePortal: false } });
            simulateFocus(wrapper);
            checkKeyDownDoesNotOpenPopover(wrapper, Keys.BACKSPACE);
            checkKeyDownDoesNotOpenPopover(wrapper, Keys.ARROW_LEFT);
            checkKeyDownDoesNotOpenPopover(wrapper, Keys.ARROW_RIGHT);
        });

        it("opens popover if any other key pressed", () => {
            const wrapper = suggest({ openOnKeyDown: true });
            simulateKeyDown(wrapper, Keys.SPACE);
            assert.isTrue(wrapper.state().isOpen, "should open popover");
        });

        it("scrolls active item into view when popover opens", () => {
            const wrapper = suggest();
            const queryList = ((wrapper.instance() as Suggest<IFilm>) as any).queryList; // private ref
            const scrollActiveItemIntoViewSpy = sinon.spy(queryList, "scrollActiveItemIntoView");
            wrapper.setState({ isOpen: false });
            assert.isFalse(scrollActiveItemIntoViewSpy.called);
            wrapper.setState({ isOpen: true });
            assert.strictEqual(scrollActiveItemIntoViewSpy.callCount, 1, "should call scrollActiveItemIntoView");
        });

        function checkKeyDownDoesNotOpenPopover(wrapper: ReactWrapper<any, any>, which: number) {
            simulateKeyDown(wrapper, which);
            assert.isFalse(wrapper.state().isOpen, "should not open popover");
        }

        function runEscTabKeyDownTests(which: number) {
            it("closes popover", () => {
                const wrapper = suggest();
                simulateFocus(wrapper);
                simulateKeyDown(wrapper, which);
                assert.isFalse(wrapper.state().isOpen, "should close popover");
            });

            it("preserves currently selected item", () => {
                const ITEM_INDEX = 4;
                const expectedItem = TOP_100_FILMS[ITEM_INDEX];
                const wrapper = suggest({ closeOnSelect: false });
                simulateFocus(wrapper);
                selectItem(wrapper, ITEM_INDEX);
                simulateKeyDown(wrapper, which);
                assert.strictEqual(wrapper.state().selectedItem, expectedItem, "before typing");
                simulateChange(wrapper, "new query"); // type something
                simulateKeyDown(wrapper, which);
                assert.strictEqual(wrapper.state().selectedItem, expectedItem, "after typing");
            });
        }
    });

    describe("closeOnSelect", () => {
        it("clicking an item closes the popover if closeOnSelect=true", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest(); // closeOnSelect=true by default
            selectItem(wrapper, ITEM_INDEX);
            assert.isFalse(wrapper.state().isOpen);
        });

        it("clicking an item does not close the popover if closeOnSelect=false", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest({ closeOnSelect: false });
            selectItem(wrapper, ITEM_INDEX);
            assert.isTrue(wrapper.state().isOpen);
        });
    });

    describe("inputProps", () => {
        it("value and onChange are ignored", () => {
            const value = "nailed it";
            const onChange = sinon.spy();

            const input = suggest({ inputProps: { value, onChange } }).find("input");
            assert.notStrictEqual(input.prop("onChange"), onChange);
            assert.notStrictEqual(input.prop("value"), value);
        });

        it("invokes inputProps key handlers", () => {
            const spy = sinon.spy();
            const wrapper = suggest({ inputProps: { onKeyDown: spy, onKeyUp: spy } });
            simulateKeyDown(wrapper);
            simulateKeyUp(wrapper);
            assert.strictEqual(spy.callCount, 2);
        });
    });

    describe("inputValueRenderer", () => {
        it("invokes inputValueRenderer when rendering an item in the input field", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest();

            assert.isFalse(handlers.inputValueRenderer.called, "should not call inputValueRenderer before selection");
            selectItem(wrapper, ITEM_INDEX);
            const selectedItem = TOP_100_FILMS[ITEM_INDEX];
            const expectedValue = inputValueRenderer(selectedItem);

            assert.isTrue(handlers.inputValueRenderer.called, "should call inputValueRenderer after selection");
            assert.strictEqual(wrapper.find(InputGroup).prop("value"), expectedValue);
        });
    });

    describe("openOnKeyDown", () => {
        it("opens the popover on key down if openOnKeyDown=true", () => {
            const wrapper = suggest({ openOnKeyDown: true });
            // TODO fix later
            // simulateFocus(wrapper);
            // assert.isFalse(wrapper.state().isOpen, "popover should not open on focus");
            simulateKeyDown(wrapper);
            assert.isTrue(wrapper.state().isOpen, "popover should open on key down");
        });

        it("opens the popover on focus if openOnKeyDown=false", () => {
            const wrapper = suggest(); // openOnKeyDown=false by default
            simulateFocus(wrapper);
            assert.isTrue(wrapper.state().isOpen, "popover should open on focus");
            simulateKeyDown(wrapper);
            assert.isTrue(wrapper.state().isOpen, "popover should stay open on key down");
        });
    });

    describe("popoverProps", () => {
        const onOpening = sinon.spy();

        afterEach(() => {
            onOpening.resetHistory();
        });

        it("popover can be controlled with popoverProps", () => {
            const modifiers = {}; // our own instance
            const wrapper = suggest({ popoverProps: getPopoverProps(false, modifiers) });
            wrapper.setProps({ popoverProps: getPopoverProps(true, modifiers) }).update();
            assert.strictEqual(wrapper.find(Popover).prop("modifiers"), modifiers);
            assert.isTrue(onOpening.calledOnce);
        });

        function getPopoverProps(isOpen: boolean, modifiers: any): Partial<IPopoverProps> {
            return {
                ...defaultProps.popoverProps,
                isOpen,
                modifiers,
                onOpening,
            };
        }
    });

    describe("Uncontrolled Mode with default value", () => {
        it("initialize the selectedItem with the defaultSelectedItem", () => {
            const defaultSelectedItem = TOP_100_FILMS[0];
            const wrapper = suggest({ defaultSelectedItem });
            assert.strictEqual(
                wrapper.state().selectedItem,
                defaultSelectedItem,
                "The selected item should be initialized",
            );
        });

        it("when a new item is selected, it changes the selectedItem", () => {
            const ITEM_INDEX = 4;
            const defaultSelectedItem = TOP_100_FILMS[0];
            const nextSelectedItem = TOP_100_FILMS[ITEM_INDEX];
            const wrapper = suggest({ defaultSelectedItem });
            assert.strictEqual(
                wrapper.state().selectedItem,
                defaultSelectedItem,
                "The selected item should be initialized",
            );
            simulateFocus(wrapper);
            selectItem(wrapper, ITEM_INDEX);
            assert.isTrue(handlers.onItemSelect.called, "onItemSelect should be called after selection");
            assert.strictEqual(wrapper.state().selectedItem, nextSelectedItem, "the selectedItem should be updated");
        });
    });

    describe("Controlled Mode", () => {
        it("initialize the selectedItem with the given value", () => {
            const selectedItem = TOP_100_FILMS[0];
            assert.isNotNull(selectedItem, "The selected item we test must not be null");
            const wrapper = suggest({ selectedItem });
            assert.strictEqual(wrapper.state().selectedItem, selectedItem);
        });
        it("propagates the selectedItem with new values", () => {
            const selectedItem = TOP_100_FILMS[0];
            assert.isNotNull(selectedItem, "The selected item we test must not be null");
            const wrapper = suggest();
            assert.isNull(wrapper.state().selectedItem);
            wrapper.setProps({ selectedItem });
            assert.strictEqual(wrapper.state().selectedItem, selectedItem);
        });
        it("when new item selected, it should respect the selectedItem prop", () => {
            const selectedItem = TOP_100_FILMS[0];
            const ITEM_INDEX = 4;
            assert.isNotNull(selectedItem, "The selected item we test must not be null");
            const wrapper = suggest({ selectedItem });
            simulateFocus(wrapper);
            selectItem(wrapper, ITEM_INDEX);
            assert.isTrue(handlers.onItemSelect.called, "onItemSelect should be called after selection");
            assert.strictEqual(wrapper.state().selectedItem, selectedItem, "the underlying state should not change");
            const newSelectedItem = TOP_100_FILMS[ITEM_INDEX];
            wrapper.setProps({ selectedItem: newSelectedItem });
            assert.strictEqual(wrapper.state().selectedItem, newSelectedItem, "the selectedItem should be updated");
        });
        it("preserves the empty selection", () => {
            const ITEM_INDEX = 4;
            const selectedItem = TOP_100_FILMS[0];
            const wrapper = suggest({ selectedItem: null });
            assert.isNull(wrapper.state().selectedItem);
            simulateFocus(wrapper);
            selectItem(wrapper, ITEM_INDEX);
            assert.isTrue(handlers.onItemSelect.called, "onItemSelect should be called after selection");
            assert.isNull(wrapper.state().selectedItem, "the underlying state should not change");
            wrapper.setProps({ selectedItem });
            assert.strictEqual(wrapper.state().selectedItem, selectedItem, "the selectedItem should be updated");
        });
    });

    function suggest(props: Partial<ISuggestProps<IFilm>> = {}, query?: string) {
        const wrapper = mount<typeof FilmSuggest>(<FilmSuggest {...defaultProps} {...handlers} {...props} />);
        if (query !== undefined) {
            wrapper.setState({ query });
        }
        return wrapper;
    }
});

function filterByYear(query: string, film: IFilm) {
    return query === "" || film.year.toString() === query;
}

function selectItem(wrapper: ReactWrapper<any, any>, index: number) {
    wrapper
        .find("a")
        .at(index)
        .simulate("click");
}

function inputValueRenderer(item: IFilm) {
    return item.title;
}

function simulateChange(wrapper: ReactWrapper<any, any>, value: string) {
    wrapper.find("input").simulate("change", { target: { value } });
}

function simulateFocus(wrapper: ReactWrapper<any, any>) {
    wrapper.find("input").simulate("focus");
}

function simulateKeyDown(wrapper: ReactWrapper<any, any>, which = Keys.SPACE) {
    wrapper.find("input").simulate("keydown", { which });
}

function simulateKeyUp(wrapper: ReactWrapper<any, any>, which = Keys.SPACE) {
    wrapper.find("input").simulate("keyup", { which });
}
