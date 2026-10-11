/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
import { useMemo } from "react";

import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { InputGroup } from "../components/forms/inputGroup";
import { HotkeysProvider } from "../context";

import { useHotkeys } from "./";

interface TestComponentProps extends TestComponentContainerProps {
    onKeyA: () => void;
    onKeyB: () => void;
}

interface TestComponentContainerProps {
    bindExtraKeys?: boolean;
    isInputReadOnly?: boolean;
    showDialogKeyCombo?: string | false;
}

const TestComponent: React.FC<TestComponentProps> = ({
    bindExtraKeys,
    isInputReadOnly,
    onKeyA,
    onKeyB,
    showDialogKeyCombo,
}) => {
    const hotkeys = useMemo(() => {
        const keys = [
            {
                combo: "A",
                label: "A",
                onKeyDown: onKeyA,
            },
            {
                combo: "B",
                global: true,
                label: "B",
                onKeyDown: onKeyB,
            },
        ];
        if (bindExtraKeys) {
            keys.push(
                {
                    combo: "shift+A",
                    label: "shift+A",
                    onKeyDown: onKeyA,
                },
                {
                    combo: "shift+B",
                    global: true,
                    label: "shift+B",
                    onKeyDown: onKeyB,
                },
            );
        }
        return keys;
    }, [bindExtraKeys, onKeyA, onKeyB]);

    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys, { showDialogKeyCombo });

    return (
        <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            <div data-testid="target-inside-component" tabIndex={0} />
            <InputGroup data-testid="input-target" readOnly={isInputReadOnly} />
        </div>
    );
};

