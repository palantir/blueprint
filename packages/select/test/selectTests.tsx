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
import { type HTMLAttributes, mount, type ReactWrapper } from "enzyme";
import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import * as sinon from "sinon";

import { Button, Classes, InputGroup, MenuItem, Popover } from "@blueprintjs/core";

import { type ItemRendererProps, Select, type SelectProps } from "../src";
import { type Film, renderFilm, TOP_100_FILMS } from "../src/__examples__";
import type { SelectState } from "../src/components/select/select";

import { selectComponentSuite } from "./selectComponentSuite";
import { selectPopoverTestSuite } from "./selectPopoverTestSuite";

describe("<Select>", () => {
    const defaultProps = {
        items: TOP_100_FILMS,
        popoverProps: { isOpen: true, usePortal: false },
        query: "",
    };
    let handlers: {
        itemPredicate: sinon.SinonSpy<[string, Film], boolean>;
        itemRenderer: sinon.SinonSpy<[Film, ItemRendererProps], React.JSX.Element | null>;
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

    selectComponentSuite<SelectProps<Film>, SelectState>(props =>
        mount(<Select {...props} popoverProps={{ isOpen: true, usePortal: false }} />),
    );

    selectPopoverTestSuite<SelectProps<Film>, SelectState>(props =>
        mount(<Select {...props} />, { attachTo: testsContainerElement }),
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
        assert.isTrue(wrapper.find(Popover).prop("disabled"));
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
        const inputProps = { onChange: sinon.spy(), value: "nailed it" };
        // @ts-expect-error - value and onChange are now omitted from the props type
        const input = select({ inputProps }).find("input");
        assert.notEqual(input.prop("onChange"), inputProps.onChange);
        assert.notEqual(input.prop("value"), inputProps.value);
    });

    it("Popover can be controlled with popoverProps", () => {
        // Select defines its own onOpening so this ensures that the passthrough happens
        const onOpening = sinon.spy();
        const modifiers = {}; // our own instance
        const wrapper = select({ popoverProps: { modifiers, onOpening } });
        findTargetButton(wrapper).simulate("click");
        assert.strictEqual(wrapper.find(Popover).prop("modifiers"), modifiers);
        assert.isTrue(onOpening.calledOnce);
    });

    // TODO(adahiya): move into selectComponentSuite, generalize for Suggest & MultiSelect
    it("opens Popover when arrow key pressed on target while closed", () => {
        // override isOpen in defaultProps
        const wrapper = select({ popoverProps: { usePortal: false } });
        // should be closed to start
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
        findTargetButton(wrapper).simulate("keydown", { key: "ArrowDown" });
        // ...then open after key down
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));
    });

    it("invokes onItemSelect when clicking first MenuItem", () => {
        const wrapper = select();
        // N.B. need to trigger interaction on nested <a> element, where item onClick is actually attached to the DOM
        wrapper.find(Popover).find(MenuItem).first().find("a").simulate("click");
        assert.isTrue(handlers.onItemSelect.calledOnce);
    });

    it("closes Popover after selecting active item with the Enter key", () => {
        // override isOpen in defaultProps so that the popover can actually be closed
        const wrapper = select({
            popoverProps: { usePortal: true },
        });
        findTargetButton(wrapper).simulate("click");
        wrapper.find("input").simulate("keydown", { key: "Enter" });
        wrapper.find("input").simulate("keyup", { key: "Enter" });
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    // N.B. it's not worth refactoring these tests to be DRY since there will soon
    // only be 1 MenuItem component in Blueprint v5

    it("closes the popover when selecting first MenuItem", () => {
        const itemRenderer = (film: Film) => {
            return <MenuItem text={`${film.rank}. ${film.title}`} shouldDismissPopover={true} />;
        };
        const wrapper = select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start close
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));

        // popover should open after clicking the button
        findTargetButton(wrapper).simulate("click");
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));

        // and should close after the a menu item is clicked
        wrapper.find(Popover).find(`.${Classes.MENU_ITEM}`).first().simulate("click");
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));
    });

    it("does not close the popover when selecting a MenuItem with shouldDismissPopover", () => {
        const itemRenderer = (film: Film) => {
            return <MenuItem text={`${film.rank}. ${film.title}`} shouldDismissPopover={false} />;
        };
        const wrapper = select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start closed
        assert.isFalse(wrapper.find(Popover).prop("isOpen"));

        // popover should open after clicking the button
        findTargetButton(wrapper).simulate("click");
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));

        // and should not close after the a menu item is clicked
        wrapper.find(Popover).find(`.${Classes.MENU_ITEM}`).first().simulate("click");
        assert.isTrue(wrapper.find(Popover).prop("isOpen"));
    });

    function select(props: Partial<SelectProps<Film>> = {}, query?: string) {
        const wrapper = mount(
            <Select<Film> {...defaultProps} {...handlers} {...props}>
                <Button data-testid="target-button" text="Target" />
            </Select>,
            { attachTo: testsContainerElement },
        );
        if (query !== undefined) {
            TestUtils.act(() => {
                wrapper.setState({ query });
            });
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
