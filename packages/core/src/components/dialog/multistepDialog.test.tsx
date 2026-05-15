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

import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { assert, describe, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { DialogStep } from "./dialogStep";
import { MultistepDialog } from "./multistepDialog";

function findButtonWithText(container: HTMLElement, text: string): HTMLElement | null {
    const buttons = Array.from(container.querySelectorAll<HTMLElement>("a, button"));
    return buttons.find(b => b.textContent?.trim() === text) ?? null;
}

function getStepContainers(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(`.${Classes.DIALOG_STEP_CONTAINER}`));
}

function activeStepIndex(container: HTMLElement): number {
    return getStepContainers(container).findIndex(s => s.classList.contains(Classes.ACTIVE));
}

function isStepActive(step: HTMLElement): boolean {
    return step.classList.contains(Classes.ACTIVE);
}

function isStepViewed(step: HTMLElement): boolean {
    return step.classList.contains(Classes.DIALOG_STEP_VIEWED);
}

const Panel: React.FC = () => <strong> panel</strong>;

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
            assert.lengthOf(container.querySelectorAll(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("initially selected step is first step", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        assert.strictEqual(activeStepIndex(container), 0);
        const steps = getStepContainers(container);
        assert.isTrue(isStepActive(steps[0]));
        assert.isFalse(isStepActive(steps[1]));
    });

    it("clicking next should move to the next step", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        fireEvent.click(findButtonWithText(container, "Next")!);
        assert.strictEqual(activeStepIndex(container), 1);
        const steps = getStepContainers(container);
        assert.isTrue(isStepViewed(steps[0]));
        assert.isTrue(isStepActive(steps[1]));
    });

    it("clicking back should move to the prev step", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );

        fireEvent.click(findButtonWithText(container, "Next")!);
        assert.strictEqual(activeStepIndex(container), 1);
        let steps = getStepContainers(container);
        assert.isTrue(isStepViewed(steps[0]));
        assert.isTrue(isStepActive(steps[1]));

        fireEvent.click(findButtonWithText(container, "Back")!);
        steps = getStepContainers(container);
        assert.strictEqual(activeStepIndex(container), 0);
        assert.isTrue(isStepActive(steps[0]));
        assert.isTrue(isStepViewed(steps[1]));
    });

    it("footer on last step of multiple steps should contain back and submit buttons", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        fireEvent.click(findButtonWithText(container, "Next")!);
        assert.strictEqual(activeStepIndex(container), 1);
        assert.isNotNull(findButtonWithText(container, "Back"));
        assert.isNull(findButtonWithText(container, "Next"));
        assert.isNotNull(findButtonWithText(container, "Submit"));
    });

    it("footer on first step of multiple steps should contain next button only", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );

        assert.strictEqual(activeStepIndex(container), 0);
        assert.isNull(findButtonWithText(container, "Back"));
        assert.isNotNull(findButtonWithText(container, "Next"));
        assert.isNull(findButtonWithText(container, "Submit"));
    });

    it("footer on first step of single step should contain submit button only", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
            </MultistepDialog>,
        );

        assert.strictEqual(activeStepIndex(container), 0);
        assert.isNull(findButtonWithText(container, "Back"));
        assert.isNull(findButtonWithText(container, "Next"));
        assert.isNotNull(findButtonWithText(container, "Submit"));
    });

    it("selecting older step should leave already viewed steps active", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        assert.strictEqual(activeStepIndex(container), 0);
        fireEvent.click(findButtonWithText(container, "Next")!);
        assert.strictEqual(activeStepIndex(container), 1);
        const stepClickables = container.querySelectorAll<HTMLElement>(`.${Classes.DIALOG_STEP}`);
        fireEvent.click(stepClickables[0]);
        const steps = getStepContainers(container);
        assert.strictEqual(activeStepIndex(container), 0);
        assert.isTrue(isStepActive(steps[0]));
        assert.isTrue(isStepViewed(steps[1]));
    });

    it("pressing enter on older step takes effect", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        assert.strictEqual(activeStepIndex(container), 0);
        fireEvent.click(findButtonWithText(container, "Next")!);
        assert.strictEqual(activeStepIndex(container), 1);
        const stepClickables = container.querySelectorAll<HTMLElement>(`.${Classes.DIALOG_STEP}`);
        stepClickables[0].focus();
        await user.keyboard("{Enter}");
        assert.strictEqual(activeStepIndex(container), 0);
    });

    it("gets by without children", () => {
        assert.doesNotThrow(() => {
            const { unmount } = render(<MultistepDialog isOpen={true} />);
            unmount();
        });
    });

    it("supports non-existent children", () => {
        assert.doesNotThrow(() => {
            const { unmount } = render(
                <MultistepDialog>
                    {null}
                    <DialogStep id="one" panel={<Panel />} />
                    {undefined}
                    <DialogStep id="two" panel={<Panel />} />
                </MultistepDialog>,
            );
            unmount();
        });
    });

    it("enables next by default", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        const nextButton = findButtonWithText(container, "Next") as HTMLButtonElement | HTMLAnchorElement | null;
        assert.isFalse(nextButton?.classList.contains(Classes.DISABLED));
    });

    it("disables next if disabled on nextButtonProps is set to true", () => {
        const { container } = render(
            <MultistepDialog nextButtonProps={{ disabled: true }} isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        const nextButton = findButtonWithText(container, "Next");
        assert.isTrue(nextButton?.classList.contains(Classes.DISABLED));
    });

    it("disables next for second step when disabled on nextButtonProps is set to true", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} nextButtonProps={{ disabled: true }} />
                <DialogStep id="three" title="Step 3" panel={<Panel />} />
            </MultistepDialog>,
        );

        assert.strictEqual(activeStepIndex(container), 0);
        assert.isFalse(findButtonWithText(container, "Next")?.classList.contains(Classes.DISABLED));
        fireEvent.click(findButtonWithText(container, "Next")!);
        assert.strictEqual(activeStepIndex(container), 1);
        assert.isTrue(findButtonWithText(container, "Next")?.classList.contains(Classes.DISABLED));
        fireEvent.click(findButtonWithText(container, "Next")!);
        assert.strictEqual(activeStepIndex(container), 1);
    });

    it("disables back for second step when disabled on backButtonProps is set to true", () => {
        const { container } = render(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} backButtonProps={{ disabled: true }} />
                <DialogStep id="three" title="Step 3" panel={<Panel />} />
            </MultistepDialog>,
        );

        assert.strictEqual(activeStepIndex(container), 0);
        fireEvent.click(findButtonWithText(container, "Next")!);
        assert.strictEqual(activeStepIndex(container), 1);
        assert.isTrue(findButtonWithText(container, "Back")?.classList.contains(Classes.DISABLED));
        fireEvent.click(findButtonWithText(container, "Back")!);
        assert.strictEqual(activeStepIndex(container), 1);
    });
});
