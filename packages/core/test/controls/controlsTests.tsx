/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Classes } from "../../src";
import { Checkbox, Radio, Switch } from "../../src/components/forms/controls";

describe("Controls", () => {
    describe("Checkbox", () => {
        it("should render", () => {
            render(<Checkbox />);
            const checkbox = screen.getByRole("checkbox");
            const control = checkbox.closest(`.${Classes.CONTROL}`);

            expect(checkbox).to.exist;
            expect(control).to.exist;
            expect(checkbox.getAttribute("type")).to.equal("checkbox");
            expect([...control!.classList]).to.include(Classes.CHECKBOX);
        });

        it("should support JSX children", () => {
            render(
                <Checkbox>
                    <span>Label Text</span>
                </Checkbox>,
            );

            expect(screen.getByText("Label Text")).to.exist;
        });

        it("should support JSX labelElement", () => {
            render(<Checkbox labelElement={<span>Label Text</span>} />);

            expect(screen.getByText("Label Text")).to.exist;
        });

        it("should support indeterminate state", () => {
            render(<Checkbox indeterminate={true} />);

            expect(screen.getByRole<HTMLInputElement>("checkbox").indeterminate).to.be.true;
        });

        it("should support defaultIndeterminate state", () => {
            render(<Checkbox defaultIndeterminate={true} />);

            expect(screen.getByRole<HTMLInputElement>("checkbox").indeterminate).to.be.true;
        });
    });

    describe("Radio", () => {
        it("should render", () => {
            render(<Radio />);
            const radio = screen.getByRole("radio");
            const control = radio.closest(`.${Classes.CONTROL}`);

            expect(radio).to.exist;
            expect(control).to.exist;
            expect(radio.getAttribute("type")).to.equal("radio");
            expect([...control!.classList]).to.include(Classes.RADIO);
        });

        it("should support JSX children", () => {
            render(
                <Radio>
                    <span>Label Text</span>
                </Radio>,
            );

            expect(screen.getByText("Label Text")).to.exist;
        });

        it("should support JSX labelElement", () => {
            render(<Radio labelElement={<span>Label Text</span>} />);

            expect(screen.getByText("Label Text")).to.exist;
        });
    });

    describe("Switch", () => {
        it("should render", () => {
            render(<Switch />);
            const checkbox = screen.getByRole("checkbox");
            const control = checkbox.closest(`.${Classes.CONTROL}`);

            expect(checkbox).to.exist;
            expect(control).to.exist;
            expect(checkbox.getAttribute("type")).to.equal("checkbox");
            expect([...control!.classList]).to.include(Classes.SWITCH);
        });

        it("should support JSX children", () => {
            render(
                <Switch>
                    <span>Label Text</span>
                </Switch>,
            );

            expect(screen.getByText("Label Text")).to.exist;
        });

        it("should support JSX labelElement", () => {
            render(<Switch labelElement={<span>Label Text</span>} />);

            expect(screen.getByText("Label Text")).to.exist;
        });

        it("should render both innerLabels when both defined", () => {
            render(<Switch innerLabelChecked="checked" innerLabel="unchecked" />);

            expect(screen.getByText("checked")).to.exist;
            expect(screen.getByText("unchecked")).to.exist;
        });

        it("should not render innerLabel components when neither defined", () => {
            render(<Switch />);

            expect(screen.queryByText("checked")).to.not.exist;
            expect(screen.queryByText("unchecked")).to.not.exist;
        });

        it("should render innerLabel when innerLabelChecked is defined", () => {
            render(<Switch innerLabelChecked="checked" />);
            const labels = screen.getAllByText("checked");

            expect(labels).to.have.length(1);
        });

        it("should use innerLabel for both states when only innerLabel is defined", () => {
            render(<Switch innerLabel="test" />);
            const switchContainer = screen.getByRole("checkbox").closest(`.${Classes.SWITCH}`);
            const labelTexts = switchContainer!.querySelectorAll(`.${Classes.SWITCH_INNER_TEXT}`);

            // Should render 2 containers and both should have "test" text (by design)
            expect(labelTexts).to.have.length(2);
            expect(labelTexts[0].textContent).to.equal("test"); // checked state
            expect(labelTexts[1].textContent).to.equal("test"); // unchecked state
        });

        it("should show innerLabelChecked only when innerLabel is explicitly empty string", () => {
            render(<Switch innerLabelChecked="on" innerLabel="" />);
            const switchContainer = screen.getByRole("checkbox").closest(`.${Classes.SWITCH}`);
            const labelTexts = switchContainer!.querySelectorAll(`.${Classes.SWITCH_INNER_TEXT}`);

            // Checked label should have "on", unchecked label should be empty (bug fix verification)
            expect(labelTexts[0].textContent).to.equal("on");
            expect(labelTexts[1].textContent).to.equal("");
        });

        it("should show innerLabel only when innerLabelChecked is explicitly empty string", () => {
            render(<Switch innerLabelChecked="" innerLabel="off" />);
            const switchContainer = screen.getByRole("checkbox").closest(`.${Classes.SWITCH}`);
            const labelTexts = switchContainer!.querySelectorAll(`.${Classes.SWITCH_INNER_TEXT}`);

            // Checked label should be empty, unchecked label should have "off" (bug fix verification)
            expect(labelTexts[0].textContent).to.equal("");
            expect(labelTexts[1].textContent).to.equal("off");
        });

        it("should toggle between innerLabelChecked and innerLabel when both are defined", () => {
            const { rerender } = render(<Switch innerLabelChecked="on" innerLabel="off" checked={false} />);
            let switchContainer = screen.getByRole("checkbox").closest(`.${Classes.SWITCH}`);
            let labelTexts = switchContainer!.querySelectorAll(`.${Classes.SWITCH_INNER_TEXT}`);

            // When unchecked, checked label should have "on" and unchecked label should have "off"
            expect(labelTexts[0].textContent).to.equal("on");
            expect(labelTexts[1].textContent).to.equal("off");

            // When checked, same labels exist (CSS controls visibility)
            rerender(<Switch innerLabelChecked="on" innerLabel="off" checked={true} />);
            switchContainer = screen.getByRole("checkbox").closest(`.${Classes.SWITCH}`);
            labelTexts = switchContainer!.querySelectorAll(`.${Classes.SWITCH_INNER_TEXT}`);
            expect(labelTexts[0].textContent).to.equal("on");
            expect(labelTexts[1].textContent).to.equal("off");
        });

        it("should show innerLabelChecked in checked label and empty in unchecked label when only innerLabelChecked is defined", () => {
            render(<Switch innerLabelChecked="on" />);
            const switchContainer = screen.getByRole("checkbox").closest(`.${Classes.SWITCH}`);
            const labelTexts = switchContainer!.querySelectorAll(`.${Classes.SWITCH_INNER_TEXT}`);

            // Checked label should have "on", unchecked label should be empty
            expect(labelTexts[0].textContent).to.equal("on");
            expect(labelTexts[1].textContent).to.equal("");
        });
    });
});
