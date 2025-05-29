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
import { expect } from "chai";
import * as React from "react";
import { spy } from "sinon";

import { CheckboxCard, Classes, RadioCard, RadioGroup, SwitchCard } from "../../src";
import { hasClass } from "../utils";

describe("ControlCard", () => {
    describe("SwitchCard", () => {
        it("should render switch control inside a card", () => {
            render(<SwitchCard label="Test Switch" />);
            const card = screen.getByRole("checkbox", { name: "Test Switch" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(hasClass(card!, Classes.CONTROL_CARD)).to.be.true;
        });

        it("should be end-aligned by default", () => {
            render(<SwitchCard label="Test Switch" />);
            const control = screen.getByRole("checkbox", { name: "Test Switch" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(hasClass(control!, Classes.ALIGN_RIGHT)).to.be.true;
        });

        it("should be start-aligned when alignIndicator is start", () => {
            render(<SwitchCard label="Test Switch" alignIndicator="start" />);
            const control = screen.getByRole("checkbox", { name: "Test Switch" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(hasClass(control!, Classes.ALIGN_LEFT)).to.be.true;
        });

        it("should toggle switch state when clicked", async () => {
            const handleChange = spy();
            render(<SwitchCard onChange={handleChange} label="Test Switch" data-testid="test-switch" />);
            const switchInput = screen.getByRole("checkbox", { name: "Test Switch" });

            await userEvent.click(switchInput);

            expect(handleChange.calledOnce).to.be.true;
        });

        it("should show as selected when checked", () => {
            render(<SwitchCard defaultChecked={true} label="Test Switch" data-testid="test-switch" />);
            const card = screen.getByTestId("test-switch");

            expect(hasClass(card, Classes.SELECTED)).to.be.true;
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

            expect(hasClass(card, Classes.SELECTED)).to.be.false;
        });
    });

    describe("CheckboxCard", () => {
        it("should render checkbox control inside a card", () => {
            render(<CheckboxCard label="Test Checkbox" />);
            const card = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(hasClass(card!, Classes.CONTROL_CARD)).to.be.true;
        });

        it("should be start-aligned by default", () => {
            render(<CheckboxCard label="Test Checkbox" />);
            const control = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(hasClass(control!, Classes.ALIGN_LEFT)).to.be.true;
        });

        it("should be end-aligned when alignIndicator is end", () => {
            render(<CheckboxCard label="Test Checkbox" alignIndicator="end" />);
            const control = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(hasClass(control!, Classes.ALIGN_RIGHT)).to.be.true;
        });

        it("should show as selected when checked", async () => {
            render(<CheckboxCard label="Test Checkbox" defaultChecked={true} />);
            const card = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(hasClass(card!, Classes.SELECTED)).to.be.true;
        });

        it("should not show selected state on card when showAsSelectedWhenChecked is false", () => {
            render(<CheckboxCard label="Test Checkbox" defaultChecked={true} showAsSelectedWhenChecked={false} />);
            const card = screen.getByRole("checkbox", { name: "Test Checkbox" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(hasClass(card!, Classes.SELECTED)).to.be.false;
        });
    });

    describe("RadioCard", () => {
        it("should render radio control inside a card", () => {
            render(<RadioCard label="Test Radio" value="test" />);
            const card = screen.getByRole("radio", { name: "Test Radio" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(hasClass(card!, Classes.CONTROL_CARD)).to.be.true;
        });

        it("should be end-aligned by default", () => {
            render(<RadioCard label="Test Radio" value="test" />);
            const control = screen.getByRole("radio", { name: "Test Radio" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(hasClass(control!, Classes.ALIGN_RIGHT)).to.be.true;
        });

        it("should be start-aligned when alignIndicator is start", () => {
            render(<RadioCard label="Test Radio" value="test" alignIndicator="start" />);
            const control = screen.getByRole("radio", { name: "Test Radio" }).closest(`.${Classes.CONTROL}`);

            expect(control).to.exist;
            expect(hasClass(control!, Classes.ALIGN_LEFT)).to.be.true;
        });

        it("should show as selected when checked", () => {
            const onChange = spy();
            render(
                <RadioGroup selectedValue="one" onChange={onChange}>
                    <RadioCard value="one" label="One" />
                    <RadioCard value="two" label="Two" />
                </RadioGroup>,
            );

            const cardOne = screen.getByRole("radio", { name: "One" }).closest(`.${Classes.CARD}`);
            const cardTwo = screen.getByRole("radio", { name: "Two" }).closest(`.${Classes.CARD}`);

            expect(hasClass(cardOne!, Classes.SELECTED)).to.be.true;
            expect(hasClass(cardTwo!, Classes.SELECTED)).to.be.false;
        });

        it("should not show selected state on card when showAsSelectedWhenChecked is false", () => {
            render(<RadioCard label="Test Radio" value="test" showAsSelectedWhenChecked={false} />);
            const card = screen.getByRole("radio", { name: "Test Radio" }).closest(`.${Classes.CARD}`);

            expect(card).to.exist;
            expect(hasClass(card!, Classes.SELECTED)).to.be.false;
        });

        it("should work within a RadioGroup", async () => {
            const changeSpy = spy();
            render(
                <RadioGroup onChange={changeSpy}>
                    <RadioCard value="one" label="One" />
                    <RadioCard value="two" label="Two" />
                </RadioGroup>,
            );

            const radioOne = screen.getByRole("radio", { name: "One" });
            const radioTwo = screen.getByRole("radio", { name: "Two" });

            await userEvent.click(radioOne);
            await userEvent.click(radioTwo);

            expect(changeSpy.callCount).to.equal(2);
        });
    });
});
