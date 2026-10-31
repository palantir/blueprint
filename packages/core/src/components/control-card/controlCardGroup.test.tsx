/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { CheckboxCard } from "./checkboxCard";
import { CheckboxCardGroup } from "./checkboxCardGroup";
import { RadioCard } from "./radioCard";
import { RadioCardGroup } from "./radioCardGroup";
import { SwitchCard } from "./switchCard";
import { SwitchCardGroup } from "./switchCardGroup";

const emptyHandler = () => {
    return;
};

describe("<RadioCardGroup>", () => {
    it("renders with radiogroup role", () => {
        render(
            <RadioCardGroup onChange={emptyHandler}>
                <RadioCard value="one" label="One" />
                <RadioCard value="two" label="Two" />
            </RadioCardGroup>,
        );
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    it("applies control-card-group class", () => {
        render(
            <RadioCardGroup onChange={emptyHandler}>
                <RadioCard value="one" label="One" />
            </RadioCardGroup>,
        );
        const group = screen.getByRole("radiogroup");
        expect([...group.classList]).to.include(Classes.CONTROL_CARD_GROUP);
    });

    it("applies inline class when inline={true}", () => {
        render(
            <RadioCardGroup onChange={emptyHandler} inline={true}>
                <RadioCard value="one" label="One" />
            </RadioCardGroup>,
        );
        const group = screen.getByRole("radiogroup");
        expect([...group.classList]).to.include(Classes.INLINE);
    });

    it("does not apply inline class by default", () => {
        render(
            <RadioCardGroup onChange={emptyHandler}>
                <RadioCard value="one" label="One" />
            </RadioCardGroup>,
        );
        const group = screen.getByRole("radiogroup");
        expect([...group.classList]).not.to.include(Classes.INLINE);
    });

    it("selects the value when selectedValue is set", () => {
        render(
            <RadioCardGroup onChange={emptyHandler} selectedValue="two">
                <RadioCard value="one" label="One" />
                <RadioCard value="two" label="Two" />
            </RadioCardGroup>,
        );
        const radio1 = screen.getByRole<HTMLInputElement>("radio", { name: "One" });
        const radio2 = screen.getByRole<HTMLInputElement>("radio", { name: "Two" });
        expect(radio1.checked).to.be.false;
        expect(radio2.checked).to.be.true;
    });

    it("invokes onChange when a radio card is clicked", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <RadioCardGroup onChange={onChange}>
                <RadioCard value="one" label="One" />
                <RadioCard value="two" label="Two" />
            </RadioCardGroup>,
        );
        const radio1 = screen.getByRole("radio", { name: "One" });
        await user.click(radio1);
        expect(onChange).toHaveBeenCalledOnce();
    });

    it("disables all radio cards when disabled={true}", () => {
        render(
            <RadioCardGroup onChange={emptyHandler} disabled={true}>
                <RadioCard value="one" label="One" />
                <RadioCard value="two" label="Two" />
            </RadioCardGroup>,
        );
        const radio1 = screen.getByRole<HTMLInputElement>("radio", { name: "One" });
        const radio2 = screen.getByRole<HTMLInputElement>("radio", { name: "Two" });
        expect(radio1.disabled).to.be.true;
        expect(radio2.disabled).to.be.true;
    });

    it("renders label when provided", () => {
        render(
            <RadioCardGroup onChange={emptyHandler} label="Pick one">
                <RadioCard value="one" label="One" />
            </RadioCardGroup>,
        );
        expect(screen.getByText("Pick one")).toBeTruthy();
        const group = screen.getByRole("radiogroup");
        expect(group.getAttribute("aria-labelledby")).toBeTruthy();
    });

    it("renders non-RadioCard children without modification", () => {
        render(
            <RadioCardGroup onChange={emptyHandler}>
                <RadioCard value="one" label="One" />
                <div data-testid="extra" />
            </RadioCardGroup>,
        );
        expect(screen.getByTestId("extra")).toBeTruthy();
    });

    it("assigns the same name to all radio cards", () => {
        render(
            <RadioCardGroup onChange={emptyHandler} name="my-group">
                <RadioCard value="one" label="One" />
                <RadioCard value="two" label="Two" />
            </RadioCardGroup>,
        );
        const radios = screen.getAllByRole<HTMLInputElement>("radio");
        expect(radios[0].name).to.equal("my-group");
        expect(radios[1].name).to.equal("my-group");
    });
});

describe("<CheckboxCardGroup>", () => {
    it("renders with group role", () => {
        render(
            <CheckboxCardGroup>
                <CheckboxCard label="A" />
                <CheckboxCard label="B" />
            </CheckboxCardGroup>,
        );
        expect(screen.getByRole("group")).toBeTruthy();
    });

    it("applies inline class when inline={true}", () => {
        render(
            <CheckboxCardGroup inline={true}>
                <CheckboxCard label="A" />
            </CheckboxCardGroup>,
        );
        const group = screen.getByRole("group");
        expect([...group.classList]).to.include(Classes.INLINE);
    });

    it("disables all checkbox cards when disabled={true}", () => {
        render(
            <CheckboxCardGroup disabled={true}>
                <CheckboxCard label="A" />
                <CheckboxCard label="B" />
            </CheckboxCardGroup>,
        );
        const checkboxes = screen.getAllByRole<HTMLInputElement>("checkbox");
        expect(checkboxes[0].disabled).to.be.true;
        expect(checkboxes[1].disabled).to.be.true;
    });

    it("renders label when provided", () => {
        render(
            <CheckboxCardGroup label="Options">
                <CheckboxCard label="A" />
            </CheckboxCardGroup>,
        );
        expect(screen.getByText("Options")).toBeTruthy();
    });
});

describe("<SwitchCardGroup>", () => {
    it("renders with group role", () => {
        render(
            <SwitchCardGroup>
                <SwitchCard label="X" />
                <SwitchCard label="Y" />
            </SwitchCardGroup>,
        );
        expect(screen.getByRole("group")).toBeTruthy();
    });

    it("applies inline class when inline={true}", () => {
        render(
            <SwitchCardGroup inline={true}>
                <SwitchCard label="X" />
            </SwitchCardGroup>,
        );
        const group = screen.getByRole("group");
        expect([...group.classList]).to.include(Classes.INLINE);
    });

    it("disables all switch cards when disabled={true}", () => {
        render(
            <SwitchCardGroup disabled={true}>
                <SwitchCard label="X" />
                <SwitchCard label="Y" />
            </SwitchCardGroup>,
        );
        const switches = screen.getAllByRole<HTMLInputElement>("checkbox");
        expect(switches[0].disabled).to.be.true;
        expect(switches[1].disabled).to.be.true;
    });

    it("renders label when provided", () => {
        render(
            <SwitchCardGroup label="Toggles">
                <SwitchCard label="X" />
            </SwitchCardGroup>,
        );
        expect(screen.getByText("Toggles")).toBeTruthy();
    });
});
