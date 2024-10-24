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
import * as React from "react";

import { KeyComboTagInternal } from "../../src/components/hotkeys/keyComboTag";

describe("KeyCombo", () => {
    it("renders key combo", () => {
        render(<KeyComboTagInternal combo="cmd+C" platformOverride="Mac" />);
        expect(screen.getByText("C")).not.to.be.undefined;
    });

    describe("should render minimal key combos on Mac using icons", () => {
        render(<KeyComboTagInternal combo="mod+C" minimal={true} platformOverride="Mac" />);
        expect(() => screen.getByText("cmd + C", { exact: false })).to.throw;
        expect(screen.findAllByAltText("Command key")).not.to.be.undefined;
    });

    it("should render minimal key combos on non-Macs using text", () => {
        render(<KeyComboTagInternal combo="mod+C" minimal={true} platformOverride="Win32" />);
        const text = screen.getByText("ctrl + C", { exact: false }).innerText;
        expect(text).to.contain("ctrl");
        expect(text).to.contain("+");
        expect(text).to.contain("C");
    });
});
