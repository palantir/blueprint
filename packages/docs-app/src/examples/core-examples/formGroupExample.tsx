/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
    Card,
    Classes,
    Code,
    Divider,
    FormGroup,
    H5,
    Icon,
    InputGroup,
    Intent,
    Switch,
    Tooltip,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

export const FormGroupExample: React.FC<ExampleProps> = props => {
    const [disabled, setDisabled] = React.useState(false);
    const [helperText, setHelperText] = React.useState(false);
    const [fill, setFill] = React.useState(false);
    const [inline, setInline] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent>(Intent.NONE);
    const [label, setLabel] = React.useState(true);
    const [requiredLabel, setRequiredLabel] = React.useState(true);
    const [subLabel, setSubLabel] = React.useState(false);

    const intentLabelInfo = (
        <Tooltip
            content={
                <span className={Classes.TEXT_SMALL}>
                    Applies to helper text and sub label automatically, <br />
                    but other child elements will need their own <br />
                    <Code>intent</Code> applied independently.
                </span>
            }
            placement="top"
            minimal={true}
        >
            <span>
                Intent{" "}
                <span style={{ lineHeight: "16px", padding: 2, verticalAlign: "top" }}>
                    <Icon className={Classes.TEXT_MUTED} icon="info-sign" size={12} />
                </span>
            </span>
        </Tooltip>
    );

    const options = (
        <>
            <H5>Props</H5>
            <Switch label="Disabled" checked={disabled} onChange={handleBooleanChange(setDisabled)} />
            <Switch label="Fill" checked={fill} onChange={handleBooleanChange(setFill)} />
            <Switch label="Inline" checked={inline} onChange={handleBooleanChange(setInline)} />
            <Switch label="Show helper text" checked={helperText} onChange={handleBooleanChange(setHelperText)} />
            <Switch label="Show label" checked={label} onChange={handleBooleanChange(setLabel)} />
            <Switch label="Show label info" checked={requiredLabel} onChange={handleBooleanChange(setRequiredLabel)} />
            <Switch label="Show sub label" checked={subLabel} onChange={handleBooleanChange(setSubLabel)} />
            <Divider />
            <IntentSelect intent={intent} label={intentLabelInfo} onChange={setIntent} showClearButton={true} />
        </>
    );

    return (
        <Example options={options} {...props}>
            <Card style={{ width: fill ? "100%" : undefined }}>
                <FormGroup
                    {...{ disabled, fill, inline, intent }}
                    helperText={helperText && "Helper text with details..."}
                    label={label && "Label"}
                    labelFor="text-input"
                    labelInfo={requiredLabel && "(required)"}
                    subLabel={subLabel && "Label helper text with details..."}
                >
                    <InputGroup id="text-input" placeholder="Placeholder text" disabled={disabled} intent={intent} />
                </FormGroup>
                <FormGroup
                    {...{ disabled, fill, inline, intent }}
                    helperText={helperText && "Helper text with details..."}
                    label={label && "Label"}
                    labelInfo={requiredLabel && "(required)"}
                >
                    <Switch label="Engage the hyperdrive" disabled={disabled} />
                    <Switch label="Initiate thrusters" disabled={disabled} />
                </FormGroup>
            </Card>
        </Example>
    );
};
