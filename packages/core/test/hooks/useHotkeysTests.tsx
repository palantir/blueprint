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

import { render, fireEvent, screen } from "@testing-library/react";
import { expect } from "chai";
import React, { useMemo } from "react";
import { spy } from "sinon";

import { useHotkeys } from "../../src/hooks";

interface TestComponentProps {
    onKeyA: () => void;
    onKeyB: () => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ onKeyA, onKeyB }) => {
    const hotkeys = useMemo(
        () => [
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
        ],
        [],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    return <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />;
};

describe.only("useHotkeys", () => {
    const onKeyASpy = spy();
    const onKeyBSpy = spy();

    const TestComponentContainer = () => {
        return (
            <>
                <div data-testid="target-outside-component" />
                <TestComponent onKeyA={onKeyASpy} onKeyB={onKeyBSpy} />
            </>
        );
    };

    afterEach(() => {
        onKeyASpy.resetHistory();
        onKeyBSpy.resetHistory();
    });

    it("binds local hotkey", () => {
        render(<TestComponentContainer />);
        const target = screen.getByTestId("target-outside-component");
        fireEvent.keyDown(target, { currentTarget: target, which: "A".charCodeAt(0) });
        expect(onKeyASpy.calledOnce).to.be.true;
    });

    it("binds global hotkey", () => {});
});
