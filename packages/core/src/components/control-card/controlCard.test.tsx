/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import { RadioGroup } from "../forms/radioGroup";

import { CheckboxCard } from "./checkboxCard";
import { RadioCard } from "./radioCard";
import { SwitchCard } from "./switchCard";

describe("ControlCard", () => {
    describe("SwitchCard", () => {
        it("should render switch control inside a card", () => {
            render(<SwitchCard label="Test Switch" />);
            const card = screen.getByRole("checkbox", { name: "Test Switch" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(card).toHaveClass(Classes.CONTROL_CARD);
        });

        it("should be end-aligned by default", () => {
            render(<SwitchCard label="Test Switch" />);
            const control = screen.getByRole("checkbox", { name: "Test Switch" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(control).toHaveClass(Classes.ALIGN_RIGHT);
        });

        it("should be start-aligned when alignIndicator is start", () => {
            render(<SwitchCard label="Test Switch" alignIndicator="start" />);
            const control = screen.getByRole("checkbox", { name: "Test Switch" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(control).toHaveClass(Classes.ALIGN_LEFT);
        });

        it("should toggle switch state when clicked", async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<SwitchCard onChange={handleChange} label="Test Switch" data-testid="test-switch" />);
            const switchInput = screen.getByRole("checkbox", { name: "Test Switch" });

            await user.click(switchInput);

            expect(handleChange).toHaveBeenCalledOnce();
        });

        it("should show as selected when checked", () => {
            render(<SwitchCard defaultChecked={true} label="Test Switch" data-testid="test-switch" />);
            const card = screen.getByTestId("test-switch");

            expect(card).toHaveClass(Classes.SELECTED);
        });

        it("should not show selected state on card when showAsSelectedWhenChecked is false", () => {
            render(
                <SwitchCard
                    defaultChecked={true}
                    showAsSelectedWhenChecked={false}
                    label="Test Switch"
                    data-testid="test-switch"
                />,
            );
            const card = screen.getByTestId("test-switch");

            expect(card).not.toHaveClass(Classes.SELECTED);
        });
    });

    describe("CheckboxCard", () => {
        it("should render checkbox control inside a card", () => {
            render(<CheckboxCard label="Test Checkbox" />);
            const card = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(card).toHaveClass(Classes.CONTROL_CARD);
        });

        it("should be start-aligned by default", () => {
            render(<CheckboxCard label="Test Checkbox" />);
            const control = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(control).toHaveClass(Classes.ALIGN_LEFT);
        });

        it("should be end-aligned when alignIndicator is end", () => {
            render(<CheckboxCard label="Test Checkbox" alignIndicator="end" />);
            const control = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(control).toHaveClass(Classes.ALIGN_RIGHT);
        });

        it("should show as selected when checked", async () => {
            render(<CheckboxCard label="Test Checkbox" defaultChecked={true} />);
            const card = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(card).toHaveClass(Classes.SELECTED);
        });

        it("should not show selected state on card when showAsSelectedWhenChecked is false", () => {
            render(<CheckboxCard label="Test Checkbox" defaultChecked={true} showAsSelectedWhenChecked={false} />);
            const card = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(card).not.toHaveClass(Classes.SELECTED);
        });
    });

    describe("RadioCard", () => {
        it("should render radio control inside a card", () => {
            render(<RadioCard label="Test Radio" value="test" />);
            const card = screen.getByRole("radio", { name: "Test Radio" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(card).toHaveClass(Classes.CONTROL_CARD);
        });

        it("should be end-aligned by default", () => {
            render(<RadioCard label="Test Radio" value="test" />);
            const control = screen.getByRole("radio", { name: "Test Radio" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(control).toHaveClass(Classes.ALIGN_RIGHT);
        });

        it("should be start-aligned when alignIndicator is start", () => {
            render(<RadioCard label="Test Radio" value="test" alignIndicator="start" />);
            const control = screen.getByRole("radio", { name: "Test Radio" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(control).toHaveClass(Classes.ALIGN_LEFT);
        });

        it("should show as selected when checked", () => {
            const onChange = vi.fn();
            render(
                <RadioGroup selectedValue="one" onChange={onChange}>
                    <RadioCard value="one" label="One" />
                    <RadioCard value="two" label="Two" />
                </RadioGroup>,
            );

            const cardOne = screen.getByRole("radio", { name: "One" }).closest(`.${Classes.CARD}`);
            const cardTwo = screen.getByRole("radio", { name: "Two" }).closest(`.${Classes.CARD}`);

            expect(cardOne).toHaveClass(Classes.SELECTED);
            expect(cardTwo).not.toHaveClass(Classes.SELECTED);
        });

        it("should not show selected state on card when showAsSelectedWhenChecked is false", () => {
            render(<RadioCard label="Test Radio" value="test" showAsSelectedWhenChecked={false} />);
            const card = screen.getByRole("radio", { name: "Test Radio" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(card).not.toHaveClass(Classes.SELECTED);
        });

        it("should work within a RadioGroup", async () => {
            const user = userEvent.setup();
            const changeSpy = vi.fn();
            render(
                <RadioGroup onChange={changeSpy}>
                    <RadioCard value="one" label="One" />
                    <RadioCard value="two" label="Two" />
                </RadioGroup>,
            );

            const radioOne = screen.getByRole("radio", { name: "One" });
            const radioTwo = screen.getByRole("radio", { name: "Two" });

            await user.click(radioOne);
            await user.click(radioTwo);

            expect(changeSpy).toHaveBeenCalledTimes(2);
        });
    });
});
