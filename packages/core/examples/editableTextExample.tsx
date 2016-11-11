/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import { EditableText, Intent, Switch } from "../src";
import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";

export interface IEditableTextExampleState {
    intent?: Intent;
    report?: string;
    selectAllOnFocus?: boolean;
    title?: string;
}

export class EditableTextExample extends BaseExample<IEditableTextExampleState> {
    public state: IEditableTextExampleState = {
        report: "",
        selectAllOnFocus: false,
        title: "",
    };

    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));
    private toggleSelectAll = handleBooleanChange((selectAllOnFocus) => this.setState({ selectAllOnFocus }));

    protected renderExample() {
        return <div className="docs-editable-text-example">
            <h1>
                <EditableText
                    intent={this.state.intent}
                    placeholder="Edit title..."
                    selectAllOnFocus={this.state.selectAllOnFocus}
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                />
            </h1>
            <EditableText
                intent={this.state.intent}
                maxLines={12}
                minLines={3}
                multiline
                placeholder="Edit report..."
                selectAllOnFocus={this.state.selectAllOnFocus}
                value={this.state.report}
                onChange={this.handleReportChange}
            />
        </div>;
    }

    protected renderOptions() {
        return [
            [
                <IntentSelect intent={this.state.intent} key="intent" onChange={this.handleIntentChange} />,
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    key="focus"
                    onChange={this.toggleSelectAll}
                />,
            ],
        ];
    }

    private handleReportChange = (report: string) => this.setState({ report });
    private handleTitleChange = (title: string) => this.setState({ title });

}
