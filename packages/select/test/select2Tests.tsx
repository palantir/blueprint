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
import { HTMLAttributes, mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { Button, Classes as CoreClasses, InputGroup, Keys, MenuItem } from "@blueprintjs/core";
import { MenuItem2, Popover2 } from "@blueprintjs/popover2";

import { ItemRendererProps, Select2, Select2Props, Select2State } from "../src";
import { Film, renderFilm, TOP_100_FILMS } from "../src/__examples__";
import { selectComponentSuite } from "./selectComponentSuite";
import { selectPopoverTestSuite } from "./selectPopoverTestSuite";

describe("<Select2>", () => {
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
    };
    let handlers: {
        itemPredicate: sinon.SinonSpy<[string, Film], boolean>;
        itemRenderer: sinon.SinonSpy<[Film, ItemRendererProps], JSX.Element | null>;
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

    selectComponentSuite<Select2Props<Film>, Select2State>(props =>
        mount(<Select2 {...props} popoverProps={{ isOpen: true, usePortal: false }} />),
    );

    selectPopoverTestSuite<Select2Props<Film>, Select2State>(props =>
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
        // @ts-expect-error - value and onChange are now omitted from the props type
        const input = select({ inputProps }).find("input");
        assert.notEqual(input.prop("onChange"), inputProps.onChange);
        assert.notEqual(input.prop("value"), inputProps.value);
    });

    it("Popover2 can be controlled with popoverProps", () => {
        // Select defines its own onOpening so this ensures that the passthrough happens
        const onOpening = sinon.spy();
        const modifiers = {}; // our own instance
        const wrapper = select({ popoverProps: { onOpening, modifiers } });
        findTargetButton(wrapper).simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("modifiers"), modifiers);
        assert.isTrue(onOpening.calledOnce);
    });

    // TODO(adahiya): move into selectComponentSuite, generalize for Suggest & MultiSelect
    it("opens Popover2 when arrow key pressed on target while closed", () => {
        // override isOpen in defaultProps
        const wrapper = select({ popoverProps: { usePortal: false } });
        // should be closed to start
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);
        findTargetButton(wrapper).simulate("keydown", { which: Keys.ARROW_DOWN });
        // ...then open after key down
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), true);
    });

    it("invokes onItemSelect when clicking first MenuItem", () => {
        const wrapper = select();
        // N.B. need to trigger interaction on nested <a> element, where item onClick is actually attached to the DOM
        wrapper.find(Popover2).find(MenuItem2).first().find("a").simulate("click");
        assert.isTrue(handlers.onItemSelect.calledOnce);
    });

    it("closes Popover2 after selecting active item with the Enter key", () => {
        // override isOpen in defaultProps so that the popover can actually be closed
        const wrapper = select({
            popoverProps: { usePortal: true },
        });
        findTargetButton(wrapper).simulate("click");
        wrapper.find("input").simulate("keydown", { keyCode: Keys.ENTER });
        wrapper.find("input").simulate("keyup", { keyCode: Keys.ENTER });
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);
    });

    // N.B. it's not worth refactoring these tests to be DRY since there will soon
    // only be 1 MenuItem component in Blueprint v5

    it("closes the popover when selecting first MenuItem", () => {
        const itemRenderer = (film: Film) => {
            return <MenuItem text={`${film.rank}. ${film.title}`} shouldDismissPopover={true} />;
        };
        const wrapper = select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start close
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);

        // popover should open after clicking the button
        findTargetButton(wrapper).simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), true);

        // and should close after the a menu item is clicked
        wrapper.find(Popover2).find(`.${CoreClasses.MENU_ITEM}`).first().simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);
    });

    it("does not close the popover when selecting a MenuItem with shouldDismissPopover", () => {
        const itemRenderer = (film: Film) => {
            return <MenuItem text={`${film.rank}. ${film.title}`} shouldDismissPopover={false} />;
        };
        const wrapper = select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start closed
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);

        // popover should open after clicking the button
        findTargetButton(wrapper).simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), true);

        // and should not close after the a menu item is clicked
        wrapper.find(Popover2).find(`.${CoreClasses.MENU_ITEM}`).first().simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), true);
    });

    it("closes the popover when selecting first MenuItem2", () => {
        const itemRenderer = (film: Film) => {
            return <MenuItem2 text={`${film.rank}. ${film.title}`} shouldDismissPopover={true} />;
        };
        const wrapper = select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start close
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);

        // popover should open after clicking the button
        findTargetButton(wrapper).simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), true);

        // and should close after the a menu item is clicked
        wrapper.find(Popover2).find(`.${CoreClasses.MENU_ITEM}`).first().simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);
    });

    it("does not close the popover when selecting a MenuItem2 with shouldDismissPopover", () => {
        const itemRenderer = (film: Film) => {
            return <MenuItem2 text={`${film.rank}. ${film.title}`} shouldDismissPopover={false} />;
        };
        const wrapper = select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start closed
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), false);

        // popover should open after clicking the button
        findTargetButton(wrapper).simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), true);

        // and should not close after the a menu item is clicked
        wrapper.find(Popover2).find(`.${CoreClasses.MENU_ITEM}`).first().simulate("click");
        assert.strictEqual(wrapper.find(Popover2).prop("isOpen"), true);
    });

    function select(props: Partial<Select2Props<Film>> = {}, query?: string) {
        const wrapper = mount(
            <Select2<Film> {...defaultProps} {...handlers} {...props}>
                <Button data-testid="target-button" text="Target" />
            </Select2>,
            { attachTo: testsContainerElement },
        );
        if (query !== undefined) {
            wrapper.setState({ query });
        }
        return wrapper;
    }

    function findTargetButton(wrapper: ReactWrapper): ReactWrapper<HTMLAttributes> {
        return wrapper.find("[data-testid='target-button']").hostNodes();
    }
});

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}
