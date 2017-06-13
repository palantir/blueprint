/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Classes, Intent, ITagProps, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";
import { TagInput } from "../src/tagInput";

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

export interface ITagInputExampleState {
    intent?: boolean;
    large?: boolean;
    minimal?: boolean;
    values?: string[];
}

export class TagInputExample extends BaseExample<ITagInputExampleState> {
    public state: ITagInputExampleState = {
        intent: false,
        large: false,
        minimal: false,
        values: ["Gilad", "Antoine", "Chris"],
    };

    private handleIntentChange = handleBooleanChange((intent) => this.setState({ intent }));
    private handleLargeChange = handleBooleanChange((large) => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange((minimal) => this.setState({ minimal }));

    protected renderExample() {
        const { large, values } = this.state;

        // define a new function every time so switch changes will cause it to re-render
        // NOTE: avoid this pattern in your app (use this.getTagProps instead); this is only for
        // example purposes!!
        const getTagProps = (_v: string, index: number): ITagProps => ({
            className: this.state.minimal ? Classes.MINIMAL : "",
            intent: this.state.intent ? INTENTS[index % INTENTS.length] : Intent.NONE,
        });

        return (
            <TagInput
                className={large ? Classes.LARGE : ""}
                onAdd={this.handleAdd}
                onRemove={this.handleRemove}
                tagProps={getTagProps}
                values={values}
            />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.large}
                    label="Large"
                    key="large"
                    onChange={this.handleLargeChange}
                />,
            ], [
                <label key="heading" className={Classes.LABEL}>Tag props</label>,
                <Switch
                    checked={this.state.minimal}
                    label="Use minimal tags"
                    key="minimal"
                    onChange={this.handleMinimalChange}
                />,
                <Switch
                    checked={this.state.intent}
                    label="Cycle through intents"
                    key="intent"
                    onChange={this.handleIntentChange}
                />,
            ],
        ];
    }

    private handleAdd = (newValue: string) => {
        this.setState({ values: [...this.state.values, newValue] });
    }
    private handleRemove = (_removedValue: string, removedIndex: number) => {
        this.setState({ values: this.state.values.filter((_, i) => i !== removedIndex) });
    }
}
