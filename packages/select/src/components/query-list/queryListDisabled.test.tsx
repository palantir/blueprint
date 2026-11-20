/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { fireEvent, render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { getCreateNewItem } from "../../common";

import { QueryList, type QueryListProps, type QueryListRendererProps } from "./queryList";

interface Item {
    blocked: boolean;
    disabled: boolean;
    label: string;
}

const alpha: Item = Object.freeze({ blocked: true, disabled: false, label: "Alpha" });
const beta: Item = Object.freeze({ blocked: false, disabled: false, label: "Beta" });
const items = [alpha, beta];
const disableAlpha = (item: Item) => item === alpha;
const enableAll = () => false;

const itemRenderer: QueryListProps<Item>["itemRenderer"] = (item, { handleClick, id, modifiers }) => (
    <li key={item.label}>
        <button disabled={modifiers.disabled} id={id} onClick={handleClick}>
            {item.label}
        </button>
    </li>
);

const renderer = (props: QueryListRendererProps<Item>) => (
    <>
        <input
            aria-label="Query"
            onChange={props.handleQueryChange}
            onKeyDown={props.handleKeyDown}
            onKeyUp={props.handleKeyUp}
            value={props.query}
        />
        <output aria-label="Active item">
            {props.activeItem != null && "label" in props.activeItem ? props.activeItem.label : "none"}
        </output>
        {props.itemList}
    </>
);

const commonProps = { itemRenderer, items, renderer };

function pressEnter() {
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    fireEvent.keyUp(screen.getByRole("textbox"), { key: "Enter" });
}

describe("<QueryList> disabled keyboard selection", () => {
    it("does not select an active item disabled by a new predicate", () => {
        const onItemSelect = vi.fn();
        const onQueryChange = vi.fn();
        const props = { ...commonProps, onItemSelect, onQueryChange };
        const { rerender } = render(<QueryList {...props} itemDisabled={enableAll} />);
        expect(screen.getByLabelText("Active item")).toHaveTextContent("Alpha");

        rerender(<QueryList {...props} itemDisabled={disableAlpha} />);
        expect(screen.getByRole("button", { name: "Alpha" })).toBeDisabled();
        pressEnter();

        expect(onItemSelect.mock.calls.map(([item]) => item)).not.toContain(alpha);
        expect(onQueryChange).not.toHaveBeenCalled();
    });

    it("does not select when every item becomes disabled, and still forwards key events", () => {
        const onItemSelect = vi.fn();
        const onKeyDown = vi.fn();
        const onKeyUp = vi.fn();
        const props = { ...commonProps, onItemSelect, onKeyDown, onKeyUp };
        const { rerender } = render(<QueryList {...props} itemDisabled={enableAll} />);

        rerender(<QueryList {...props} itemDisabled={() => true} />);
        pressEnter();

        expect(onItemSelect).not.toHaveBeenCalled();
        expect(onKeyDown).toHaveBeenCalledOnce();
        expect(onKeyUp).toHaveBeenCalledOnce();
    });

    it("respects a controlled active item without emitting a change for a blocked selection", () => {
        const onActiveItemChange = vi.fn();
        const onItemSelect = vi.fn();
        const props = { ...commonProps, onActiveItemChange, onItemSelect };
        const { rerender } = render(<QueryList {...props} activeItem={alpha} itemDisabled={enableAll} />);

        rerender(<QueryList {...props} activeItem={alpha} itemDisabled={disableAlpha} />);
        pressEnter();
        expect(onItemSelect).not.toHaveBeenCalled();
        expect(onActiveItemChange).not.toHaveBeenCalled();
        expect(screen.getByLabelText("Active item")).toHaveTextContent("Alpha");

        rerender(<QueryList {...props} activeItem={beta} itemDisabled={disableAlpha} />);
        pressEnter();
        expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(beta, expect.anything());
        expect(onActiveItemChange).toHaveBeenCalledExactlyOnceWith(beta, false);
    });

    it("rechecks a boolean property when the itemDisabled key changes", () => {
        const onItemSelect = vi.fn();
        const { rerender } = render(<QueryList {...commonProps} itemDisabled="disabled" onItemSelect={onItemSelect} />);

        rerender(<QueryList {...commonProps} itemDisabled="blocked" onItemSelect={onItemSelect} />);
        expect(screen.getByRole("button", { name: "Alpha" })).toBeDisabled();
        pressEnter();

        expect(onItemSelect.mock.calls.map(([item]) => item)).not.toContain(alpha);
    });

    it.each<QueryListProps<Item>["itemDisabled"]>(["blocked", item => item.blocked])(
        "checks the matching list item's disabled state for an equal controlled active item (%s)",
        itemDisabled => {
            const onItemSelect = vi.fn();
            const activeItem = { ...alpha, blocked: false };
            const props = { ...commonProps, activeItem, itemsEqual: "label" as const, onItemSelect };
            const { rerender } = render(<QueryList {...props} itemDisabled={enableAll} />);

            rerender(<QueryList {...props} itemDisabled={itemDisabled} />);
            expect(screen.getByRole("button", { name: "Alpha" })).toBeDisabled();
            pressEnter();

            expect(onItemSelect).not.toHaveBeenCalled();
        },
    );

    it("rechecks a stable predicate whose external disabled state changes", () => {
        let disabled = false;
        const itemDisabled = (item: Item) => disabled && item === alpha;
        const onItemSelect = vi.fn();
        const props = { ...commonProps, itemDisabled, onItemSelect };
        const { rerender } = render(<QueryList {...props} />);

        disabled = true;
        rerender(<QueryList {...props} />);
        expect(screen.getByRole("button", { name: "Alpha" })).toBeDisabled();
        pressEnter();

        expect(onItemSelect).not.toHaveBeenCalled();
    });

    it("uses the filtered item index and allows navigation to an enabled item", () => {
        const hidden: Item = { blocked: false, disabled: false, label: "Hidden" };
        const onItemSelect = vi.fn();
        const itemListPredicate = () => items;
        const props = { ...commonProps, itemListPredicate, items: [hidden, ...items], onItemSelect };
        const { rerender } = render(<QueryList {...props} itemDisabled={enableAll} />);

        rerender(<QueryList {...props} itemDisabled={(_item, index) => index === 0} />);
        expect(screen.getByRole("button", { name: "Alpha" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Beta" })).toBeEnabled();
        pressEnter();
        expect(onItemSelect.mock.calls.map(([item]) => item)).not.toContain(alpha);

        onItemSelect.mockClear();
        fireEvent.keyDown(screen.getByRole("textbox"), { key: "ArrowDown" });
        pressEnter();
        expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(beta, expect.anything());
    });

    it("rechecks disabled status between Enter keydown and keyup", () => {
        const onItemSelect = vi.fn();
        const { rerender } = render(
            <QueryList {...commonProps} itemDisabled={enableAll} onItemSelect={onItemSelect} />,
        );
        fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });

        rerender(<QueryList {...commonProps} itemDisabled={disableAlpha} onItemSelect={onItemSelect} />);
        fireEvent.keyUp(screen.getByRole("textbox"), { key: "Enter" });

        expect(onItemSelect.mock.calls.map(([item]) => item)).not.toContain(alpha);
    });

    it("keeps enabled active items and callback semantics when the predicate changes", () => {
        const onActiveItemChange = vi.fn();
        const onItemSelect = vi.fn();
        const onQueryChange = vi.fn();
        const props = { ...commonProps, initialActiveItem: beta, onActiveItemChange, onItemSelect, onQueryChange };
        const { rerender } = render(<QueryList {...props} itemDisabled={enableAll} />);

        rerender(<QueryList {...props} itemDisabled={disableAlpha} />);
        expect(screen.getByLabelText("Active item")).toHaveTextContent("Beta");
        expect(onActiveItemChange).not.toHaveBeenCalled();
        pressEnter();

        expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(beta, expect.anything());
        expect(onActiveItemChange).toHaveBeenCalledExactlyOnceWith(beta, false);
        expect(onQueryChange).not.toHaveBeenCalled();
    });

    it("skips an initially disabled item", () => {
        const onItemSelect = vi.fn();
        render(<QueryList {...commonProps} itemDisabled={disableAlpha} onItemSelect={onItemSelect} />);

        expect(screen.getByLabelText("Active item")).toHaveTextContent("Beta");
        pressEnter();

        expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(beta, expect.anything());
    });

    it("can select again after the active item is reenabled", () => {
        const onItemSelect = vi.fn();
        const props = { ...commonProps, activeItem: alpha, onItemSelect };
        const { rerender } = render(<QueryList {...props} itemDisabled={disableAlpha} />);

        rerender(<QueryList {...props} itemDisabled={enableAll} />);
        pressEnter();

        expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(alpha, expect.anything());
    });

    it("preserves keyboard item creation when list items are disabled", () => {
        const onItemSelect = vi.fn();
        const created: Item = { blocked: false, disabled: false, label: "Gamma" };
        render(
            <QueryList
                {...commonProps}
                activeItem={getCreateNewItem()}
                createNewItemFromQuery={() => created}
                createNewItemRenderer={(query, _active, handleClick) => <button onClick={handleClick}>{query}</button>}
                itemDisabled={() => true}
                onItemSelect={onItemSelect}
                query="Gamma"
            />,
        );

        pressEnter();

        expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(created, expect.anything());
    });

    it.each(["filtered", "items"] as const)(
        "preserves unmatched controlled selection outside %s with a positional disabled predicate",
        outside => {
            const activeItem = { ...alpha };
            const flags = [{ disabled: true }];
            const itemDisabled = vi.fn((_item: Item, index: number) => flags[index].disabled);
            const onActiveItemChange = vi.fn();
            const onItemSelect = vi.fn();
            const onKeyDown = vi.fn();
            const onKeyUp = vi.fn();
            const onQueryChange = vi.fn();
            const errors: unknown[] = [];
            const handleError = (event: ErrorEvent) => {
                errors.push(event.error);
                event.preventDefault();
            };
            const itemListPredicate = () => [beta];
            render(
                <QueryList
                    {...commonProps}
                    activeItem={activeItem}
                    itemDisabled={itemDisabled}
                    itemListPredicate={itemListPredicate}
                    items={outside === "filtered" ? [activeItem, beta] : [beta]}
                    onActiveItemChange={onActiveItemChange}
                    onItemSelect={onItemSelect}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onQueryChange={onQueryChange}
                />,
            );
            expect(screen.getByRole("button", { name: "Beta" })).toBeDisabled();
            itemDisabled.mockClear();

            window.addEventListener("error", handleError);
            try {
                pressEnter();
            } finally {
                window.removeEventListener("error", handleError);
            }

            expect(errors).toEqual([]);
            expect(itemDisabled).not.toHaveBeenCalled();
            expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(activeItem, expect.anything());
            expect(onActiveItemChange).toHaveBeenCalledExactlyOnceWith(activeItem, false);
            expect(onItemSelect.mock.calls[0][0]).toBe(activeItem);
            expect(onActiveItemChange.mock.calls[0][0]).toBe(activeItem);
            expect(onQueryChange).not.toHaveBeenCalled();
            expect(onKeyDown).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ key: "Enter" }));
            expect(onKeyUp).toHaveBeenCalledExactlyOnceWith(
                expect.objectContaining({ defaultPrevented: true, key: "Enter" }),
            );
            expect(screen.getByLabelText("Active item")).toHaveTextContent("Alpha");

            fireEvent.keyUp(screen.getByRole("textbox"), { key: "Enter" });
            expect(onItemSelect).toHaveBeenCalledOnce();
            expect(onKeyUp).toHaveBeenCalledTimes(2);
            expect(onKeyUp).toHaveBeenLastCalledWith(expect.objectContaining({ defaultPrevented: false }));
        },
    );

    it.each(["filtered", "items"] as const)(
        "preserves unmatched controlled selection outside %s with a disabled property key",
        outside => {
            const activeItem = { ...alpha };
            const onActiveItemChange = vi.fn();
            const onItemSelect = vi.fn();
            const onKeyDown = vi.fn();
            const onKeyUp = vi.fn();
            const onQueryChange = vi.fn();
            const itemListPredicate = () => [beta];
            render(
                <QueryList
                    {...commonProps}
                    activeItem={activeItem}
                    itemDisabled="blocked"
                    itemListPredicate={itemListPredicate}
                    items={outside === "filtered" ? [activeItem, beta] : [beta]}
                    onActiveItemChange={onActiveItemChange}
                    onItemSelect={onItemSelect}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onQueryChange={onQueryChange}
                />,
            );
            expect(screen.getByRole("button", { name: "Beta" })).toBeEnabled();

            pressEnter();

            expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(activeItem, expect.anything());
            expect(onActiveItemChange).toHaveBeenCalledExactlyOnceWith(activeItem, false);
            expect(onItemSelect.mock.calls[0][0]).toBe(activeItem);
            expect(onActiveItemChange.mock.calls[0][0]).toBe(activeItem);
            expect(onQueryChange).not.toHaveBeenCalled();
            expect(onKeyDown).toHaveBeenCalledOnce();
            expect(onKeyUp).toHaveBeenCalledExactlyOnceWith(
                expect.objectContaining({ defaultPrevented: true, key: "Enter" }),
            );
            expect(screen.getByLabelText("Active item")).toHaveTextContent("Alpha");
        },
    );

    it.each<QueryListProps<Item>["itemsEqual"]>(["label", (a, b) => a.label === b.label])(
        "preserves the original controlled callback object when its matching list item is enabled (%s)",
        itemsEqual => {
            const activeItem = { ...alpha, disabled: true };
            const itemDisabled = vi.fn((item: Item) => item.disabled);
            const onActiveItemChange = vi.fn();
            const onItemSelect = vi.fn();
            const onKeyDown = vi.fn();
            const onKeyUp = vi.fn();
            const onQueryChange = vi.fn();
            render(
                <QueryList
                    {...commonProps}
                    activeItem={activeItem}
                    itemDisabled={itemDisabled}
                    itemsEqual={itemsEqual}
                    onActiveItemChange={onActiveItemChange}
                    onItemSelect={onItemSelect}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    onQueryChange={onQueryChange}
                />,
            );
            expect(screen.getByRole("button", { name: "Alpha" })).toBeEnabled();

            pressEnter();

            expect(onItemSelect).toHaveBeenCalledExactlyOnceWith(activeItem, expect.anything());
            expect(onActiveItemChange).toHaveBeenCalledExactlyOnceWith(activeItem, false);
            expect(onItemSelect.mock.calls[0][0]).toBe(activeItem);
            expect(onActiveItemChange.mock.calls[0][0]).toBe(activeItem);
            expect(onQueryChange).not.toHaveBeenCalled();
            expect(onKeyDown).toHaveBeenCalledOnce();
            expect(onKeyUp).toHaveBeenCalledOnce();
        },
    );
});
