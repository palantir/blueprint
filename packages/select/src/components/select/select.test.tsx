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

import { type HTMLAttributes, mount, type ReactWrapper } from "enzyme";
import { act } from "react";
import * as sinon from "sinon";

import { Button, Classes, InputGroup, MenuItem, PopoverNext } from "@blueprintjs/core";
import { afterEach, beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";
import { unmountWrappers } from "@blueprintjs/test-commons/vitest-utils";

import { type Film, renderFilm, TOP_100_FILMS } from "../../__examples__";
import type { ItemRendererProps } from "../../common/itemRenderer";

import { Select, type SelectProps, type SelectState } from "./select";
import { selectComponentSuite } from "./selectComponentTestUtils";
import { selectPopoverTestSuite } from "./selectPopoverTestUtils";

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
    let containerElement: HTMLElement;
    let mountedWrappers: Array<ReactWrapper<any, any>> = [];

    beforeEach(() => {
        handlers = {
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
            for (const spy of Object.values(handlers)) {
                spy.resetHistory();
            }
            containerElement.remove();
        }
    });

    selectComponentSuite<SelectProps<Film>, SelectState>(
        props =>
            mount(<Select {...props} popoverProps={{ isOpen: true, usePortal: false }} />) as ReactWrapper<
                SelectProps<Film>,
                SelectState
            >,
    );

    selectPopoverTestSuite<SelectProps<Film>, SelectState>(props => {
        const wrapper = mount(<Select {...props} />, { attachTo: containerElement }) as ReactWrapper<
            SelectProps<Film>,
            SelectState
        >;
        mountedWrappers.push(wrapper);
        return wrapper;
    });

    it("renders a Popover around children that contains InputGroup and items", () => {
        const wrapper = select();
        expect(wrapper.find(InputGroup)).toHaveLength(1);
        expect(wrapper.find(PopoverNext)).toHaveLength(1);
    });

    it("filterable=false hides InputGroup", () => {
        const wrapper = select({ filterable: false });
        expect(wrapper.find(InputGroup)).toHaveLength(0);
        expect(wrapper.find(PopoverNext)).toHaveLength(1);
    });

    it("disabled=true disables Popover", () => {
        const wrapper = select({ disabled: true });
        expect(wrapper.find(PopoverNext).prop("disabled")).toBe(true);
    });

    it("disabled=true doesn't call itemRenderer", () => {
        select({ disabled: true });
        expect(handlers.itemRenderer.callCount).toBe(0);
    });

    it("disabled=false calls itemRenderer", () => {
        select({ disabled: false });
        expect(handlers.itemRenderer.callCount).toBe(100);
    });

    it("inputProps value and onChange are ignored", () => {
        const inputProps = { onChange: sinon.spy(), value: "nailed it" };
        // @ts-expect-error - value and onChange are now omitted from the props type
        const input = select({ inputProps }).find("input");
        expect(input.prop("onChange")).not.toBe(inputProps.onChange);
        expect(input.prop("value")).not.toBe(inputProps.value);
    });

    it("Popover can be controlled with popoverProps", () => {
        // Select defines its own onOpening so this ensures that the passthrough happens
        const onOpening = sinon.spy();
        const wrapper = select({ popoverProps: { onOpening } });
        findTargetButton(wrapper).simulate("click");
        expect(onOpening.calledOnce).toBe(true);
    });

    // TODO(adahiya): move into selectComponentSuite, generalize for Suggest & MultiSelect
    it("opens Popover when arrow key pressed on target while closed", () => {
        // override isOpen in defaultProps
        const wrapper = select({ popoverProps: { usePortal: false } });
        // should be closed to start
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(false);
        findTargetButton(wrapper).simulate("keydown", { key: "ArrowDown" });
        // ...then open after key down
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(true);
    });

    it("invokes onItemSelect when clicking first MenuItem", () => {
        const wrapper = select();
        // N.B. need to trigger interaction on nested <a> element, where item onClick is actually attached to the DOM
        wrapper.find(PopoverNext).find(MenuItem).first().find("a").simulate("click");
        expect(handlers.onItemSelect.calledOnce).toBe(true);
    });

    it("closes Popover after selecting active item with the Enter key", () => {
        // override isOpen in defaultProps so that the popover can actually be closed
        const wrapper = select({
            popoverProps: { usePortal: true },
        });
        findTargetButton(wrapper).simulate("click");
        wrapper.find("input").simulate("keydown", { key: "Enter" });
        wrapper.find("input").simulate("keyup", { key: "Enter" });
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(false);
    });

    // N.B. it's not worth refactoring these tests to be DRY since there will soon
    // only be 1 MenuItem component in Blueprint v5

    it("closes the popover when selecting first MenuItem", () => {
        const itemRenderer = (film: Film) => {
            return <MenuItem text={`${film.rank}. ${film.title}`} shouldDismissPopover={true} />;
        };
        const wrapper = select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start close
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(false);

        // popover should open after clicking the button
        findTargetButton(wrapper).simulate("click");
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(true);

        // and should close after the a menu item is clicked
        wrapper.find(PopoverNext).find(`.${Classes.MENU_ITEM}`).first().simulate("click");
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(false);
    });

    it("does not close the popover when selecting a MenuItem with shouldDismissPopover", () => {
        const itemRenderer = (film: Film) => {
            return <MenuItem text={`${film.rank}. ${film.title}`} shouldDismissPopover={false} />;
        };
        const wrapper = select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start closed
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(false);

        // popover should open after clicking the button
        findTargetButton(wrapper).simulate("click");
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(true);

        // and should not close after the a menu item is clicked
        wrapper.find(PopoverNext).find(`.${Classes.MENU_ITEM}`).first().simulate("click");
        expect(wrapper.find(PopoverNext).prop("isOpen")).toBe(true);
    });

    function select(props: Partial<SelectProps<Film>> = {}, query?: string) {
        const wrapper = mount(
            <Select<Film> {...defaultProps} {...handlers} {...props}>
                <Button data-testid="target-button" text="Target" />
            </Select>,
            { attachTo: containerElement },
        );
        mountedWrappers.push(wrapper);
        if (query !== undefined) {
            act(() => {
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
