/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ItemRendererProps } from "../../common/itemRenderer";

import { Suggest } from "./suggest";

const items = ["Apple", "Orange"];

afterEach(cleanup);

describe("Suggest disabled selection", () => {
    it("ignores an option after becoming disabled while open", async () => {
        const onItemSelect = vi.fn();
        const props = {
            defaultSelectedItem: "Apple",
            inputValueRenderer: (item: string) => item,
            itemRenderer: (item: string, { handleClick }: ItemRendererProps) => (
                <li key={item} role="option" onClick={handleClick}>
                    {item}
                </li>
            ),
            items,
            onItemSelect,
        };
        const { rerender } = render(<Suggest {...props} />);
        fireEvent.focus(screen.getByRole("combobox"));
        const option = await screen.findByRole("option", { name: "Orange" });

        rerender(<Suggest {...props} disabled={true} />);
        fireEvent.click(option);

        expect(onItemSelect).not.toHaveBeenCalled();
        expect(screen.getByRole("combobox")).toHaveValue("Apple");
    });
});
