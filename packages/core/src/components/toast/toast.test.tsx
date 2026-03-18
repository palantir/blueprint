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
        const { actionButtons, dismissButtons } = wrap(<Toast message="Hello World" />);
        expect(actionButtons).toHaveLength(0);
        expect(dismissButtons).toHaveLength(1);
    });

    it("clicking dismiss button triggers onDismiss callback with `false`", () => {
        const handleDismiss = vi.fn();
        const { dismissButtons } = wrap(<Toast message="Hello" onDismiss={handleDismiss} />);
        fireEvent.click(dismissButtons[0]);
        expect(handleDismiss).toHaveBeenCalledOnce();
        expect(handleDismiss).toHaveBeenCalledWith(false);
    });

    it("renders action button when action string prop provided", () => {
        // pluralize cuz now there are two buttons
        const { actionButtons } = wrap(<Toast action={{ text: "Undo" }} message="hello world" />);
        expect(actionButtons).toHaveLength(1);
        expect(actionButtons[0]).toHaveTextContent("Undo");
    });

    it("clicking action button triggers onClick callback", () => {
        const onClick = vi.fn();
        const { actionButtons } = wrap(<Toast action={{ onClick, text: "Undo" }} message="Hello" />);
        fireEvent.click(actionButtons[0]);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("clicking action button also triggers onDismiss callback with `false`", () => {
        const handleDismiss = vi.fn();
        const { actionButtons } = wrap(
            <Toast action={{ text: "Undo" }} message="Hello" onDismiss={handleDismiss} />,
        );
        fireEvent.click(actionButtons[0]);
        expect(handleDismiss).toHaveBeenCalledOnce();
        expect(handleDismiss).toHaveBeenCalledWith(false);
    });

    function wrap(toast: React.JSX.Element) {
        const { container } = render(toast);
        return {
            actionButtons: container.querySelectorAll(`a.${Classes.BUTTON}`),
            dismissButtons: container.querySelectorAll(`button.${Classes.BUTTON}`),
            container,
        };
    }

    describe("timeout", () => {
        const handleDismiss = vi.fn();
        beforeEach(() => handleDismiss.mockReset());

        it("calls onDismiss automatically after timeout expires with `true`", async () => {
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
