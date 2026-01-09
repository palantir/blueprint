/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Slot } from "./slot";

describe("<Slot>", () => {
    it("merges props into a single child", () => {
        render(
            <Slot data-test="bar">
                <button id="foo">Test</button>
            </Slot>,
        );
        const button = screen.getByRole<HTMLButtonElement>("button", { name: /test/i });

        expect(button).toHaveAttribute("id", "foo");
        expect(button).toHaveAttribute("data-test", "bar");
    });

    it("merges className and style", () => {
        render(
            <Slot className="outer" style={{ fontWeight: 700 }}>
                <button className="inner" style={{ fontStyle: "italic" }}>
                    Test
                </button>
            </Slot>,
        );
        const button = screen.getByRole<HTMLButtonElement>("button", { name: /test/i });

        expect(button).toHaveClass("outer");
        expect(button).toHaveClass("inner");
        expect(button).toHaveStyle({ fontWeight: 700 });
        expect(button).toHaveStyle({ fontStyle: "italic" });
    });

    it("forwards ref to the child", () => {
        const ref = createRef<HTMLButtonElement>();
        render(
            <Slot ref={ref}>
                <button>Test</button>
            </Slot>,
        );
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        expect(ref.current).toBeInTheDocument();
    });

    it("returns null if no children are provided", () => {
        const { container } = render(<Slot />);
        expect(container.firstChild).toBeNull();
    });

    it("throws an error when multiple children are provided", () => {
        // suppress error logging to keep test output clean
        const stderrWriteSpy = vi.spyOn(process.stderr, "write").mockImplementation(vi.fn());
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());

        expect(() => {
            render(
                <Slot>
                    <button>First</button>
                    <button>Second</button>
                </Slot>,
            );
        }).toThrow("Only single element child is allowed in Slot");

        stderrWriteSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
});
