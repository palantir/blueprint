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
import { mount } from "enzyme";
import * as React from "react";

import { Classes, IMultistepDialogPanelProps, MultistepDialog, Step } from "../../src";

const NEXT_BUTTON = "[text='Next']";
const BACK_BUTTON = "[text='Back']";
const SUBMIT_BUTTON = "[text='Submit']";

describe("<MultistepDialog>", () => {
    it("renders its content correctly", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true} usePortal={false}>
                <Step id="one" title="Step 1" renderPanel={renderPanel} />
            </MultistepDialog>,
        );
        [
            Classes.DIALOG,
            Classes.MULTISTEP_DIALOG_PANELS,
            Classes.MULTISTEP_DIALOG_LEFT_PANEL,
            Classes.MULTISTEP_DIALOG_RIGHT_PANEL,
            Classes.MULTISTEP_DIALOG_FOOTER,
            Classes.STEP,
            Classes.STEP_CONTAINER,
            Classes.STEP_ICON,
            Classes.STEP_TITLE,
            Classes.DIALOG_FOOTER_ACTIONS,
        ].forEach(className => {
            assert.lengthOf(dialog.find(`.${className}`), 1, `missing ${className}`);
        });
        dialog.unmount();
    });

    it("initially selected step is first step", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderPanel} />
                <Step id="two" title="Step 2" renderPanel={renderPanel} />
            </MultistepDialog>,
        );
        assert.strictEqual(dialog.state("selectedIndex"), 0);
        const steps = dialog.find(`.${Classes.STEP_CONTAINER}`);
        assert.strictEqual(steps.at(0).find(`.${Classes.ACTIVE}`).length, 4);
        assert.strictEqual(steps.at(1).find(`.${Classes.ACTIVE}`).length, 0);
        dialog.unmount();
    });

    it("clicking next should select the next element", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderPanel} />
                <Step id="two" title="Step 2" renderPanel={renderPanel} />
            </MultistepDialog>,
        );
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        const steps = dialog.find(`.${Classes.STEP_CONTAINER}`);
        assert.strictEqual(steps.at(0).find(`.${Classes.ACTIVE}`).length, 3);
        assert.strictEqual(steps.at(1).find(`.${Classes.ACTIVE}`).length, 4);
        dialog.unmount();
    });

    it("clicking back should select the prev element", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderPanel} />
                <Step id="two" title="Step 2" renderPanel={renderPanel} />
            </MultistepDialog>,
        );

        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        const steps = dialog.find(`.${Classes.STEP_CONTAINER}`);
        assert.strictEqual(steps.at(0).find(`.${Classes.ACTIVE}`).length, 3);
        assert.strictEqual(steps.at(1).find(`.${Classes.ACTIVE}`).length, 4);

        dialog.find(BACK_BUTTON).simulate("click");
        const newSteps = dialog.find(`.${Classes.STEP_CONTAINER}`);
        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(newSteps.at(0).find(`.${Classes.ACTIVE}`).length, 4);
        assert.strictEqual(newSteps.at(1).find(`.${Classes.ACTIVE}`).length, 3);
        dialog.unmount();
    });

    it("footer on last step of multiple steps should contain back and submit buttons", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderPanel} />
                <Step id="two" title="Step 2" renderPanel={renderPanel} />
            </MultistepDialog>,
        );
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        assert.strictEqual(dialog.find(BACK_BUTTON).length, 1);
        assert.strictEqual(dialog.find(NEXT_BUTTON).length, 0);
        assert.strictEqual(dialog.find(SUBMIT_BUTTON).length, 1);
        dialog.unmount();
    });

    it("footer on first step of multiple steps should contain next button only", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderPanel} />
                <Step id="two" title="Step 2" renderPanel={renderPanel} />
            </MultistepDialog>,
        );

        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(dialog.find(BACK_BUTTON).length, 0);
        assert.strictEqual(dialog.find(NEXT_BUTTON).length, 1);
        assert.strictEqual(dialog.find(SUBMIT_BUTTON).length, 0);
        dialog.unmount();
    });

    it("footer on first step of single step should contain submit button only", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderPanel} />
            </MultistepDialog>,
        );

        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(dialog.find(BACK_BUTTON).length, 0);
        assert.strictEqual(dialog.find(NEXT_BUTTON).length, 0);
        assert.strictEqual(dialog.find(SUBMIT_BUTTON).length, 1);
        dialog.unmount();
    });

    it("selecting older step should leave already viewed steps active", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderPanel} />
                <Step id="two" title="Step 2" renderPanel={renderPanel} />
            </MultistepDialog>,
        );
        assert.strictEqual(dialog.state("selectedIndex"), 0);
        dialog.find(NEXT_BUTTON).simulate("click");
        assert.strictEqual(dialog.state("selectedIndex"), 1);
        const step = dialog.find(`.${Classes.STEP}`);
        step.at(0).simulate("click");
        const steps = dialog.find(`.${Classes.STEP_CONTAINER}`);
        assert.strictEqual(dialog.state("selectedIndex"), 0);
        assert.strictEqual(steps.at(0).find(`.${Classes.ACTIVE}`).length, 4);
        assert.strictEqual(steps.at(1).find(`.${Classes.ACTIVE}`).length, 3);
        dialog.unmount();
    });

    it("gets by without children", () => {
        assert.doesNotThrow(() => mount(<MultistepDialog isOpen={true} />));
    });

    it("supports non-existent children", () => {
        assert.doesNotThrow(() =>
            mount(
                <MultistepDialog>
                    {null}
                    <Step id="one" />
                    {undefined}
                    <Step id="two" />
                </MultistepDialog>,
            ),
        );
    });

    it("enables next if disableNext is called", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderEnableDialogPanel} />
                <Step id="two" title="Step 2" renderPanel={renderPanel} />
            </MultistepDialog>,
        );
        assert.strictEqual(dialog.find(NEXT_BUTTON).prop("disabled"), false);
        dialog.unmount();
    });

    it("disables next if disableNext is called", () => {
        const dialog = mount(
            <MultistepDialog isOpen={true}>
                <Step id="one" title="Step 1" renderPanel={renderDisableDialogPanel} />
                <Step id="two" title="Step 2" renderPanel={renderPanel} />
            </MultistepDialog>,
        );
        assert.strictEqual(dialog.find(NEXT_BUTTON).prop("disabled"), true);
        dialog.unmount();
    });

    const renderDisableDialogPanel = (props: IMultistepDialogPanelProps) => {
        return <DisableNext {...props} />;
    };

    const renderEnableDialogPanel = (props: IMultistepDialogPanelProps) => {
        return <EnableNext {...props} />;
    };
});

const renderPanel = (_props: IMultistepDialogPanelProps) => {
    return <div>panel</div>;
};

const EnableNext: React.FunctionComponent<IMultistepDialogPanelProps> = ({ updateDialog }) => {
    React.useEffect(() => {
        updateDialog({ enableNextButton: true });
    }, []);
    return <strong>panel</strong>;
};

const DisableNext: React.FunctionComponent<IMultistepDialogPanelProps> = ({ updateDialog }) => {
    React.useEffect(() => {
        updateDialog({ enableNextButton: false });
    }, []);
    return <strong>panel</strong>;
};
