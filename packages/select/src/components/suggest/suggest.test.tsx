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

import { mount, type ReactWrapper } from "enzyme";
import { act } from "react";
import * as sinon from "sinon";

import { InputGroup, MenuItem, PopoverNext, type PopoverProps } from "@blueprintjs/core";
import { afterEach, beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";
import { unmountWrappers } from "@blueprintjs/test-commons/vitest-utils";

import { type Film, renderFilm, TOP_100_FILMS } from "../../__examples__";
import type { ItemRendererProps } from "../../common/itemRenderer";
import { QueryList } from "../query-list/queryList";
import { selectComponentSuite } from "../select/selectComponentTestUtils";
import { selectPopoverTestSuite } from "../select/selectPopoverTestUtils";

import { Suggest, type SuggestProps, type SuggestState } from "./suggest";

describe("Suggest", () => {
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
    };
    let handlers: {
        inputValueRenderer: sinon.SinonSpy<[Film], string>;
        itemPredicate: sinon.SinonSpy<[string, Film], boolean>;
        itemRenderer: sinon.SinonSpy<[Film, ItemRendererProps], React.JSX.Element | null>;
        onItemSelect: sinon.SinonSpy;
    };
    let containerElement: HTMLElement;
    let mountedWrappers: Array<ReactWrapper<any, any>> = [];

    beforeEach(() => {
        handlers = {
            inputValueRenderer: sinon.spy(inputValueRenderer),
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(async () => {
        try {
            await unmountWrappers(mountedWrappers);
        } finally {
            mountedWrappers = [];
            containerElement.remove();
        }
    });

    selectComponentSuite<SuggestProps<Film>, SuggestState<Film>>(props => {
        const wrapper = mount(
            <Suggest
                {...props}
                inputValueRenderer={inputValueRenderer}
                popoverProps={{ isOpen: true, usePortal: false }}
            />,
            { attachTo: containerElement },
        ) as ReactWrapper<SuggestProps<Film>, SuggestState<Film>>;
        mountedWrappers.push(wrapper);
        return wrapper;
    });

    selectPopoverTestSuite<SuggestProps<Film>, SuggestState<Film>>(props => {
        const wrapper = mount(<Suggest {...props} inputValueRenderer={inputValueRenderer} />, {
            attachTo: containerElement,
        }) as ReactWrapper<SuggestProps<Film>, SuggestState<Film>>;
        mountedWrappers.push(wrapper);
        return wrapper;
    });

    describe("Basic behavior", () => {
        it("renders an input that triggers a popover containing items", () => {
            const wrapper = suggest();
            const popover = wrapper.find(PopoverNext);
            expect(wrapper.find(InputGroup)).toHaveLength(1);
            expect(popover).toHaveLength(1);
            expect(popover.find(MenuItem)).toHaveLength(100);
        });

        describe("when ESCAPE key pressed", () => {
            runEscTabKeyDownTests("Escape");
        });

        describe("when TAB key pressed", () => {
            runEscTabKeyDownTests("Tab");
        });

        it("does not open popover on BACKSPACE, ARROW_LEFT, or ARROW_RIGHT", () => {
            const wrapper = suggest({ openOnKeyDown: true, popoverProps: { usePortal: false } });
            simulateFocus(wrapper);
            checkKeyDownDoesNotOpenPopover(wrapper, "Backspace");
            checkKeyDownDoesNotOpenPopover(wrapper, "ArrowLeft");
            checkKeyDownDoesNotOpenPopover(wrapper, "ArrowRight");
        });

        it("opens popover if any other key pressed", () => {
            const wrapper = suggest({ openOnKeyDown: true });
            simulateKeyDown(wrapper, " ");
            expect(wrapper.state().isOpen).toBe(true);
        });

        it("scrolls active item into view when popover opens", () => {
            const wrapper = suggest();
            const queryList = (wrapper.instance() as Suggest<Film> as any).queryList; // private ref
            const scrollActiveItemIntoViewSpy = sinon.spy(queryList, "scrollActiveItemIntoView");
            act(() => {
                wrapper.setState({ isOpen: false });
            });
            expect(scrollActiveItemIntoViewSpy.called).toBe(false);
            act(() => {
                wrapper.setState({ isOpen: true });
            });
            expect(scrollActiveItemIntoViewSpy.callCount).toBe(1);
        });

        // HACKHACK: skipped test resulting from React 18 upgrade. See: https://github.com/palantir/blueprint/issues/7168
        it.skip("sets active item to the selected item when the popover is closed", () =>
            new Promise<void>(done => {
                // transition duration shorter than timeout below to ensure it's done
                const wrapper = suggest({
                    popoverProps: { transitionDuration: 5 },
                    selectedItem: TOP_100_FILMS[10],
                });
                const queryList = (wrapper.instance() as Suggest<Film> as any).queryList as QueryList<Film>; // private ref

                expect(queryList.state.activeItem).toEqual(wrapper.state().selectedItem);

                simulateFocus(wrapper);
                expect(wrapper.state().isOpen).toBe(true);

                const newActiveItem = TOP_100_FILMS[11];
                queryList.setActiveItem(newActiveItem);
                expect(queryList.state.activeItem).toEqual(newActiveItem);

                simulateKeyDown(wrapper, "Escape");
                expect(wrapper.state().isOpen).toBe(false);

                wrapper.update();
                wrapper.find(QueryList).update();
                setTimeout(() => {
                    expect(queryList.state.activeItem).toEqual(wrapper.state().selectedItem);
                    done();
                }, 10);
            }));

        function checkKeyDownDoesNotOpenPopover(wrapper: ReactWrapper<any, any>, key: string) {
            simulateKeyDown(wrapper, key);
            expect(wrapper.state().isOpen).toBe(false);
        }

        function runEscTabKeyDownTests(key: string) {
            it("closes popover", () => {
                const wrapper = suggest();
                simulateFocus(wrapper);
                simulateKeyDown(wrapper, key);
                expect(wrapper.state().isOpen).toBe(false);
            });

            it("preserves currently selected item", () => {
                const ITEM_INDEX = 4;
                const expectedItem = TOP_100_FILMS[ITEM_INDEX];
                const wrapper = suggest({ closeOnSelect: false });
                simulateFocus(wrapper);
                selectItem(wrapper, ITEM_INDEX);
                simulateKeyDown(wrapper, key);
                expect(wrapper.state().selectedItem).toBe(expectedItem);
                simulateChange(wrapper, "new query"); // type something
                simulateKeyDown(wrapper, key);
                expect(wrapper.state().selectedItem).toBe(expectedItem);
            });
        }
    });

    describe("closeOnSelect", () => {
        it("clicking an item closes the popover if closeOnSelect=true", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest(); // closeOnSelect=true by default
            selectItem(wrapper, ITEM_INDEX);
            expect(wrapper.state().isOpen).toBe(false);
        });

        it("clicking an item does not close the popover if closeOnSelect=false", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest({ closeOnSelect: false });
            selectItem(wrapper, ITEM_INDEX);
            expect(wrapper.state().isOpen).toBe(true);
        });
    });

    describe("inputProps", () => {
        it("value and onChange are ignored", () => {
            const value = "nailed it";
            const onChange = sinon.spy();

            // @ts-expect-error - value and onChange are now omitted from the props type
            const input = suggest({ inputProps: { onChange, value } }).find("input");
            expect(input.prop("onChange")).not.toBe(onChange);
            expect(input.prop("value")).not.toBe(value);
        });

        it("invokes inputProps key handlers", () => {
            const spy = sinon.spy();
            const wrapper = suggest({ inputProps: { onKeyDown: spy, onKeyUp: spy } });
            simulateKeyDown(wrapper);
            simulateKeyUp(wrapper);
            expect(spy.callCount).toBe(2);
        });
    });

    describe("inputValueRenderer", () => {
        it("invokes inputValueRenderer when rendering an item in the input field", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest();

            expect(handlers.inputValueRenderer.called).toBe(false);
            selectItem(wrapper, ITEM_INDEX);
            const selectedItem = TOP_100_FILMS[ITEM_INDEX];
            const expectedValue = inputValueRenderer(selectedItem);

            expect(handlers.inputValueRenderer.called).toBe(true);
            expect(wrapper.find(InputGroup).prop("value")).toBe(expectedValue);
        });
    });

    describe("openOnKeyDown", () => {
        it("opens the popover on key down if openOnKeyDown=true", () => {
            const wrapper = suggest({ openOnKeyDown: true });
            // TODO fix later
            // simulateFocus(wrapper);
            // expect(wrapper.state().isOpen).toBe(false);
            simulateKeyDown(wrapper);
            expect(wrapper.state().isOpen).toBe(true);
        });

        it("opens the popover on focus if openOnKeyDown=false", () => {
            const wrapper = suggest(); // openOnKeyDown=false by default
            simulateFocus(wrapper);
            expect(wrapper.state().isOpen).toBe(true);
            simulateKeyDown(wrapper);
            expect(wrapper.state().isOpen).toBe(true);
        });
    });

    describe("popoverProps", () => {
        const onOpening = sinon.spy();

        afterEach(() => {
            onOpening.resetHistory();
        });

        it("popover can be controlled with popoverProps", () => {
            const modifiers = { flip: { options: { padding: 10 } } };
            const wrapper = suggest({ popoverProps: getPopoverProps(false, modifiers) });
            wrapper.setProps({ popoverProps: getPopoverProps(true, modifiers) }).update();
            // Legacy `modifiers` is converted to PopoverNext `middleware` by the shim. Assert the
            // conversion actually happened so consumer-supplied positioning still reaches the popover.
            expect(wrapper.find(PopoverNext).prop("middleware")).toMatchObject({ flip: { padding: 10 } });
            expect(onOpening.calledOnce).toBe(true);
        });

        function getPopoverProps(isOpen: boolean, modifiers: any): Partial<PopoverProps> {
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
            expect(wrapper.state().selectedItem).toBe(defaultSelectedItem);
        });

        it("when a new item is selected, it changes the selectedItem", () => {
            const ITEM_INDEX = 4;
            const defaultSelectedItem = TOP_100_FILMS[0];
            const nextSelectedItem = TOP_100_FILMS[ITEM_INDEX];
            const wrapper = suggest({ defaultSelectedItem });
            expect(wrapper.state().selectedItem).toBe(defaultSelectedItem);
            simulateFocus(wrapper);
            selectItem(wrapper, ITEM_INDEX);
            expect(handlers.onItemSelect.called).toBe(true);
            expect(wrapper.state().selectedItem).toBe(nextSelectedItem);
        });
    });

    describe("Controlled Mode", () => {
        it("initialize the selectedItem with the given value", () => {
            const selectedItem = TOP_100_FILMS[0];
            expect(selectedItem).not.toBeNull();
            const wrapper = suggest({ selectedItem });
            expect(wrapper.state().selectedItem).toBe(selectedItem);
        });
        it("propagates the selectedItem with new values", () => {
            const selectedItem = TOP_100_FILMS[0];
            expect(selectedItem).not.toBeNull();
            const wrapper = suggest();
            expect(wrapper.state().selectedItem).toBeNull();
            wrapper.setProps({ selectedItem });
            expect(wrapper.state().selectedItem).toBe(selectedItem);
        });
        it("when new item selected, it should respect the selectedItem prop", () => {
            const selectedItem = TOP_100_FILMS[0];
            const ITEM_INDEX = 4;
            expect(selectedItem).not.toBeNull();
            const wrapper = suggest({ selectedItem });
            simulateFocus(wrapper);
            selectItem(wrapper, ITEM_INDEX);
            expect(handlers.onItemSelect.called).toBe(true);
            expect(wrapper.state().selectedItem).toBe(selectedItem);
            const newSelectedItem = TOP_100_FILMS[ITEM_INDEX];
            wrapper.setProps({ selectedItem: newSelectedItem });
            expect(wrapper.state().selectedItem).toBe(newSelectedItem);
        });
        it("preserves the empty selection", () => {
            const ITEM_INDEX = 4;
            const selectedItem = TOP_100_FILMS[0];
            const wrapper = suggest({ selectedItem: null });
            expect(wrapper.state().selectedItem).toBeNull();
            simulateFocus(wrapper);
            selectItem(wrapper, ITEM_INDEX);
            expect(handlers.onItemSelect.called).toBe(true);
            expect(wrapper.state().selectedItem).toBeNull();
            wrapper.setProps({ selectedItem });
            expect(wrapper.state().selectedItem).toBe(selectedItem);
        });
    });

    function suggest(props: Partial<SuggestProps<Film>> = {}) {
        const wrapper = mount<Suggest<Film>>(<Suggest<Film> {...defaultProps} {...handlers} {...props} />, {
            attachTo: containerElement,
        });
        mountedWrappers.push(wrapper);
        return wrapper;
    }
});

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}

function selectItem(wrapper: ReactWrapper<any, any>, index: number) {
    wrapper.find("a").at(index).simulate("click");
}

function inputValueRenderer(item: Film) {
    return item.title;
}

function simulateChange(wrapper: ReactWrapper<any, any>, value: string) {
    wrapper.find("input").simulate("change", { target: { value } });
}

function simulateFocus(wrapper: ReactWrapper<any, any>) {
    wrapper.find("input").simulate("focus");
}

function simulateKeyDown(wrapper: ReactWrapper<any, any>, key = " ") {
    wrapper.find("input").simulate("keydown", { key });
}

function simulateKeyUp(wrapper: ReactWrapper<any, any>, key = " ") {
    wrapper.find("input").simulate("keyup", { key });
}
