/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, EditableText, Intent, NumericInput, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange } from "@blueprintjs/docs";
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

    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));
    private toggleSelectAll = handleBooleanChange((selectAllOnFocus) => this.setState({ selectAllOnFocus }));
    private toggleSwap = handleBooleanChange((confirmOnEnterKey) => this.setState({ confirmOnEnterKey }));

    protected renderExample() {
        return <div className="docs-editable-text-example">
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
                multiline
                placeholder="Edit report... (controlled)"
                selectAllOnFocus={this.state.selectAllOnFocus}
                confirmOnEnterKey={this.state.confirmOnEnterKey}
                value={this.state.report}
                onChange={this.handleReportChange}
            />
        </div>;
    }

    protected renderOptions() {
        return [
            [
                <IntentSelect intent={this.state.intent} key="intent" onChange={this.handleIntentChange} />,
                <div className={Classes.FORM_GROUP} key="maxlength">
                    <label className={Classes.LABEL} htmlFor={INPUT_ID}>Max length</label>
                    <NumericInput
                        id={INPUT_ID}
                        className={classNames(Classes.FORM_CONTENT, Classes.FILL)}
                        min={0}
                        max={300}
                        onValueChange={this.handleMaxLengthChange}
                        placeholder="Unlimited"
                        value={this.state.maxLength || ""}
                    />
                </div>,
            ], [
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    key="focus"
                    onChange={this.toggleSelectAll}
                />,
                <Switch
                    checked={this.state.confirmOnEnterKey}
                    label="Swap keypress for confirm and newline (multiline only)"
                    key="swap"
                    onChange={this.toggleSwap}
                />,
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
    }
}
