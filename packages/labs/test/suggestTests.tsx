/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes, InputGroup, Popover, Keys } from "@blueprintjs/core";
import { assert } from "chai";
import * as classNames from "classnames";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { Film, TOP_100_FILMS } from "../examples/data";
import { ISelectItemRendererProps } from "../src/components/select/select";
import { ISuggestProps, Suggest } from "../src/components/select/suggest";

const FILM_ITEM_CLASS = "film-item";

describe.only("Suggest", () => {
    const FilmSuggest = Suggest.ofType<Film>();
    const defaultProps = {
        inputValueRenderer: sinon.spy(inputValueRenderer),
        items: TOP_100_FILMS,
        popoverProps: { inline: true, isOpen: true },
        query: "",
    };
    let handlers: {
        itemPredicate: Sinon.SinonSpy,
        itemRenderer: Sinon.SinonSpy,
        onItemSelect: Sinon.SinonSpy,
    };

    beforeEach(() => {
        handlers = {
            itemPredicate: sinon.spy(filterByYear),
            itemRenderer: sinon.spy(renderFilm),
            onItemSelect: sinon.spy(),
        };
        defaultProps.inputValueRenderer.reset();
    });

    describe("Basic behavior", () => {
        it("renders a input that triggers a popover containing items", () => {
            const wrapper = suggest();
            const popover = wrapper.find(Popover);
            assert.lengthOf(wrapper.find(InputGroup), 1, "should render InputGroup");
            assert.lengthOf(popover, 1, "should render Popover");
            assert.lengthOf(popover.find(`.${FILM_ITEM_CLASS}`), 100, "should render 100 items in popover");
        });
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
    });

    describe("inputValueRenderer", () => {
        it("invokes inputValueRenderer when rendering an item in the input field", () => {
            const ITEM_INDEX = 4;
            const wrapper = suggest();
            const { inputValueRenderer } = defaultProps;

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
            focusInput(wrapper);
            assert.isFalse(wrapper.state().isOpen, "popover should not open on focus");
            simulateKeyDown(wrapper);
            assert.isTrue(wrapper.state().isOpen, "popover should open on key down");
        });

        it("opens the popover on focus if openOnKeyDown=false", () => {
            const wrapper = suggest(); // openOnKeyDown=false by default
            focusInput(wrapper);
            assert.isTrue(wrapper.state().isOpen, "popover should open on focus");
            simulateKeyDown(wrapper);
            assert.isTrue(wrapper.state().isOpen, "popover should stay open on key down");
        });

        function simulateKeyDown(wrapper: ReactWrapper<any, any>) {
            wrapper.find(InputGroup).simulate("keydown", { which: Keys.SPACE });
        }
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

function focusInput(wrapper: ReactWrapper<any, any>) {
    wrapper.find("input").simulate("focus");
}
