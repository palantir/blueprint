/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Toast } from "./toast";

describe("<Toast>", () => {
    it("renders only dismiss button by default", () => {
        render(<Toast message="Hello World" />);
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(1);
        expect(buttons[0]).toHaveAttribute("aria-label", "Close");
    });

    it("clicking dismiss button triggers onDismiss callback with `false`", async () => {
        const user = userEvent.setup();
        const handleDismiss = vi.fn();
        render(<Toast message="Hello" onDismiss={handleDismiss} />);
        await user.click(screen.getByRole("button", { name: "Close" }));
        expect(handleDismiss).toHaveBeenCalledOnce();
        expect(handleDismiss).toHaveBeenCalledWith(false);
    });

    it("renders action button when action string prop provided", () => {
        render(<Toast action={{ text: "Undo" }} message="hello world" />);
        const actionButton = screen.getByRole("button", { name: "Undo" });
        expect(actionButton).toBeInTheDocument();
        expect(actionButton).toHaveTextContent("Undo");
    });

    it("clicking action button triggers onClick callback", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Toast action={{ onClick, text: "Undo" }} message="Hello" />);
        await user.click(screen.getByRole("button", { name: "Undo" }));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("clicking action button also triggers onDismiss callback with `false`", async () => {
        const user = userEvent.setup();
        const handleDismiss = vi.fn();
        render(<Toast action={{ text: "Undo" }} message="Hello" onDismiss={handleDismiss} />);
        await user.click(screen.getByRole("button", { name: "Undo" }));
        expect(handleDismiss).toHaveBeenCalledOnce();
        expect(handleDismiss).toHaveBeenCalledWith(false);
    });

    describe("timeout", () => {
        let handleDismiss: ReturnType<typeof vi.fn<(didTimeoutExpire: boolean) => void>>;
        beforeEach(() => (handleDismiss = vi.fn<(didTimeoutExpire: boolean) => void>()));

        it("calls onDismiss automatically after timeout expires with `true`", async () => {
            vi.useFakeTimers();
            render(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            await vi.advanceTimersByTimeAsync(20);
            expect(handleDismiss).toHaveBeenCalledOnce();
            expect(handleDismiss).toHaveBeenCalledWith(true);
            vi.useRealTimers();
        });

        it("updating with timeout={0} cancels timeout", async () => {
            vi.useFakeTimers();
            const { rerender } = render(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            rerender(<Toast message="Hello" onDismiss={handleDismiss} timeout={0} />);
            await vi.advanceTimersByTimeAsync(20);
            expect(handleDismiss).not.toHaveBeenCalled();
            vi.useRealTimers();
        });

        it("updating timeout={0} with timeout={X} starts timeout", async () => {
            vi.useFakeTimers();
            const { rerender } = render(<Toast message="Hello" onDismiss={handleDismiss} timeout={0} />);
            rerender(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            await vi.advanceTimersByTimeAsync(20);
            expect(handleDismiss).toHaveBeenCalledOnce();
            expect(handleDismiss).toHaveBeenCalledWith(true);
            vi.useRealTimers();
        });
    });
});