describe("useHotkeys", () => {
    const onKeyASpy = vi.fn();
    const onKeyBSpy = vi.fn();

    const TestComponentContainer = (props: TestComponentContainerProps) => {
        return (
            <>
                <div data-testid="target-outside-component" />
                <TestComponent {...props} onKeyA={onKeyASpy} onKeyB={onKeyBSpy} />
            </>
        );
    };

    afterEach(() => {
        onKeyASpy.mockClear();
        onKeyBSpy.mockClear();
    });

    it("binds local hotkey", async () => {
        const user = userEvent.setup();
        render(<TestComponentContainer />);
        const target = screen.getByTestId("target-inside-component");
        target.focus();
        await user.keyboard("a");
        expect(onKeyASpy).toHaveBeenCalledOnce();
    });

    it("binds global hotkey", async () => {
        const user = userEvent.setup();
        render(<TestComponentContainer />);
        const target = screen.getByTestId("target-outside-component");
        target.focus();
        await user.keyboard("b");
        expect(onKeyBSpy).toHaveBeenCalledOnce();
    });

    it("binds new local hotkeys when hook arg is updated", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestComponentContainer />);
        rerender(<TestComponentContainer bindExtraKeys={true} />);
        const target = screen.getByTestId("target-inside-component");
        target.focus();
        // bindExtraKeys adds "shift+A" combo, so we need Shift held during keypress
        await user.keyboard("{Shift>}a{/Shift}");
        expect(onKeyASpy).toHaveBeenCalledOnce();
    });

    it("binds new global hotkeys when hook arg is updated", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestComponentContainer />);
        rerender(<TestComponentContainer bindExtraKeys={true} />);
        const target = screen.getByTestId("target-outside-component");
        target.focus();
        // bindExtraKeys adds "shift+B" combo, so we need Shift held during keypress
        await user.keyboard("{Shift>}b{/Shift}");
        expect(onKeyBSpy).toHaveBeenCalledOnce();
    });

    it("removes local hotkeys when hook arg is updated", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestComponentContainer bindExtraKeys={true} />);
        rerender(<TestComponentContainer />);
        const target = screen.getByTestId("target-inside-component");
        target.focus();
        // "shift+A" combo should no longer be bound after removing extra keys
        await user.keyboard("{Shift>}a{/Shift}");
        expect(onKeyASpy).not.toHaveBeenCalled();
    });

    it("removes global hotkeys when hook arg is updated", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestComponentContainer bindExtraKeys={true} />);
        rerender(<TestComponentContainer />);
        const target = screen.getByTestId("target-outside-component");
        target.focus();
        // "shift+B" combo should no longer be bound after removing extra keys
        await user.keyboard("{Shift>}b{/Shift}");
        expect(onKeyBSpy).not.toHaveBeenCalled();
    });

    it("does not trigger hotkeys inside text inputs", async () => {
        const user = userEvent.setup();
        render(<TestComponentContainer />);
        const target = screen.getByTestId("input-target");
        target.focus();
        await user.keyboard("a");
        expect(onKeyASpy).not.toHaveBeenCalled();
    });

    it("does trigger hotkeys inside readonly text inputs", async () => {
        const user = userEvent.setup();
        render(<TestComponentContainer isInputReadOnly={true} />);
        const target = screen.getByTestId("input-target");
        target.focus();
        await user.keyboard("a");
        expect(onKeyASpy).toHaveBeenCalledOnce();
    });

    describe("stopPropagation in nested contexts", () => {
        /** Renders a local hotkey bound to `combo` on a focusable div, optionally nesting children. */
        const NestedHotkey: React.FC<{
            children?: React.ReactNode;
            combo: string;
            onFire: () => void;
            stopPropagation?: boolean;
            testId: string;
        }> = ({ children, combo, onFire, stopPropagation, testId }) => {
            const keys = useMemo(
                () => [{ combo, label: testId, onKeyDown: onFire, stopPropagation }],
                [combo, onFire, stopPropagation, testId],
            );
            const { handleKeyDown, handleKeyUp } = useHotkeys(keys);
            return (
                <div data-testid={testId} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0}>
                    {children}
                </div>
            );
        };

        const renderNested = (stopPropagation: boolean) => {
            const onInner = vi.fn();
            const onOuter = vi.fn();
            render(
                <HotkeysProvider>
                    <NestedHotkey combo="X" onFire={onOuter} testId="outer-context">
                        <NestedHotkey
                            combo="X"
                            onFire={onInner}
                            stopPropagation={stopPropagation}
                            testId="inner-context"
                        />
                    </NestedHotkey>
                </HotkeysProvider>,
            );
            return { onInner, onOuter };
        };

        it("stopPropagation on the inner hotkey prevents the outer one from firing", async () => {
            const user = userEvent.setup();
            const { onInner, onOuter } = renderNested(true);
            screen.getByTestId("inner-context").focus();
            await user.keyboard("X");

            expect(onInner).toHaveBeenCalledOnce();
            // React dispatches local hotkeys from its root container, so stopping only the
            // native event left the outer context firing the same combo as well.
            expect(onOuter).not.toHaveBeenCalled();
        });

        it("without stopPropagation, both contexts still fire", async () => {
            const user = userEvent.setup();
            const { onInner, onOuter } = renderNested(false);
            screen.getByTestId("inner-context").focus();
            await user.keyboard("X");

            expect(onInner).toHaveBeenCalledOnce();
            expect(onOuter).toHaveBeenCalledOnce();
        });

        it("an outer hotkey still fires when the event originates outside the inner context", async () => {
            const user = userEvent.setup();
            const { onInner, onOuter } = renderNested(true);
            screen.getByTestId("outer-context").focus();
            await user.keyboard("X");

            expect(onOuter).toHaveBeenCalledOnce();
            expect(onInner).not.toHaveBeenCalled();
        });
    });

    describe("working with HotkeysProvider", () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
        beforeEach(() => warnSpy.mockClear());
        afterAll(() => warnSpy.mockRestore());

        it("logs a warning when used outside of HotkeysProvider context", () => {
            render(<TestComponentContainer />);
            expect(warnSpy).toHaveBeenCalledOnce();
        });

        it("does NOT log a warning when used inside a HotkeysProvider context", () => {
            render(
                <HotkeysProvider>
                    <TestComponentContainer />
                </HotkeysProvider>,
            );
            expect(warnSpy).not.toHaveBeenCalled();
        });
    });

    describe("showDialogKeyCombo", () => {
        it("opens the help dialog when the default combo (?) is pressed", async () => {
            const user = userEvent.setup();
            render(
                <HotkeysProvider>
                    <TestComponentContainer />
                </HotkeysProvider>,
            );
            expect(screen.queryByRole("dialog")).toBeNull();
            screen.getByTestId("target-outside-component").focus();
            await user.keyboard("{Shift>}/{/Shift}");
            expect(await screen.findByRole("dialog")).toBeInTheDocument();
        });

        it("does not open the help dialog when showDialogKeyCombo is false", async () => {
            const user = userEvent.setup();
            render(
                <HotkeysProvider>
                    <TestComponentContainer showDialogKeyCombo={false} />
                </HotkeysProvider>,
            );
            screen.getByTestId("target-outside-component").focus();
            await user.keyboard("{Shift>}/{/Shift}");
            expect(screen.queryByRole("dialog")).toBeNull();
        });
    });
});
