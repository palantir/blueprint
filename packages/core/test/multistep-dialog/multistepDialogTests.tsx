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

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { Classes, MultistepDialog, DialogStep } from "../../src";
import { MultistepDialogProps } from "../../src/components/dialog/multistepDialog";

const NEXT_BUTTON = "[text='Next']";
const BACK_BUTTON = "[text='Back']";
const SUBMIT_BUTTON = "[text='Submit']";

describe("<MultistepDialog>", () => {
    let wrapper: ReactWrapper<MultistepDialogProps, any, MultistepDialog>;
    let isMounted = false;
    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    /**
     * Mount the `content` into `testsContainerElement` and assign to local `wrapper` variable.
     * Use this method in this suite instead of Enzyme's `mount` method.
     */
    function mountWrapper(content: JSX.Element) {
        wrapper = mount(content, { attachTo: testsContainerElement });
        isMounted = true;
        return wrapper;
    }

    afterEach(() => {
        if (isMounted) {
            // clean up wrapper after each test, if it was used
            wrapper?.unmount();
            wrapper?.detach();
            isMounted = false;
        }
    });

    after(() => {
        document.documentElement.removeChild(testsContainerElement);
    });

    it("renders its content correctly", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
            </MultistepDialog>,
        );
        [
            Classes.DIALOG,
            Classes.MULTISTEP_DIALOG_PANELS,
            Classes.MULTISTEP_DIALOG_LEFT_PANEL,
            Classes.MULTISTEP_DIALOG_RIGHT_PANEL,
            Classes.MULTISTEP_DIALOG_FOOTER,
            Classes.DIALOG_STEP,
            Classes.DIALOG_STEP_CONTAINER,
            Classes.DIALOG_STEP_ICON,
            Classes.DIALOG_STEP_TITLE,
            Classes.DIALOG_FOOTER_ACTIONS,
        ].forEach(className => {
            assert.lengthOf(dialog.find(`.${className}`), 1, `missing ${className}`);
        });
    });

    it("initially selected step is first step", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        assert.strictEqual(dialog.state("selectedIndex"), 0);
        const steps = dialog.find(`.${Classes.DIALOG_STEP_CONTAINER}`);
        assert.strictEqual(steps.at(0).find(`.${Classes.ACTIVE}`).length, 1);
        assert.strictEqual(steps.at(1).find(`.${Classes.ACTIVE}`).length, 0);
    });

    it("clicking next should select the next element", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        const steps = dialog.find(`.${Classes.DIALOG_STEP_CONTAINER}`);
        assert.strictEqual(steps.at(0).find(`.${Classes.DIALOG_STEP_VIEWED}`).length, 1);
        assert.strictEqual(steps.at(1).find(`.${Classes.ACTIVE}`).length, 1);
    });

    it("clicking back should select the prev element", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );

        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        const steps = dialog.find(`.${Classes.DIALOG_STEP_CONTAINER}`);
        assert.strictEqual(steps.at(0).find(`.${Classes.DIALOG_STEP_VIEWED}`).length, 1);
        assert.strictEqual(steps.at(1).find(`.${Classes.ACTIVE}`).length, 1);

        dialog.find(BACK_BUTTON).simulate("click");
        const newSteps = dialog.find(`.${Classes.DIALOG_STEP_CONTAINER}`);
        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(newSteps.at(0).find(`.${Classes.ACTIVE}`).length, 1);
        assert.strictEqual(newSteps.at(1).find(`.${Classes.DIALOG_STEP_VIEWED}`).length, 1);
    });

    it("footer on last step of multiple steps should contain back and submit buttons", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        assert.strictEqual(dialog.find(BACK_BUTTON).length, 1);
        assert.strictEqual(dialog.find(NEXT_BUTTON).length, 0);
        assert.strictEqual(dialog.find(SUBMIT_BUTTON).length, 1);
    });

    it("footer on first step of multiple steps should contain next button only", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );

        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(dialog.find(BACK_BUTTON).length, 0);
        assert.strictEqual(dialog.find(NEXT_BUTTON).length, 1);
        assert.strictEqual(dialog.find(SUBMIT_BUTTON).length, 0);
    });

    it("footer on first step of single step should contain submit button only", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
            </MultistepDialog>,
        );

        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(dialog.find(BACK_BUTTON).length, 0);
        assert.strictEqual(dialog.find(NEXT_BUTTON).length, 0);
        assert.strictEqual(dialog.find(SUBMIT_BUTTON).length, 1);
    });

    it("selecting older step should leave already viewed steps active", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        assert.strictEqual(dialog.state("selectedIndex"), 0);
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        const step = dialog.find(`.${Classes.DIALOG_STEP}`);
        step.at(0).simulate("click");
        const steps = dialog.find(`.${Classes.DIALOG_STEP_CONTAINER}`);
        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(steps.at(0).find(`.${Classes.ACTIVE}`).length, 1);
        assert.strictEqual(steps.at(1).find(`.${Classes.DIALOG_STEP_VIEWED}`).length, 1);
    });

    it("gets by without children", () => {
        assert.doesNotThrow(() => mountWrapper(<MultistepDialog isOpen={true} />));
    });

    it("supports non-existent children", () => {
        assert.doesNotThrow(() =>
            mountWrapper(
                <MultistepDialog>
                    {null}
                    <DialogStep id="one" panel={<Panel />} />
                    {undefined}
                    <DialogStep id="two" panel={<Panel />} />
                </MultistepDialog>,
            ),
        );
    });

    it("enables next by default", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        assert.strictEqual(dialog.find(NEXT_BUTTON).prop("disabled"), undefined);
    });

    it("disables next if disabled on nextButtonProps is set to true", () => {
        const dialog = mountWrapper(
            <MultistepDialog nextButtonProps={{ disabled: true }} isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} />
            </MultistepDialog>,
        );
        assert.strictEqual(dialog.find(NEXT_BUTTON).prop("disabled"), true);
    });

    it("disables next for second step when disabled on nextButtonProps is set to true", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} nextButtonProps={{ disabled: true }} />
                <DialogStep id="three" title="Step 3" panel={<Panel />} />
            </MultistepDialog>,
        );

        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(dialog.find(NEXT_BUTTON).prop("disabled"), undefined);
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        assert.strictEqual(dialog.find(NEXT_BUTTON).prop("disabled"), true);
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
    });

    it("disables back for second step when disabled on backButtonProps is set to true", () => {
        const dialog = mountWrapper(
            <MultistepDialog isOpen={true} usePortal={false}>
                <DialogStep id="one" title="Step 1" panel={<Panel />} />
                <DialogStep id="two" title="Step 2" panel={<Panel />} backButtonProps={{ disabled: true }} />
                <DialogStep id="three" title="Step 3" panel={<Panel />} />
            </MultistepDialog>,
        );

        assert.strictEqual(dialog.state("selectedIndex"), 0);
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        assert.strictEqual(dialog.find(BACK_BUTTON).prop("disabled"), true);
        dialog.find(BACK_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
    });
});

const Panel: React.FunctionComponent = () => <strong> panel</strong>;
