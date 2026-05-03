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

import { fireEvent, render } from "@testing-library/react";

import { beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { sleep } from "../../common/test-utils";

import { Toast } from "./toast";

describe("<Toast>", () => {
    it("renders only dismiss button by default", () => {
        const { container } = render(<Toast message="Hello World" />);
        expect(container.querySelectorAll(`.${Classes.TOAST} .${Classes.BUTTON}`)).toHaveLength(1);
    });

    it("clicking dismiss button triggers onDismiss callback with `false`", () => {
        const handleDismiss = vi.fn();
        const { container } = render(<Toast message="Hello" onDismiss={handleDismiss} />);
        const dismiss = container.querySelector<HTMLElement>(`.${Classes.TOAST} button`)!;
        fireEvent.click(dismiss);
        expect(handleDismiss).toHaveBeenCalledOnce();
        expect(handleDismiss).toHaveBeenCalledWith(false);
    });

    it("renders action button when action string prop provided", () => {
        const { container } = render(<Toast action={{ text: "Undo" }} message="hello world" />);
        const buttons = container.querySelectorAll<HTMLElement>(`.${Classes.TOAST} a, .${Classes.TOAST} button`);
        // First button is action (AnchorButton renders as <a>), last is dismiss button.
        expect(buttons.length).toBe(2);
        expect(buttons[0].textContent).toContain("Undo");
    });

    it("clicking action button triggers onClick callback", () => {
        const onClick = vi.fn();
        const { container } = render(<Toast action={{ onClick, text: "Undo" }} message="Hello" />);
        const action = container.querySelector<HTMLElement>(`.${Classes.TOAST} a, .${Classes.TOAST} button`)!;
        fireEvent.click(action);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("clicking action button also triggers onDismiss callback with `false`", () => {
        const handleDismiss = vi.fn();
        const { container } = render(<Toast action={{ text: "Undo" }} message="Hello" onDismiss={handleDismiss} />);
        const action = container.querySelector<HTMLElement>(`.${Classes.TOAST} a, .${Classes.TOAST} button`)!;
        fireEvent.click(action);
        expect(handleDismiss).toHaveBeenCalledOnce();
        expect(handleDismiss).toHaveBeenCalledWith(false);
    });

    describe("timeout", () => {
        const handleDismiss = vi.fn();
        beforeEach(() => handleDismiss.mockReset());

        it("calls onDismiss automatically after timeout expires with `true`", async () => {
            // mounting for lifecycle methods to start timeout
            render(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            await sleep(20);

            expect(handleDismiss).toHaveBeenCalledOnce();
            expect(handleDismiss.mock.calls[0][0]).toBe(true);
        });

        it("updating with timeout={0} cancels timeout", async () => {
            const { rerender } = render(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            rerender(<Toast message="Hello" onDismiss={handleDismiss} timeout={0} />);
            await sleep(20);
            expect(handleDismiss).not.toHaveBeenCalled();
        });

        it("updating timeout={0} with timeout={X} starts timeout", async () => {
            const { rerender } = render(<Toast message="Hello" onDismiss={handleDismiss} timeout={0} />);
            rerender(<Toast message="Hello" onDismiss={handleDismiss} timeout={20} />);
            await sleep(20);

            expect(handleDismiss).toHaveBeenCalledOnce();
            expect(handleDismiss.mock.calls[0][0]).toBe(true);
        });
    });
});
