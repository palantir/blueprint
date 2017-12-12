/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { Button, Classes, Intent, ITagProps, Switch, TagInput } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

const INTENTS = [Intent.NONE, Intent.PRIMARY, Intent.SUCCESS, Intent.DANGER, Intent.WARNING];

const VALUES = [
    // supports single JSX elements
    <strong>Albert</strong>,
    // supports JSX "fragments" (don't forget `key` on elements in arrays!)
    ["Bar", <em key="thol">thol</em>, "omew"],
    // and supports simple strings
    "Casper",
    // falsy values are not rendered and ignored by the keyboard
    undefined,
];

export interface ITagInputExampleState {
    disabled?: boolean;
    fill?: boolean;
    intent?: boolean;
    large?: boolean;
    minimal?: boolean;
    values?: React.ReactNode[];
}

export class TagInputExample extends BaseExample<ITagInputExampleState> {
    public state: ITagInputExampleState = {
        disabled: false,
        fill: false,
        intent: false,
        large: false,
        minimal: false,
        values: VALUES,
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));
    private handleIntentChange = handleBooleanChange(intent => this.setState({ intent }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));

    protected renderExample() {
        const { disabled, fill, large, values } = this.state;

        const classes = classNames({
            [Classes.FILL]: fill,
            [Classes.LARGE]: large,
        });

        const clearButton = (
            <Button
                className={classNames(Classes.MINIMAL, Classes.SMALL)}
                disabled={disabled}
                iconName={values.length > 1 ? "cross" : "refresh"}
                onClick={this.handleClear}
            />
        );

        // define a new function every time so switch changes will cause it to re-render
        // NOTE: avoid this pattern in your app (use this.getTagProps instead); this is only for
        // example purposes!!
        const getTagProps = (_v: string, index: number): ITagProps => ({
            className: this.state.minimal ? Classes.MINIMAL : "",
            intent: this.state.intent ? INTENTS[index % INTENTS.length] : Intent.NONE,
        });

        return (
            <TagInput
                className={classes}
                disabled={disabled}
                rightElement={clearButton}
                leftIconName="user"
                onChange={this.handleChange}
                placeholder="Separate values with commas..."
                tagProps={getTagProps}
                values={values}
            />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.fill}
                    label="Fill container width"
                    key="fill"
                    onChange={this.handleFillChange}
                />,
                <Switch checked={this.state.large} label="Large" key="large" onChange={this.handleLargeChange} />,
                <Switch
                    checked={this.state.disabled}
                    label="Disabled"
                    key="disabled"
                    onChange={this.handleDisabledChange}
                />,
            ],
            [
                <label key="heading" className={Classes.LABEL}>
                    Tag props
                </label>,
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

    private handleChange = (values: React.ReactNode[]) => this.setState({ values });

    private handleClear = () => this.handleChange(this.state.values.length > 0 ? [] : VALUES);
}
