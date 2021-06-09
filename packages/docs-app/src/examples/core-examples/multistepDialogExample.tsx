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

import classNames from "classnames";
import React from "react";

import {
    Button,
    Code,
    H5,
    MultistepDialog,
    DialogStep,
    Switch,
    Classes,
    ButtonProps,
    RadioGroup,
    Radio,
    NumericInput,
    Label,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, ExampleProps } from "@blueprintjs/docs-theme";

import { BlueprintExampleData } from "../../tags/types";

export interface MultistepDialogExampleState {
    autoFocus: boolean;
    canEscapeKeyClose: boolean;
    canOutsideClickClose: boolean;
    enforceFocus: boolean;
    isOpen: boolean;
    usePortal: boolean;
    value?: string;
    initialStepIndex: number;
}

export class MultistepDialogExample extends React.PureComponent<
    ExampleProps<BlueprintExampleData>,
    MultistepDialogExampleState
> {
    public state: MultistepDialogExampleState = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        initialStepIndex: 0,
        isOpen: false,
        usePortal: true,
    };

    private handleAutoFocusChange = handleBooleanChange(autoFocus => this.setState({ autoFocus }));

    private handleEnforceFocusChange = handleBooleanChange(enforceFocus => this.setState({ enforceFocus }));

    private handleEscapeKeyChange = handleBooleanChange(canEscapeKeyClose => this.setState({ canEscapeKeyClose }));

    private handleUsePortalChange = handleBooleanChange(usePortal => this.setState({ usePortal }));

    private handleOutsideClickChange = handleBooleanChange(val => this.setState({ canOutsideClickClose: val }));

    public render() {
        const finalButtonProps: Partial<ButtonProps> = {
            intent: "primary",
            onClick: this.handleClose,
            text: "Close",
        };
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Button onClick={this.handleOpen}>Show dialog</Button>
                <MultistepDialog
                    className={this.props.data.themeName}
                    icon="info-sign"
                    onClose={this.handleClose}
                    nextButtonProps={{ disabled: this.state.value === undefined }}
                    finalButtonProps={finalButtonProps}
                    title="Multistep dialog"
                    {...this.state}
                >
                    <DialogStep
                        id="select"
                        panel={<SelectPanel onChange={this.handleSelectionChange} selectedValue={this.state.value} />}
                        title="Select"
                    />
                    <DialogStep
                        id="confirm"
                        panel={<ConfirmPanel selectedValue={this.state.value} />}
                        title="Confirm"
                    />
                </MultistepDialog>
            </Example>
        );
    }

    private renderOptions() {
        const {
            autoFocus,
            enforceFocus,
            canEscapeKeyClose,
            canOutsideClickClose,
            usePortal,
            initialStepIndex,
        } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch checked={autoFocus} label="Auto focus" onChange={this.handleAutoFocusChange} />
                <Switch checked={enforceFocus} label="Enforce focus" onChange={this.handleEnforceFocusChange} />
                <Switch checked={usePortal} onChange={this.handleUsePortalChange}>
                    Use <Code>Portal</Code>
                </Switch>
                <Switch
                    checked={canOutsideClickClose}
                    label="Click outside to close"
                    onChange={this.handleOutsideClickChange}
                />
                <Switch checked={canEscapeKeyClose} label="Escape key to close" onChange={this.handleEscapeKeyChange} />
                <Label>Initial step index (0-indexed)</Label>
                <NumericInput
                    value={initialStepIndex}
                    onValueChange={this.handleInitialStepIndexChange}
                    max={2}
                    min={-1}
                />
            </>
        );
    }

    private handleOpen = () => this.setState({ isOpen: true, value: undefined });

    private handleClose = () => this.setState({ isOpen: false });

    private handleSelectionChange = handleStringChange(value => this.setState({ value }));

    private handleInitialStepIndexChange = (newValue: number) => this.setState({ initialStepIndex: newValue });
}

export interface SelectPanelProps {
    selectedValue: string;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const SelectPanel: React.FunctionComponent<SelectPanelProps> = props => (
    <div className={classNames(Classes.DIALOG_BODY, "docs-multistep-dialog-example-step")}>
        <p>Use this dialog to divide content into multiple sequential steps.</p>
        <p>Select one of the options below in order to proceed to the next step:</p>
        <RadioGroup onChange={props.onChange} selectedValue={props.selectedValue}>
            <Radio label="Option A" value="A" />
            <Radio label="Option B" value="B" />
            <Radio label="Option C" value="C" />
        </RadioGroup>
    </div>
);

export interface ConfirmPanelProps {
    selectedValue: string;
}

const ConfirmPanel: React.FunctionComponent<ConfirmPanelProps> = props => {
    return (
        <div className={classNames(Classes.DIALOG_BODY, "docs-multistep-dialog-example-step")}>
            <p>
                You selected <strong>Option {props.selectedValue}</strong>.
            </p>
            <p>
                To make changes, click the "Back" button or click on the "Select" step. Otherwise, click "Close" to
                complete your selection.
            </p>
        </div>
    );
};
