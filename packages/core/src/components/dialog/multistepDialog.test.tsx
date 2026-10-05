/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { DialogStep } from "./dialogStep";
import { MultistepDialog } from "./multistepDialog";

describe("<MultistepDialog>", () => {
    it("renders its content correctly", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
            </MultistepDialog>,
        );
        [
            Classes.DIALOG,
            Classes.MULTISTEP_DIALOG_PANELS,
            Classes.MULTISTEP_DIALOG_LEFT_PANEL,
            Classes.MULTISTEP_DIALOG_RIGHT_PANEL,
            Classes.DIALOG_STEP,
            Classes.DIALOG_STEP_CONTAINER,
            Classes.DIALOG_STEP_ICON,
            Classes.DIALOG_STEP_TITLE,
            Classes.DIALOG_FOOTER_ACTIONS,
        ].forEach(className => {
            expect(container.querySelectorAll(`.${className}`)).toHaveLength(1);
        });
    });

    it("initially selected step is first step", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        const stepContainers = container.querySelectorAll(`.${Classes.DIALOG_STEP_CONTAINER}`);
        expect(stepContainers[0]).toHaveClass(Classes.ACTIVE);
        expect(stepContainers[1]).not.toHaveClass(Classes.ACTIVE);
    });

    it("clicking next should move to the next step", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        await user.click(screen.getByRole("button", { name: "Next" }));
        const stepContainers = container.querySelectorAll(`.${Classes.DIALOG_STEP_CONTAINER}`);
        expect(stepContainers[0]).toHaveClass(Classes.DIALOG_STEP_VIEWED);
        expect(stepContainers[1]).toHaveClass(Classes.ACTIVE);
    });

    it("clicking back should move to the prev step", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );

        await user.click(screen.getByRole("button", { name: "Next" }));
        const stepContainers = container.querySelectorAll(`.${Classes.DIALOG_STEP_CONTAINER}`);
        expect(stepContainers[0]).toHaveClass(Classes.DIALOG_STEP_VIEWED);
        expect(stepContainers[1]).toHaveClass(Classes.ACTIVE);

        await user.click(screen.getByRole("button", { name: "Back" }));
        expect(stepContainers[0]).toHaveClass(Classes.ACTIVE);
        expect(stepContainers[1]).toHaveClass(Classes.DIALOG_STEP_VIEWED);
    });

    it("footer on last step of multiple steps should contain back and submit buttons", async () => {
        const user = userEvent.setup();
        render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        await user.click(screen.getByRole("button", { name: "Next" }));
        expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("footer on first step of multiple steps should contain next button only", () => {
        render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();
    });

    it("footer on first step of single step should contain submit button only", () => {
        render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
            </MultistepDialog>,
        );
        expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("selecting older step should leave already viewed steps active", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        await user.click(screen.getByRole("button", { name: "Next" }));
        // Click on the first step in the left panel
        const stepButtons = container.querySelectorAll<HTMLElement>(`.${Classes.DIALOG_STEP}`);
        await user.click(stepButtons[0]);
        const stepContainers = container.querySelectorAll(`.${Classes.DIALOG_STEP_CONTAINER}`);
        expect(stepContainers[0]).toHaveClass(Classes.ACTIVE);
        expect(stepContainers[1]).toHaveClass(Classes.DIALOG_STEP_VIEWED);
    });

    it("pressing enter on older step takes effect", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        await user.click(screen.getByRole("button", { name: "Next" }));
        const stepContainers = container.querySelectorAll(`.${Classes.DIALOG_STEP_CONTAINER}`);
        expect(stepContainers[1]).toHaveClass(Classes.ACTIVE);

        const firstStep = container.querySelectorAll<HTMLElement>(`.${Classes.DIALOG_STEP}`)[0];
        firstStep.focus();
        await user.keyboard("{Enter}");
        expect(stepContainers[0]).toHaveClass(Classes.ACTIVE);
    });

    it("gets by without children", () => {
        expect(() => {
            render(<MultistepDialog isOpen={true} />);
        }).not.toThrow();
    });

    it("supports non-existent children", () => {
        expect(() => {
            render(
                <MultistepDialog>
                    {null}
                    <DialogStep id="one" panel={<Panel />} />
                    {undefined}
                    <DialogStep id="two" panel={<Panel />} />
                </MultistepDialog>,
            );
        }).not.toThrow();
    });

    it("enables next by default", () => {
        render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        expect(screen.getByRole("button", { name: "Next" })).not.toHaveAttribute("aria-disabled", "true");
    });

    it("disables next if disabled on nextButtonProps is set to true", () => {
        render(
            <MultistepDialog nextButtonProps={{ disabled: true }} isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute("aria-disabled", "true");
    });

    it("disables next for second step when disabled on nextButtonProps is set to true", async () => {
        const user = userEvent.setup();
        render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} nextButtonProps={{ disabled: true }} />
                <DialogStep id="three" title="Step 3" panel={<Panel />} />
            </MultistepDialog>,
        );

        // Step 1: next should be enabled
        expect(screen.getByRole("button", { name: "Next" })).not.toHaveAttribute("aria-disabled", "true");
        await user.click(screen.getByRole("button", { name: "Next" }));

        // Step 2: next should be disabled
        expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute("aria-disabled", "true");
        await user.click(screen.getByRole("button", { name: "Next" }));

        // Should still be on step 2 (next was disabled), so Back and Next still visible
        expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });

    it("disables back for second step when disabled on backButtonProps is set to true", async () => {
        const user = userEvent.setup();
        render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} backButtonProps={{ disabled: true }} />
                <DialogStep id="three" title="Step 3" panel={<Panel />} />
            </MultistepDialog>,
        );

        await user.click(screen.getByRole("button", { name: "Next" }));

        // Step 2: back should be disabled
        expect(screen.getByRole("button", { name: "Back" })).toHaveAttribute("aria-disabled", "true");
        await user.click(screen.getByRole("button", { name: "Back" }));

        // Should still be on step 2 (back was disabled), so Back and Next still visible
        expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });
});

const Panel: React.FC = () => <strong> panel</strong>;
