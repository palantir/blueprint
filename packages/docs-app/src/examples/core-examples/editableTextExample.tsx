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

import { Classes, EditableText, FormGroup, H1, H5, type Intent, NumericInput, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

const INPUT_ID = "EditableTextExample-max-length";

export const EditableTextExample: React.FC<ExampleProps> = props => {
    const [alwaysRenderInput, setAlwaysRenderInput] = React.useState(false);
    const [confirmOnEnterKey, setConfirmOnEnterKey] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent | undefined>(undefined);
    const [maxLength, setMaxLength] = React.useState<number | undefined>(undefined);
    const [report, setReport] = React.useState("");
    const [selectAllOnFocus, setSelectAllOnFocus] = React.useState(false);

    const handleMaxLengthChange = React.useCallback(
        (value: number) => {
            if (maxLength === 0) {
                setMaxLength(undefined);
            } else {
                setMaxLength(value);
                setReport(report.slice(0, value));
            }
        },
        [maxLength, report],
    );

    const handleReportChange = React.useCallback((value: string) => setReport(value), []);

    const options = (
        <>
            <H5>Props</H5>
            <IntentSelect intent={intent} onChange={setIntent} />
            <FormGroup label="Max length" labelFor={INPUT_ID}>
                <NumericInput
                    className={Classes.FORM_CONTENT}
                    fill={true}
                    id={INPUT_ID}
                    max={300}
                    min={0}
                    onValueChange={handleMaxLengthChange}
                    placeholder="Unlimited"
                    value={maxLength || ""}
                />
            </FormGroup>
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch
                checked={selectAllOnFocus}
                label="Select all on focus"
                onChange={handleBooleanChange(setSelectAllOnFocus)}
            />
            <Switch checked={confirmOnEnterKey} onChange={handleBooleanChange(setConfirmOnEnterKey)}>
                Swap keypress for confirm and newline (multiline only)
            </Switch>
            <Switch
                checked={alwaysRenderInput}
                label="Always render input"
                onChange={handleBooleanChange(setAlwaysRenderInput)}
            />
        </>
    );

    return (
        <Example options={options} {...props}>
            <H1>
                <EditableText
                    alwaysRenderInput={alwaysRenderInput}
                    disabled={disabled}
                    intent={intent}
                    maxLength={maxLength}
                    placeholder="Edit title..."
                    selectAllOnFocus={selectAllOnFocus}
                />
            </H1>
            <EditableText
                alwaysRenderInput={alwaysRenderInput}
                confirmOnEnterKey={confirmOnEnterKey}
                disabled={disabled}
                intent={intent}
                maxLength={maxLength}
                maxLines={12}
                minLines={3}
                multiline={true}
                onChange={handleReportChange}
                placeholder="Edit report... (controlled, multiline)"
                selectAllOnFocus={selectAllOnFocus}
                value={report}
            />
        </Example>
    );
};
