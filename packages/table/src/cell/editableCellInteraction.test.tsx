/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

import { HotkeysProvider } from "@blueprintjs/core";
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { EditableCell } from "./editableCell";

describe("<EditableCell> mouse editing", () => {
    it.each([true, false])("can reopen after confirming with interactive=%s", interactive => {
        function ControlledCell() {
            const [value, setValue] = useState("original");
            return <EditableCell interactive={interactive} value={value} onConfirm={setValue} />;
        }
        render(
            <HotkeysProvider>
                <ControlledCell />
                <button>Outside</button>
            </HotkeysProvider>,
        );

        doubleClick(screen.getByText("original"));
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "confirmed" } });
        fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", keyCode: 13, which: 13 });
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

        doubleClick(screen.getByText("confirmed"));
        expect(screen.getByRole("textbox")).toHaveValue("confirmed");
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "confirmed again" } });
        fireEvent.blur(screen.getByRole("textbox"));

        doubleClick(screen.getByText("confirmed again"));
        expect(screen.getByRole("textbox")).toHaveValue("confirmed again");
    });
});

function doubleClick(target: HTMLElement) {
    for (let i = 0; i < 2; i++) {
        fireEvent.mouseDown(target);
        fireEvent.mouseUp(document);
    }
}
