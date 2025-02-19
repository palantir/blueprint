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

import * as React from "react";

import {
    Button,
    Code,
    DialogBody,
    DialogStep,
    type DialogStepButtonProps,
    Divider,
    FormGroup,
    H5,
    Intent,
    MultistepDialog,
    type MultistepDialogNavPosition,
    NumericInput,
    Radio,
    RadioGroup,
    SegmentedControl,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

import type { BlueprintExampleData } from "../../tags/types";

const NAV_POSITIONS = ["left", "top", "right"];

export const MultistepDialogExample: React.FC<ExampleProps<BlueprintExampleData>> = props => {
    const [autoFocus, setAutoFocus] = React.useState(true);
    const [canEscapeKeyClose, setCanEscapeKeyClose] = React.useState(true);
    const [canOutsideClickClose, setCanOutsideClickClose] = React.useState(true);
    const [enforceFocus, setEnforceFocus] = React.useState(true);
    const [hasTitle, setHasTitle] = React.useState(true);
    const [initialStepIndex, setInitialStepIndex] = React.useState(0);
    const [isCloseButtonShown, setIsCloseButtonShown] = React.useState(true);
    const [isOpen, setIsOpen] = React.useState(false);
    const [navPosition, setNavPosition] = React.useState<MultistepDialogNavPosition>("left");
    const [showCloseButtonInFooter, setShowCloseButtonInFooter] = React.useState(true);
    const [usePortal, setUsePortal] = React.useState(true);
    const [value, setValue] = React.useState<string>();

    const handleNavPositionChange = React.useCallback(
        (newNavPosition: string) => setNavPosition(newNavPosition as MultistepDialogNavPosition),
        [],
    );

    const handleOpen = React.useCallback(() => {
        setIsOpen(true);
        setValue(undefined);
    }, []);

    const handleClose = React.useCallback(() => setIsOpen(false), []);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={autoFocus} label="Auto focus" onChange={handleBooleanChange(setAutoFocus)} />
            <Switch checked={enforceFocus} label="Enforce focus" onChange={handleBooleanChange(setEnforceFocus)} />
            <Switch checked={usePortal} onChange={handleBooleanChange(setUsePortal)}>
                Use <Code>Portal</Code>
            </Switch>
            <Switch
                checked={canOutsideClickClose}
                label="Click outside to close"
                onChange={handleBooleanChange(setCanOutsideClickClose)}
            />
            <Switch checked={hasTitle} label="Has title" onChange={handleBooleanChange(setHasTitle)} />
            <Switch
                checked={isCloseButtonShown}
                label="Show close button"
                onChange={handleBooleanChange(setIsCloseButtonShown)}
            />
            <Switch
                checked={showCloseButtonInFooter}
                label="Show footer close button"
                onChange={handleBooleanChange(setShowCloseButtonInFooter)}
            />
            <Switch
                checked={canEscapeKeyClose}
                label="Escape key to close"
                onChange={handleBooleanChange(setCanEscapeKeyClose)}
            />
            <Divider />
            <FormGroup label="Navigation Position">
                <SegmentedControl
                    fill={true}
                    onValueChange={handleNavPositionChange}
                    options={NAV_POSITIONS.map(position => ({ value: position }))}
                    size="small"
                    value={navPosition}
                />
            </FormGroup>
            <FormGroup label="Initial step index (0-indexed)">
                <NumericInput onValueChange={setInitialStepIndex} max={2} min={-1} value={initialStepIndex} />
            </FormGroup>
        </>
    );

    const nextButtonProps: DialogStepButtonProps = {
        disabled: value === undefined,
        tooltipContent: value === undefined ? "Select an option to continue" : undefined,
    };

    const finalButtonProps: DialogStepButtonProps = {
        intent: Intent.PRIMARY,
        onClick: handleClose,
        text: "Close",
    };

    return (
        <Example options={options} {...props}>
            <Button onClick={handleOpen}>Show dialog</Button>
            <MultistepDialog
                autoFocus={autoFocus}
                canEscapeKeyClose={canEscapeKeyClose}
                canOutsideClickClose={canOutsideClickClose}
                className={props.data.themeName}
                enforceFocus={enforceFocus}
                finalButtonProps={finalButtonProps}
                icon={IconNames.INFO_SIGN}
                initialStepIndex={initialStepIndex}
                isCloseButtonShown={isCloseButtonShown}
                isOpen={isOpen}
                navigationPosition={navPosition}
                nextButtonProps={nextButtonProps}
                onClose={handleClose}
                showCloseButtonInFooter={showCloseButtonInFooter}
                title={hasTitle ? "Multistep dialog" : undefined}
                usePortal={usePortal}
            >
                <DialogStep
                    id="select"
                    panel={<SelectPanel onChange={handleStringChange(setValue)} selectedValue={value} />}
                    title="Select"
                />
                <DialogStep id="confirm" panel={<ConfirmPanel selectedValue={value} />} title="Confirm" />
            </MultistepDialog>
        </Example>
    );
};

interface SelectPanelProps {
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
    selectedValue: string;
}

const SelectPanel: React.FC<SelectPanelProps> = ({ onChange, selectedValue }) => (
    <DialogBody className="docs-multistep-dialog-example-step">
        <p>Use this dialog to divide content into multiple sequential steps.</p>
        <p>Select one of the options below in order to proceed to the next step:</p>
        <RadioGroup onChange={onChange} selectedValue={selectedValue}>
            <Radio label="Option A" value="A" />
            <Radio label="Option B" value="B" />
            <Radio label="Option C" value="C" />
        </RadioGroup>
    </DialogBody>
);

interface ConfirmPanelProps {
    selectedValue: string;
}

const ConfirmPanel: React.FC<ConfirmPanelProps> = ({ selectedValue }) => (
    <DialogBody className="docs-multistep-dialog-example-step">
        <p>
            You selected <strong>Option {selectedValue}</strong>.
        </p>
        <p>
            To make changes, click the "Back" button or click on the "Select" step. Otherwise, click "Close" to complete
            your selection.
        </p>
    </DialogBody>
);
