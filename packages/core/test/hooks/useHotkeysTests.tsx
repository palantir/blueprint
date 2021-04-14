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
import { expect } from "chai";
import React, { useMemo } from "react";
import { spy } from "sinon";

// N.B. { fireEvent } from "@testing-library/react" does not generate "real" enough events which
// work with our hotkey parser implementation (worth investigating...)
import { dispatchTestKeyboardEvent } from "@blueprintjs/test-commons";

import { InputGroup } from "../../src/components/forms/inputGroup";
import { useHotkeys } from "../../src/hooks";

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
    }, [bindExtraKeys]);

    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    return (
        <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            <div data-testid="target-inside-component" />
            <InputGroup data-testid="input-target" readOnly={isInputReadOnly} />
        </div>
    );
};

describe("useHotkeys", () => {
    if (React.version.startsWith("15")) {
        it("skipped tests for backwards-incompatible component", () => expect(true).to.be.true);
        return;
    }

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

    it("binds local hotkey", () => {
        render(<TestComponentContainer />);
        const target = screen.getByTestId("target-inside-component");
        dispatchTestKeyboardEvent(target, "keydown", "A");
        expect(onKeyASpy.calledOnce).to.be.true;
    });

    it("binds global hotkey", () => {
        render(<TestComponentContainer />);
        const target = screen.getByTestId("target-outside-component");
        dispatchTestKeyboardEvent(target, "keydown", "B");
        expect(onKeyBSpy.calledOnce).to.be.true;
    });

    it("binds new local hotkeys when hook arg is updated", () => {
        const { rerender } = render(<TestComponentContainer />);
        rerender(<TestComponentContainer bindExtraKeys={true} />);
        const target = screen.getByTestId("target-inside-component");
        dispatchTestKeyboardEvent(target, "keydown", "A", true);
        expect(onKeyASpy.calledOnce).to.be.true;
    });

    it("binds new global hotkeys when hook arg is updated", () => {
        const { rerender } = render(<TestComponentContainer />);
        rerender(<TestComponentContainer bindExtraKeys={true} />);
        const target = screen.getByTestId("target-outside-component");
        dispatchTestKeyboardEvent(target, "keydown", "B", true);
        expect(onKeyBSpy.calledOnce).to.be.true;
    });

    it("removes local hotkeys when hook arg is updated", () => {
        const { rerender } = render(<TestComponentContainer bindExtraKeys={true} />);
        rerender(<TestComponentContainer />);
        const target = screen.getByTestId("target-inside-component");
        dispatchTestKeyboardEvent(target, "keydown", "A", true);
        expect(onKeyASpy.notCalled).to.be.true;
    });

    it("removes global hotkeys when hook arg is updated", () => {
        const { rerender } = render(<TestComponentContainer bindExtraKeys={true} />);
        rerender(<TestComponentContainer />);
        const target = screen.getByTestId("target-outside-component");
        dispatchTestKeyboardEvent(target, "keydown", "B", true);
        expect(onKeyBSpy.notCalled).to.be.true;
    });

    it("does not trigger hotkeys inside text inputs", () => {
        render(<TestComponentContainer />);
        const target = screen.getByTestId("input-target");
        dispatchTestKeyboardEvent(target, "keydown", "A");
        expect(onKeyASpy.notCalled).to.be.true;
    });

    it("does trigger hotkeys inside readonly text inputs", () => {
        render(<TestComponentContainer isInputReadOnly={true} />);
        const target = screen.getByTestId("input-target");
        dispatchTestKeyboardEvent(target, "keydown", "A");
        expect(onKeyASpy.calledOnce).to.be.true;
    });
});
