/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

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
    const actual = await importOriginal<typeof import("@floating-ui/react")>();
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
        expect(autoUpdateSpy).toHaveBeenCalled();
        const lastCall = autoUpdateSpy.mock.calls[autoUpdateSpy.mock.calls.length - 1];
        // When no autoUpdateOptions, autoUpdate is passed directly (3 args: reference, floating, update)
        expect(lastCall).toHaveLength(3);
    });

    it("forwards autoUpdateOptions to autoUpdate", async () => {
        const user = userEvent.setup();
        const options = { layoutShift: false, ancestorScroll: true };

        render(
            <PopoverNext content="content" autoUpdateOptions={options}>
                <Button text="target" />
            </PopoverNext>,
        );

        await user.click(screen.getByRole("button", { name: "target" }));
        await waitFor(() => {
            expect(screen.getByText("content")).toBeInTheDocument();
        });

        expect(autoUpdateSpy).toHaveBeenCalled();
        const lastCall = autoUpdateSpy.mock.calls[autoUpdateSpy.mock.calls.length - 1];
        // When autoUpdateOptions is provided, autoUpdate is called with 4 args: reference, floating, update, options
        expect(lastCall).toHaveLength(4);
        expect(lastCall[3]).toEqual(options);
    });

    it("forwards autoUpdateOptions with all behaviors disabled", async () => {
        const user = userEvent.setup();
        const options = {
            ancestorScroll: false,
            ancestorResize: false,
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

        expect(autoUpdateSpy).toHaveBeenCalled();
        const lastCall = autoUpdateSpy.mock.calls[autoUpdateSpy.mock.calls.length - 1];
        expect(lastCall).toHaveLength(4);
        expect(lastCall[3]).toEqual(options);
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

        expect(autoUpdateSpy).toHaveBeenCalled();
        const lastCall = autoUpdateSpy.mock.calls[autoUpdateSpy.mock.calls.length - 1];
        // undefined autoUpdateOptions should behave like default (3 args)
        expect(lastCall).toHaveLength(3);
    });
});
