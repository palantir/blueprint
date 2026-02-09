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
import { type SinonStub, spy, stub } from "sinon";

import { afterAll, afterEach, beforeAll, describe, expect, it } from "@blueprintjs/test-commons/vitest";

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
}

const TestComponent: React.FC<TestComponentProps> = ({ bindExtraKeys, isInputReadOnly, onKeyA, onKeyB }) => {
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

    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    return (
        <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            <div data-testid="target-inside-component" tabIndex={0} />
            <InputGroup data-testid="input-target" readOnly={isInputReadOnly} />
        </div>
    );
};

describe("useHotkeys", () => {
    const onKeyASpy = spy();
    const onKeyBSpy = spy();

    const TestComponentContainer = (props: TestComponentContainerProps) => {
        return (
            <>
                <div data-testid="target-outside-component" />
                <TestComponent {...props} onKeyA={onKeyASpy} onKeyB={onKeyBSpy} />
            </>
        );
    };

    afterEach(() => {
        onKeyASpy.resetHistory();
        onKeyBSpy.resetHistory();
    });

    it("binds local hotkey", async () => {
        const user = userEvent.setup();
        render(<TestComponentContainer />);
        const target = screen.getByTestId("target-inside-component");
        target.focus();
        await user.keyboard("a");
        expect(onKeyASpy.callCount).to.equal(1, "hotkey a should be called once");
    });

    it("binds global hotkey", async () => {
        const user = userEvent.setup();
        render(<TestComponentContainer />);
        const target = screen.getByTestId("target-outside-component");
        target.focus();
        await user.keyboard("b");
        expect(onKeyBSpy.callCount).to.equal(1, "hotkey b should be called once");
    });

    it("binds new local hotkeys when hook arg is updated", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestComponentContainer />);
        rerender(<TestComponentContainer bindExtraKeys={true} />);
        const target = screen.getByTestId("target-inside-component");
        target.focus();
        await user.keyboard("{Shift>}a{/Shift}");
        expect(onKeyASpy.callCount).to.equal(1, "hotkey A should be called once");
    });

    it("binds new global hotkeys when hook arg is updated", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestComponentContainer />);
        rerender(<TestComponentContainer bindExtraKeys={true} />);
        const target = screen.getByTestId("target-outside-component");
        target.focus();
        await user.keyboard("{Shift>}b{/Shift}");
        expect(onKeyBSpy.callCount).to.equal(1, "hotkey B should be called once");
    });

    it("removes local hotkeys when hook arg is updated", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestComponentContainer bindExtraKeys={true} />);
        rerender(<TestComponentContainer />);
        const target = screen.getByTestId("target-inside-component");
        target.focus();
        await user.keyboard("{Shift>}a{/Shift}");
        expect(onKeyASpy.callCount).to.equal(0, "hotkey A should not be called");
    });

    it("removes global hotkeys when hook arg is updated", async () => {
        const user = userEvent.setup();
        const { rerender } = render(<TestComponentContainer bindExtraKeys={true} />);
        rerender(<TestComponentContainer />);
        const target = screen.getByTestId("target-outside-component");
        target.focus();
        await user.keyboard("{Shift>}b{/Shift}");
        expect(onKeyBSpy.callCount).to.equal(0, "hotkey B should not be called");
    });

    it("does not trigger hotkeys inside text inputs", async () => {
        const user = userEvent.setup();
        render(<TestComponentContainer />);
        const target = screen.getByTestId("input-target");
        target.focus();
        await user.keyboard("a");
        expect(onKeyASpy.callCount).to.equal(0, "hotkey A should not be called");
    });

    it("does trigger hotkeys inside readonly text inputs", async () => {
        const user = userEvent.setup();
        render(<TestComponentContainer isInputReadOnly={true} />);
        const target = screen.getByTestId("input-target");
        target.focus();
        await user.keyboard("a");
        expect(onKeyASpy.callCount).to.equal(1, "hotkey A should be called once");
    });

    describe("working with HotkeysProvider", () => {
        let warnSpy: SinonStub | undefined;

        beforeAll(() => (warnSpy = stub(console, "warn")));
        afterEach(() => warnSpy?.resetHistory());
        afterAll(() => warnSpy?.restore());

        it("logs a warning when used outside of HotkeysProvider context", () => {
            render(<TestComponentContainer />);
            expect(warnSpy?.calledOnce).to.be.true;
        });

        it("does NOT log a warning when used inside a HotkeysProvider context", () => {
            render(
                <HotkeysProvider>
                    <TestComponentContainer />
                </HotkeysProvider>,
            );
            expect(warnSpy?.notCalled).to.be.true;
        });
    });
});
