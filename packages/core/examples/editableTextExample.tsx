/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Classes, EditableText, Intent, Switch } from "@blueprintjs/core";
import BaseExample, { handleBooleanChange, handleNumberChange, handleStringChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";

export interface IEditableTextExampleState {
    confirmOnEnterKey?: boolean;
    intent?: Intent;
    maxLength?: number;
    report?: string;
    selectAllOnFocus?: boolean;
    title?: string;
}

export class EditableTextExample extends BaseExample<IEditableTextExampleState> {
    public state: IEditableTextExampleState = {
        confirmOnEnterKey: false,
        report: "",
        selectAllOnFocus: false,
        title: "",
    };

    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));
    private handleMaxLengthChange = handleStringChange((maxLengthInput: string) => {
        const invalidMaxLength = (+maxLengthInput === 0 || isNaN(+maxLengthInput)) && (maxLengthInput.length !== 0);
        if (invalidMaxLength) {
            return;
        }

        if (maxLengthInput.length === 0) {
            this.setState({ maxLength: undefined });
        } else {
            const maxLength = +maxLengthInput;
            const report = this.state.report.slice(0, maxLength);
            const title = this.state.title.slice(0, maxLength);
            this.setState({ maxLength, report, title });
        }
    });
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
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                />
            </h1>
            <EditableText
                intent={this.state.intent}
                maxLength={this.state.maxLength}
                maxLines={12}
                minLines={3}
                multiline
                placeholder="Edit report..."
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
                <label className={Classes.LABEL} key="maxlength">
                    Max length
                    <input
                        className={Classes.INPUT}
                        placeholder="Unlimited"
                        onChange={this.handleMaxLengthChange}
                        value={this.state.maxLength !== undefined ? this.state.maxLength.toString() : ""}
                    />
                </label>,
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
    private handleTitleChange = (title: string) => this.setState({ title });

}
