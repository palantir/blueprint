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

import { afterEach, describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { InteractionModeEngine } from "./interactionMode";

describe("InteractionModeEngine", () => {
    const CLASS_NAME = "test-focus-disabled";
    let container: HTMLElement | undefined;
    let engine: InteractionModeEngine | undefined;

    afterEach(() => {
        engine?.stop();
        container?.remove();
        engine = undefined;
        container = undefined;
    });

    function createEngine() {
        container = document.createElement("div");
        document.body.appendChild(container);
        engine = new InteractionModeEngine(container, CLASS_NAME);
        return engine;
    }

    it("applies the className immediately on start so focus styles are hidden until Tab", () => {
        createEngine().start();
        expect(container!.classList.contains(CLASS_NAME)).toBe(true);
        expect(engine!.isActive()).toBe(true);
    });

    it("removes the className when Tab is pressed (keyboard mode)", () => {
        createEngine().start();
        container!.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }));
        expect(container!.classList.contains(CLASS_NAME)).toBe(false);
    });

    it("re-applies the className on mousedown after Tab (back to mouse mode)", () => {
        createEngine().start();
        container!.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }));
        container!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        expect(container!.classList.contains(CLASS_NAME)).toBe(true);
    });

    it("ignores non-Tab keydown events", () => {
        createEngine().start();
        container!.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
        expect(container!.classList.contains(CLASS_NAME)).toBe(true);
    });

    it("removes the className and stops on stop()", () => {
        const e = createEngine();
        e.start();
        e.stop();
        expect(container!.classList.contains(CLASS_NAME)).toBe(false);
        expect(e.isActive()).toBe(false);
    });
});
