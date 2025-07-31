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

import { KeyComboTagInternal } from "../../src/components/hotkeys/keyComboTag";

describe("KeyCombo", () => {
    it("renders key combo", () => {
        const { container } = render(<KeyComboTagInternal combo="cmd+C" platformOverride="Mac" />);
        const icon = container.querySelector('[data-icon="key-command"]');

        expect(icon).to.exist;
        expect(screen.getByText("cmd")).to.exist;
        expect(screen.getByText("C")).to.exist;
    });

    it("should render minimal key combos on Mac using icons", () => {
        render(<KeyComboTagInternal combo="mod+C" minimal={true} platformOverride="Mac" />);

        expect(screen.getByText("C")).to.exist;
        expect(screen.queryByText("ctrl")).to.not.exist;
    });

    it("should render minimal key combos on non-Macs using text", () => {
        render(<KeyComboTagInternal combo="mod+C" minimal={true} platformOverride="Win32" />);

        expect(screen.getByText("ctrl + C")).to.exist;
    });

    it("should render aliased keys with correct icon and text", () => {
        const { container } = render(<KeyComboTagInternal combo="arrowleft" />);
        const icon = container.querySelector('[data-icon="arrow-left"]');

        expect(icon).to.exist;
        expect(screen.getByText("left")).to.exist;
    });
});
