/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, InputGroup, Keys, Popover } from "@blueprintjs/core";
import { assert } from "chai";
import * as classNames from "classnames";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { Film, TOP_100_FILMS } from "../examples/data";
import { ISelectItemRendererProps } from "../src/components/select/select";
import { ISuggestProps, Suggest } from "../src/components/select/suggest";

const FILM_ITEM_CLASS = "film-item";

describe("Suggest", () => {
    const FilmSuggest = Suggest.ofType<Film>();
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { inline: true, isOpen: true },
        query: "",
    };
    let handlers: {
        inputValueRenderer: Sinon.SinonSpy,
        itemPredicate: Sinon.SinonSpy,
        itemRenderer: Sinon.SinonSpy,
        onItemSelect: Sinon.SinonSpy,
    };

    beforeEach(() => {
        handlers = {
            inputValueRenderer: sinon.spy(inputValueRenderer),
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
    });

    describe("Basic behavior", () => {
        it("renders a input that triggers a popover containing items", () => {
            const wrapper = suggest();
            const popover = wrapper.find(Popover);
            assert.lengthOf(wrapper.find(InputGroup), 1, "should render InputGroup");
            assert.lengthOf(popover, 1, "should render Popover");
            assert.lengthOf(popover.find(`.${FILM_ITEM_CLASS}`), 100, "should render 100 items in popover");
        });

        describe("when ESCAPE key pressed", () => {
            runEscTabKeyDownTests(Keys.ESCAPE);
        });

        describe("when TAB key pressed", () => {
            runEscTabKeyDownTests(Keys.TAB);
        });

        it("does not open popover on BACKSPACE, ARROW_LEFT, or ARROW_RIGHT", () => {
            const wrapper = suggest({ openOnKeyDown: true });
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
            const queryList = (wrapper.getNode() as any).queryList; // private ref
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

            it("clears selected item if user has typed something", () => {
                const ITEM_INDEX = 4;
                const wrapper = suggest({ closeOnSelect: false });
                simulateFocus(wrapper);
                selectItem(wrapper, ITEM_INDEX);
                simulateChange(wrapper, "new query"); // type something
                simulateKeyDown(wrapper, which);
                assert.isUndefined(wrapper.state().selectedItem, "should clear selected item");
            });

            it("maintains the selected item if user has not typed something", () => {
                const ITEM_INDEX = 4;
                const wrapper = suggest({ closeOnSelect: false });
                simulateFocus(wrapper);
                selectItem(wrapper, ITEM_INDEX);
                simulateKeyDown(wrapper, which);
                const selectedItem = TOP_100_FILMS[ITEM_INDEX];
                assert.strictEqual(wrapper.state().selectedItem, selectedItem, "should keep selected item");
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

    describe("itemRenderer", () => {
        it("itemRenderer is called for each filtered child", () => {
            suggest();
            const { callCount } = handlers.itemRenderer;
            const numItems = TOP_100_FILMS.length;
            assert.strictEqual(callCount, numItems, "should invoke itemRenderer 100 times on render");
        });
    });

    describe("inputProps", () => {
        it("input can be controlled with inputProps", () => {
            const value = "nailed it";
            const onChange = sinon.spy();

            const input = suggest({ inputProps: { value, onChange } }).find("input");
            assert.equal(input.prop("value"), value);

            input.simulate("change");
            assert.isTrue(onChange.calledOnce);
        });

        it("invokes inputProps.onKeyDown on input keydown", () => {
            const onKeyDown = sinon.spy();
            const wrapper = suggest({ inputProps: { onKeyDown }});
            simulateKeyDown(wrapper);
            assert.strictEqual(onKeyDown.callCount, 1, "should call inputProps.onKeyDown once");
        });

        it("invokes inputProps.onKeyUp on input keyup", () => {
            const onKeyUp = sinon.spy();
            const wrapper = suggest({ inputProps: { onKeyUp }});
            simulateKeyUp(wrapper);
            assert.strictEqual(onKeyUp.callCount, 1, "should call inputProps.onKeyUp once");
        });
    });

    describe("inputValueRenderer", () => {
        it("invokes inputValueRenderer when rendering an item in the input field", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest();
            const { inputValueRenderer } = handlers;

            assert.isFalse(inputValueRenderer.called, "should not call inputValueRenderer before selection");
            selectItem(wrapper, ITEM_INDEX);
            const selectedItem = TOP_100_FILMS[ITEM_INDEX];
            const expectedValue = inputValueRenderer(selectedItem);

            assert.isTrue(inputValueRenderer.called, "should call inputValueRenderer after selection");
            assert.strictEqual(wrapper.find("input").prop("value"), expectedValue);
        });
    });

    describe("noResults", () => {
        describe("if not provided", () => {
            it("renders nothing when given empty list", () => {
                const wrapper = suggest({ items: [] });
                const menuElement = getListContainerElement(wrapper);
                assert.lengthOf(menuElement.children, 0, "should render empty list");
            });

            it("renders nothing when filtering returns empty list", () => {
                const wrapper = suggest({}, "non-existent film name");
                const menuElement = getListContainerElement(wrapper);
                assert.lengthOf(menuElement.children, 0, "should render empty list");
            });

            function getListContainerElement(wrapper: ReactWrapper<any, any>) {
                return wrapper.find(Popover).find(`.${Classes.MENU}`).getDOMNode();
            }
        });

        describe("if provided", () => {
            it("renders noResults when given empty list", () => {
                const wrapper = suggest({ items: [], noResults: <address /> });
                assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
            });

            it("renders noResults when filtering returns empty list", () => {
                const wrapper = suggest({ noResults: <address /> }, "non-existent film name");
                assert.lengthOf(wrapper.find("address"), 1, "should find noResults");
            });
        });
    });

    describe("onItemSelect", () => {
        it("invokes onItemSelect when item selected", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest();
            selectItem(wrapper, ITEM_INDEX);
            assert.strictEqual(handlers.onItemSelect.args[0][0], TOP_100_FILMS[ITEM_INDEX]);
        });
    });

    describe("openOnKeyDown", () => {
        it("opens the popover on key down if openOnKeyDown=true", () => {
            const wrapper = suggest({ openOnKeyDown: true });
            simulateFocus(wrapper);
            assert.isFalse(wrapper.state().isOpen, "popover should not open on focus");
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
        const popoverWillOpen = sinon.spy();

        afterEach(() => {
            popoverWillOpen.reset();
        });

        it("popover can be controlled with popoverProps", () => {
            const tetherOptions = {}; // our own instance
            const wrapper = suggest({ popoverProps: getPopoverProps(false, tetherOptions) });
            wrapper.setProps({ popoverProps: getPopoverProps(true, tetherOptions) });
            assert.strictEqual(wrapper.find(Popover).prop("tetherOptions"), tetherOptions);
            assert.isTrue(popoverWillOpen.calledOnce);
        });

        function getPopoverProps(isOpen: boolean, tetherOptions: any) {
            return {
                ...defaultProps.popoverProps,
                isOpen,
                popoverWillOpen,
                tetherOptions,
            };
        }
    });

    function suggest(props: Partial<ISuggestProps<Film>> = {}, query?: string) {
        const wrapper = mount(<FilmSuggest {...defaultProps} {...handlers} {...props} />);
        if (query !== undefined) {
            wrapper.setState({ query });
        }
        return wrapper;
    }
});

function renderFilm({ handleClick, isActive, item: film }: ISelectItemRendererProps<Film>) {
    const classes = classNames(FILM_ITEM_CLASS, {
        [Classes.ACTIVE]: isActive,
        [Classes.INTENT_PRIMARY]: isActive,
    });
    return (
        <a className={classes} key={film.rank} onClick={handleClick}>{film.rank}. {film.title}</a>
    );
}

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

function simulateKeyDown(wrapper: ReactWrapper<any, any>, which = Keys.SPACE) {
    wrapper.find("input").simulate("keydown", { which });
}

function simulateKeyUp(wrapper: ReactWrapper<any, any>, which = Keys.SPACE) {
    wrapper.find("input").simulate("keyup", { which });
}
