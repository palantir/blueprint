/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type * as FloatingUIReact from "@floating-ui/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "../../components";

import { PopoverNext } from "./popoverNext";

// vi.hoisted runs before vi.mock, so the spy is available in the factory
const { autoUpdateSpy } = vi.hoisted(() => ({
    autoUpdateSpy: vi.fn(() => () => {
        /* cleanup noop */
    }),
}));

vi.mock("@floating-ui/react", async importOriginal => {
    const actual = await importOriginal<typeof FloatingUIReact>();
    return {
        ...actual,
        autoUpdate: autoUpdateSpy,
    };
});

describe("<PopoverNext> autoUpdateOptions", () => {
    afterEach(() => {
        autoUpdateSpy.mockClear();
    });

    it("calls autoUpdate without options by default", async () => {
        const user = userEvent.setup();
        render(
            <PopoverNext content="content">
                <Button text="target" />
            </PopoverNext>,
        );

        await user.click(screen.getByRole("button", { name: "target" }));
        await waitFor(() => {
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        // autoUpdate is called when elements are mounted; verify no options arg
        expect(autoUpdateSpy).toHaveBeenLastCalledWith(
            expect.anything(), // reference
            expect.anything(), // floating
            expect.any(Function), // update
        );
    });

    it("forwards autoUpdateOptions to autoUpdate", async () => {
        const user = userEvent.setup();
        const options = { ancestorScroll: true, layoutShift: false };

        render(
            <PopoverNext content="content" autoUpdateOptions={options}>
                <Button text="target" />
            </PopoverNext>,
        );

        await user.click(screen.getByRole("button", { name: "target" }));
        await waitFor(() => {
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        // When autoUpdateOptions is provided, autoUpdate is called with 4 args
        expect(autoUpdateSpy).toHaveBeenLastCalledWith(
            expect.anything(), // reference
            expect.anything(), // floating
            expect.any(Function), // update
            options,
        );
    });

    it("forwards autoUpdateOptions with all behaviors disabled", async () => {
        const user = userEvent.setup();
        const options = {
            ancestorResize: false,
            ancestorScroll: false,
            elementResize: false,
            layoutShift: false,
        };

        render(
            <PopoverNext content="content" autoUpdateOptions={options}>
                <Button text="target" />
            </PopoverNext>,
        );

        await user.click(screen.getByRole("button", { name: "target" }));
        await waitFor(() => {
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        expect(autoUpdateSpy).toHaveBeenLastCalledWith(
            expect.anything(), // reference
            expect.anything(), // floating
            expect.any(Function), // update
            options,
        );
    });

    it("uses autoUpdate directly when autoUpdateOptions is undefined", async () => {
        render(
            <PopoverNext content="content" isOpen={true} autoUpdateOptions={undefined}>
                <Button text="target" />
            </PopoverNext>,
        );

        await waitFor(() => {
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        // undefined autoUpdateOptions should behave like default (no options arg)
        expect(autoUpdateSpy).toHaveBeenLastCalledWith(
            expect.anything(), // reference
            expect.anything(), // floating
            expect.any(Function), // update
        );
    });
});
