/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, EditableText, Intent, NumericInput, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

const INPUT_ID = "EditableTextExample-max-length";

export interface IEditableTextExampleState {
    confirmOnEnterKey?: boolean;
    intent?: Intent;
    maxLength?: number;
    report?: string;
    selectAllOnFocus?: boolean;
}

export class EditableTextExample extends BaseExample<IEditableTextExampleState> {
    public state: IEditableTextExampleState = {
        confirmOnEnterKey: false,
        report: "",
        selectAllOnFocus: false,
    };

    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));
    private toggleSelectAll = handleBooleanChange(selectAllOnFocus => this.setState({ selectAllOnFocus }));
    private toggleSwap = handleBooleanChange(confirmOnEnterKey => this.setState({ confirmOnEnterKey }));

    protected renderExample() {
        return (
            <div className="docs-editable-text-example">
                <h1>
                    <EditableText
                        intent={this.state.intent}
                        maxLength={this.state.maxLength}
                        placeholder="Edit title..."
                        selectAllOnFocus={this.state.selectAllOnFocus}
                    />
                </h1>
                <EditableText
                    intent={this.state.intent}
                    maxLength={this.state.maxLength}
                    maxLines={12}
                    minLines={3}
                    multiline={true}
                    placeholder="Edit report... (controlled, multiline)"
                    selectAllOnFocus={this.state.selectAllOnFocus}
                    confirmOnEnterKey={this.state.confirmOnEnterKey}
                    value={this.state.report}
                    onChange={this.handleReportChange}
                />
            </div>
        );
    }

    protected renderOptions() {
        return [
            [<IntentSelect intent={this.state.intent} key="intent" onChange={this.handleIntentChange} />],
            [
                <div className={Classes.FORM_GROUP} key="maxlength">
                    <label className={Classes.LABEL} htmlFor={INPUT_ID}>
                        Max length
                    </label>
                    <NumericInput
                        className={Classes.FORM_CONTENT}
                        fill={true}
                        id={INPUT_ID}
                        max={300}
                        min={0}
                        onValueChange={this.handleMaxLengthChange}
                        placeholder="Unlimited"
                        value={this.state.maxLength || ""}
                    />
                </div>,
            ],
            [
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    key="focus"
                    onChange={this.toggleSelectAll}
                />,
                <Switch checked={this.state.confirmOnEnterKey} key="swap" onChange={this.toggleSwap}>
                    Swap keypress for confirm and newline<br />(multiline only)
                </Switch>,
            ],
        ];
    }

    private handleReportChange = (report: string) => this.setState({ report });
    private handleMaxLengthChange = (maxLength: number) => {
        if (maxLength === 0) {
            this.setState({ maxLength: undefined });
        } else {
            const report = this.state.report.slice(0, maxLength);
            this.setState({ maxLength, report });
        }
    };
}
