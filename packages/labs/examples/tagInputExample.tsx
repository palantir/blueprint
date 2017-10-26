/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as classNames from "classnames";
import * as React from "react";

import { Button, Classes, Intent, ITagProps, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";
import { TagInput } from "../src";

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
    fill?: boolean;
    intent?: boolean;
    large?: boolean;
    minimal?: boolean;
    values?: React.ReactNode[];
}

export class TagInputExample extends BaseExample<ITagInputExampleState> {
    public state: ITagInputExampleState = {
        fill: false,
        intent: false,
        large: false,
        minimal: false,
        values: VALUES,
    };

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));
    private handleIntentChange = handleBooleanChange(intent => this.setState({ intent }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));

    protected renderExample() {
        const { fill, large, values } = this.state;

        const classes = classNames({
            [Classes.FILL]: fill,
            [Classes.LARGE]: large,
        });

        const clearButton = (
            <Button
                className={classNames(Classes.MINIMAL, Classes.SMALL)}
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
