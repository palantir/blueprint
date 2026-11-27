/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { NumericInput } from "./numericInput";

describe("NumericInput locale changes", () => {
    it.each([
        ["de-DE", "en-US", "1,5", "1.5", "2.5"],
        ["en-US", "de-DE", "1.5", "1,5", "2,5"],
        ["de-DE", undefined, "1,5", "1.5", "2.5"],
        [undefined, "de-DE", "1.5", "1,5", "2,5"],
    ])(
        "preserves uncontrolled arithmetic from %s to %s",
        async (locale, nextLocale, initial, localized, incremented) => {
            const user = userEvent.setup();
            const onValueChange = vi.fn();
            const { rerender } = render(
                <NumericInput defaultValue={initial} locale={locale} onValueChange={onValueChange} />,
            );
            const input = screen.getByRole("spinbutton");
            expect(input).toHaveValue(initial);

            rerender(<NumericInput defaultValue={initial} locale={nextLocale} onValueChange={onValueChange} />);
            expect.soft(input).toHaveValue(localized);
            expect(onValueChange).toHaveBeenCalledExactlyOnceWith(1.5, localized, input);

            await user.click(screen.getByRole("button", { name: "increment" }));
            expect.soft(input).toHaveValue(incremented);
            expect.soft(onValueChange).toHaveBeenLastCalledWith(2.5, incremented, input);
            expect(onValueChange).toHaveBeenCalledTimes(2);
        },
    );

    it("preserves the edited uncontrolled value instead of resetting to defaultValue", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { rerender } = render(<NumericInput defaultValue="9" locale="de-DE" onValueChange={onValueChange} />);
        const input = screen.getByRole("spinbutton");
        await user.clear(input);
        await user.type(input, "1,5");
        onValueChange.mockClear();

        rerender(<NumericInput defaultValue="9" locale="en-US" onValueChange={onValueChange} />);
        expect.soft(input).toHaveValue("1.5");
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith(1.5, "1.5", input);
        await user.keyboard("{ArrowUp}");
        expect.soft(input).toHaveValue("2.5");
        expect.soft(onValueChange).toHaveBeenLastCalledWith(2.5, "2.5", input);
    });

    it("keeps stable-locale arithmetic and ignores subsequent defaultValue changes", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { rerender } = render(<NumericInput defaultValue="1,5" locale="de-DE" onValueChange={onValueChange} />);
        rerender(<NumericInput defaultValue="9" locale="de-DE" onValueChange={onValueChange} />);
        const input = screen.getByRole("spinbutton");
        expect(input).toHaveValue("1,5");
        expect(onValueChange).not.toHaveBeenCalled();
        await user.click(screen.getByRole("button", { name: "increment" }));
        expect(input).toHaveValue("2,5");
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith(2.5, "2,5", input);
    });

    it("keeps an empty uncontrolled value empty without emitting a change", () => {
        const onValueChange = vi.fn();
        const { rerender } = render(<NumericInput locale="de-DE" onValueChange={onValueChange} />);
        rerender(<NumericInput locale="en-US" onValueChange={onValueChange} />);
        expect(screen.getByRole("spinbutton")).toHaveValue("");
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it.each(["-", "1e", "1e-"])("keeps incomplete uncontrolled input %s", value => {
        const onValueChange = vi.fn();
        const { rerender } = render(<NumericInput defaultValue={value} locale="de-DE" onValueChange={onValueChange} />);
        rerender(<NumericInput defaultValue={value} locale="en-US" onValueChange={onValueChange} />);
        const input = screen.getByRole("spinbutton");
        expect(input).toHaveValue(value);
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith(NaN, "", input);
    });

    it.each([
        [{ max: 1 }, "1", 1],
        [{ min: 2 }, "2", 2],
    ])("clamps in the new locale when bounds also change to %j", (bounds, expected, number) => {
        const onValueChange = vi.fn();
        const { rerender } = render(<NumericInput defaultValue="1,5" locale="de-DE" onValueChange={onValueChange} />);
        rerender(<NumericInput defaultValue="1,5" locale="en-US" {...bounds} onValueChange={onValueChange} />);
        const input = screen.getByRole("spinbutton");
        expect.soft(input).toHaveValue(expected);
        expect.soft(onValueChange).toHaveBeenCalledExactlyOnceWith(number, expected, input);
    });

    it("uses the new controlled value when value, locale, and bounds change together", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { rerender } = render(<NumericInput value="1,5" locale="de-DE" max={10} onValueChange={onValueChange} />);
        rerender(<NumericInput value="2.5" locale="en-US" max={4} onValueChange={onValueChange} />);
        const input = screen.getByRole("spinbutton");
        expect(input).toHaveValue("2.5");
        expect.soft(onValueChange).toHaveBeenCalledExactlyOnceWith(2.5, "2.5", input);
        await user.click(screen.getByRole("button", { name: "increment" }));
        expect(input).toHaveValue("2.5");
        expect(onValueChange).toHaveBeenLastCalledWith(3.5, "3.5", input);
    });

    it("preserves an unchanged controlled value when locale and bounds change together", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        function ControlledInput() {
            const [value, setValue] = useState("1,5");
            const [changed, setChanged] = useState(false);
            return (
                <>
                    <NumericInput
                        value={value}
                        locale={changed ? "en-US" : "de-DE"}
                        max={changed ? 20 : 10}
                        onValueChange={(number, text, inputElement) => {
                            onValueChange(number, text, inputElement);
                            setValue(text);
                        }}
                    />
                    <button onClick={() => setChanged(true)}>Change locale</button>
                </>
            );
        }
        render(<ControlledInput />);
        const input = screen.getByRole("spinbutton");
        await user.click(screen.getByRole("button", { name: "Change locale" }));
        expect.soft(input).toHaveValue("1.5");
        expect.soft(onValueChange).toHaveBeenCalledExactlyOnceWith(1.5, "1.5", input);
        await user.click(screen.getByRole("button", { name: "increment" }));
        expect.soft(input).toHaveValue("2.5");
        expect.soft(onValueChange).toHaveBeenLastCalledWith(2.5, "2.5", input);
    });

    it("keeps controlled display under the parent's control", async () => {
        const user = userEvent.setup();
        const onValueChange = vi.fn();
        const { rerender } = render(<NumericInput value="1,5" locale="de-DE" onValueChange={onValueChange} />);
        const input = screen.getByRole("spinbutton");
        rerender(<NumericInput value="1,5" locale="en-US" onValueChange={onValueChange} />);
        expect(input).toHaveValue("1,5");
        expect(onValueChange).toHaveBeenCalledExactlyOnceWith(1.5, "1.5", input);

        rerender(<NumericInput value="3.5" locale="en-US" onValueChange={onValueChange} />);
        await user.click(screen.getByRole("button", { name: "increment" }));
        expect(input).toHaveValue("3.5");
        expect(onValueChange).toHaveBeenLastCalledWith(4.5, "4.5", input);
    });
});
