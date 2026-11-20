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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button, MenuItem } from "@blueprintjs/core";
import { afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import type { ItemRenderer } from "../../common";

import { Select } from "./select";

const TRANSITION_DURATION = 10_000;
const ITEMS = ["alpha", "beta"];

const filterItem = (query: string, item: string) => item.includes(query);

const renderItem: ItemRenderer<string> = (item, { handleClick, modifiers }) =>
    modifiers.matchesPredicate ? (
        <MenuItem active={modifiers.active} key={item} onClick={handleClick} roleStructure="listoption" text={item} />
    ) : null;

describe("<Select> focus", () => {
    afterEach(() => vi.restoreAllMocks());

    it("captures keyboard input while the popover is opening", async () => {
        const inputFocusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
        const user = userEvent.setup();
        const onOpened = vi.fn();
        renderSelect({ onOpened });

        await user.click(screen.getByRole("button", { name: "Open select" }));

        const input = screen.getByRole("combobox");
        expect(onOpened).not.toHaveBeenCalled();
        expect(input).toHaveFocus();
        expect(inputFocusSpy).toHaveBeenCalledWith({ preventScroll: true });

        await user.keyboard("abc");
        expect(input).toHaveValue("abc");
    });

    it("does not focus the filter input when autoFocus is false", async () => {
        const inputFocusSpy = vi.spyOn(HTMLInputElement.prototype, "focus");
        const user = userEvent.setup();
        renderSelect({ autoFocus: false });

        const trigger = screen.getByRole("button", { name: "Open select" });
        await user.click(trigger);

        expect(trigger).toHaveFocus();
        expect(inputFocusSpy).not.toHaveBeenCalled();
    });
});

function renderSelect({ autoFocus, onOpened }: { autoFocus?: boolean; onOpened?: () => void } = {}) {
    const handleItemSelect = vi.fn();

    render(
        <Select<string>
            inputProps={autoFocus === undefined ? undefined : { autoFocus }}
            itemPredicate={filterItem}
            itemRenderer={renderItem}
            items={ITEMS}
            onItemSelect={handleItemSelect}
            popoverProps={{ onOpened, transitionDuration: TRANSITION_DURATION, usePortal: false }}
        >
            <Button text="Open select" />
        </Select>,
    );
}
