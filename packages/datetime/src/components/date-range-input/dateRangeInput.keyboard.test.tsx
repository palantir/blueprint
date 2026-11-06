/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { loadDateFnsLocaleFake } from "../../common/loadDateFnsLocaleFake";
import { TimePrecision } from "../../common/timePrecision";

import { DateRangeInput } from "./dateRangeInput";

const DEFAULT_PROPS = {
    dateFnsFormat: "yyyy-MM-dd",
    dateFnsLocaleLoader: loadDateFnsLocaleFake,
    defaultValue: [new Date(2026, 8, 1), new Date(2026, 8, 4)] as [Date, Date],
    endInputProps: { "aria-label": "End date" },
    popoverProps: { transitionDuration: 0, usePortal: false },
    startInputProps: { "aria-label": "Start date" },
};

describe("DateRangeInput popup keyboard access", () => {
    it.each([
        ["Start date", false],
        ["End date", false],
        ["Start date", true],
        ["End date", true],
    ])("enters from %s and returns on Escape (portal=%s)", async (label, usePortal) => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onClose = vi.fn();
        const onClosed = vi.fn();
        render(
            <DateRangeInput
                {...DEFAULT_PROPS}
                onChange={onChange}
                popoverProps={{ onClose, onClosed, transitionDuration: 0, usePortal: Boolean(usePortal) }}
            />,
        );
        const input = screen.getByRole("combobox", { name: String(label) });
        await user.click(input);
        await user.keyboard("{Alt>}{ArrowDown}{/Alt}");

        await waitFor(() => expect(screen.getByRole("menu", { name: "Date picker shortcuts" })).toHaveFocus());
        expect(onChange).not.toHaveBeenCalled();
        await user.keyboard("{Escape}");
        await waitFor(() => expect(input).toHaveFocus());
        await waitFor(() => expect(screen.queryByRole("menuitem", { name: "Past week" })).not.toBeInTheDocument());
        expect(onClose).toHaveBeenCalledOnce();
        expect(onClosed).toHaveBeenCalledOnce();
        await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
        await waitFor(() => expect(screen.getByRole("menu", { name: "Date picker shortcuts" })).toHaveFocus());
    });

    it("keeps month, year, shortcuts, and time controls reachable by Tab", async () => {
        const user = userEvent.setup();
        render(<DateRangeInput {...DEFAULT_PROPS} timePrecision={TimePrecision.MINUTE} closeOnSelection={false} />);
        await user.click(screen.getByRole("combobox", { name: "Start date" }));
        await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
        const shortcut = screen.getByRole("menuitem", { name: "Past week" });
        await waitFor(() => expect(screen.getByRole("menu", { name: "Date picker shortcuts" })).toHaveFocus());
        const popup = within(screen.getByRole("dialog"));
        const controls = [...popup.getAllByRole("combobox"), ...popup.getAllByRole("spinbutton")];
        const visited = new Set<Element | null>();
        for (let i = 0; i < 30; i++) {
            visited.add(document.activeElement);
            await user.tab();
        }
        expect(visited.has(shortcut)).toBe(true);
        for (const control of controls) {
            expect(visited.has(control)).toBe(true);
        }
    });

    it("preserves unmodified arrow-key date selection", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<DateRangeInput {...DEFAULT_PROPS} onChange={onChange} selectAllOnFocus={true} />);
        const input = screen.getByRole("combobox", { name: "End date" });
        await user.click(input);
        (input as HTMLInputElement).select();
        fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input).toHaveFocus();
        expect(onChange).toHaveBeenLastCalledWith([new Date(2026, 8, 1), new Date(2026, 8, 11)]);
    });
    it("keeps focus in the popup after selecting a shortcut without closing", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<DateRangeInput {...DEFAULT_PROPS} closeOnSelection={false} onChange={onChange} />);
        await user.click(screen.getByRole("combobox", { name: "Start date" }));
        await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
        await user.tab();
        const shortcut = screen.getByRole("menuitem", { name: "Past week" });
        expect(shortcut).toHaveFocus();
        await user.keyboard("{Enter}");
        expect(onChange).toHaveBeenCalledOnce();
        expect(shortcut).toHaveFocus();
    });

    it("returns to the end input after completing a selection from it", async () => {
        const user = userEvent.setup();
        render(<DateRangeInput {...DEFAULT_PROPS} />);
        await user.click(screen.getByRole("combobox", { name: "Start date" }));
        await user.tab();
        const endInput = screen.getByRole("combobox", { name: "End date" });
        expect(endInput).toHaveFocus();
        await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
        await user.tab();
        await user.keyboard("{Enter}");
        await waitFor(() => expect(endInput).toHaveFocus());
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("allows Shift+Tab to leave the beginning of the popup", async () => {
        const user = userEvent.setup();
        render(<DateRangeInput {...DEFAULT_PROPS} />);
        const input = screen.getByRole("combobox", { name: "Start date" });
        await user.click(input);
        await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
        await user.tab({ shift: true });
        await waitFor(() => expect(input).toHaveFocus());
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    it("enters a calendar with disabled navigation and no shortcuts", async () => {
        const user = userEvent.setup();
        render(
            <DateRangeInput
                {...DEFAULT_PROPS}
                shortcuts={false}
                singleMonthOnly={true}
                minDate={new Date(2026, 8, 1)}
                maxDate={new Date(2026, 8, 30)}
            />,
        );
        await user.click(screen.getByRole("combobox", { name: "Start date" }));
        await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
        await waitFor(() => expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement));
    });
});
