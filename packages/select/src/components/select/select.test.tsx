/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { spy } from "sinon";
import { afterEach, beforeEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Button, Classes } from "@blueprintjs/core";

import type { ItemRendererProps } from "../../common";
import { type Film, renderFilm, TOP_100_FILMS } from "../../__examples__";

import { Select, type SelectProps } from "./select";
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
    let containerElement: HTMLElement;

    beforeEach(() => {
        handlers = {
            itemPredicate: spy(filterByYear),
            itemRenderer: spy(renderFilm),
            onItemSelect: spy(),
        };
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        for (const spyObj of Object.values(handlers)) {
            spyObj.resetHistory();
        }
        containerElement.remove();
    });

    selectComponentSuite(props => {
        const result = render(<Select {...props} popoverProps={{ isOpen: true, usePortal: false }} />, {
            container: document.body.appendChild(document.createElement("div")),
        });
        return {
            rerender: newProps =>
                result.rerender(<Select {...newProps} popoverProps={{ isOpen: true, usePortal: false }} />),
        };
    });

    selectPopoverTestSuite(props => {
        render(<Select {...props} />, { container: containerElement });
    });

    it("should render a Popover around children that contains InputGroup and items", () => {
        select();
        expect(document.querySelector("input")).to.exist;
        expect(document.querySelector(`.${Classes.POPOVER}`)).to.exist;
    });

    it("should hide InputGroup when filterable=false", () => {
        select({ filterable: false });
        expect(document.querySelector("input")).to.be.null;
        expect(document.querySelector(`.${Classes.POPOVER}`)).to.exist;
    });

    it("should disable Popover when disabled=true", () => {
        select({ disabled: true });
        const popover = document.querySelector(`.${Classes.POPOVER}`);
        expect(popover).to.exist;
        // When disabled, the popover should have aria-disabled or disabled attribute
        expect(popover?.closest(`.${Classes.POPOVER_WRAPPER}`)?.querySelector("button")?.disabled).to.be.true;
    });

    it("should not call itemRenderer when disabled=true", () => {
        select({ disabled: true });
        expect(handlers.itemRenderer.callCount).to.equal(0);
    });

    it("should call itemRenderer when disabled=false", () => {
        select({ disabled: false });
        expect(handlers.itemRenderer.callCount).to.equal(100);
    });

    it("should ignore inputProps value and onChange", () => {
        const inputProps = { onChange: spy(), value: "nailed it" };
        // @ts-expect-error - value and onChange are now omitted from the props type
        select({ inputProps });
        const input = document.querySelector("input") as HTMLInputElement;
        expect(input).to.exist;
        expect(input.value).not.to.equal(inputProps.value);
    });

    it("should allow Popover to be controlled with popoverProps", async () => {
        // Select defines its own onOpening so this ensures that the passthrough happens
        const onOpening = spy();
        const modifiers = {}; // our own instance
        const user = userEvent.setup();
        select({ popoverProps: { modifiers, onOpening, usePortal: false } });
        const targetButton = screen.getByTestId("target-button");
        await user.click(targetButton);
        expect(onOpening.calledOnce).to.be.true;
    });

    it("should open Popover when arrow key pressed on target while closed", async () => {
        const user = userEvent.setup();
        // override isOpen in defaultProps
        select({ popoverProps: { usePortal: false } });
        // should be closed to start - no menu items visible
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.equal(0);
        const targetButton = screen.getByTestId("target-button");
        await user.click(targetButton);
        targetButton.focus();
        await user.keyboard("{ArrowDown}");
        // ...then open after key down - menu items should be visible
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.be.greaterThan(0);
    });

    it("should invoke onItemSelect when clicking first MenuItem", async () => {
        const user = userEvent.setup();
        select();
        const firstMenuItem = document.querySelector(`.${Classes.MENU_ITEM}`) as HTMLElement;
        expect(firstMenuItem).to.exist;
        // N.B. need to click the nested <a> element, where item onClick is actually attached to the DOM
        const anchor = firstMenuItem.querySelector("a") as HTMLElement;
        await user.click(anchor);
        expect(handlers.onItemSelect.calledOnce).to.be.true;
    });

    it("should close Popover after selecting active item with the Enter key", async () => {
        const user = userEvent.setup();
        // override isOpen in defaultProps so that the popover can actually be closed
        select({
            popoverProps: { usePortal: false },
        });
        const targetButton = screen.getByTestId("target-button");
        await user.click(targetButton);
        // Popover should be open - menu items visible
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.be.greaterThan(0);
        const input = document.querySelector("input") as HTMLInputElement;
        input.focus();
        await user.keyboard("{Enter}");
        // Popover should close - menu items hidden
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.equal(0);
    });

    it("should close the popover when selecting first MenuItem with shouldDismissPopover=true", async () => {
        const user = userEvent.setup();
        const itemRenderer = (film: Film) => {
            return <Button text={`${film.rank}. ${film.title}`} shouldDismissPopover={true} />;
        };
        select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start closed - no menu items visible
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.equal(0);

        // popover should open after clicking the button
        const targetButton = screen.getByTestId("target-button");
        await user.click(targetButton);
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.be.greaterThan(0);

        // and should close after a menu item is clicked
        const firstMenuItem = document.querySelector(`.${Classes.MENU_ITEM}`) as HTMLElement;
        await user.click(firstMenuItem);
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.equal(0);
    });

    it("should not close the popover when selecting a MenuItem with shouldDismissPopover=false", async () => {
        const user = userEvent.setup();
        const itemRenderer = (film: Film) => {
            return <Button text={`${film.rank}. ${film.title}`} shouldDismissPopover={false} />;
        };
        select({ itemRenderer, popoverProps: { usePortal: false } });

        // popover should start closed - no menu items visible
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.equal(0);

        // popover should open after clicking the button
        const targetButton = screen.getByTestId("target-button");
        await user.click(targetButton);
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.be.greaterThan(0);

        // and should not close after a menu item is clicked
        const firstMenuItem = document.querySelector(`.${Classes.MENU_ITEM}`) as HTMLElement;
        await user.click(firstMenuItem);
        expect(document.querySelectorAll(`.${Classes.MENU_ITEM}`).length).to.be.greaterThan(0);
    });

    function select(props: Partial<SelectProps<Film>> = {}) {
        return render(
            <Select<Film> {...defaultProps} {...handlers} {...props}>
                <Button data-testid="target-button" text="Target" />
            </Select>,
            { container: containerElement },
        );
    }
});

function filterByYear(query: string, film: Film) {
    return query === "" || film.year.toString() === query;
}
