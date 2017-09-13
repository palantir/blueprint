/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, Icon, Switch, Tag } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs";

import { TimezoneFormat, TimezoneInput } from "../src";

export interface ITimezoneInputExampleState {
    date?: Date;
    timezone?: string;
    targetFormat?: TimezoneFormat;
    disabled?: boolean;
    showUserTimezoneGuess?: boolean;
    useDefault?: boolean;
}

export class TimezoneInputExample extends BaseExample<ITimezoneInputExampleState> {
    public state: ITimezoneInputExampleState = {
        date: new Date(),
        disabled: false,
        showUserTimezoneGuess: true,
        targetFormat: TimezoneFormat.OFFSET,
        useDefault: false,
    };

    private handleDisabledChange = handleBooleanChange((disabled) => this.setState({ disabled }));
    private handleShowUserTimezoneGuessChange = handleBooleanChange(
        (showUserTimezoneGuess) => this.setState({ showUserTimezoneGuess }));
    private handleUseDefaultChange = handleBooleanChange((useDefault) => this.setState({ useDefault }));
    private handleFormatChange = handleStringChange((targetFormat: TimezoneFormat) => this.setState({ targetFormat }));

    protected renderExample() {
        const { date, timezone, targetFormat, disabled, showUserTimezoneGuess, useDefault } = this.state;

        return (
            <div>
                <TimezoneInput
                    date={date}
                    onTimezoneSelect={this.handleTimezoneSelect}
                    targetFormat={targetFormat}
                    showUserTimezoneGuess={showUserTimezoneGuess}
                    disabled={disabled}
                    defaultTimezone={useDefault ? "Pacific/Honolulu" : undefined}
                />

                <Tag className={classNames(Classes.MINIMAL, Classes.LARGE)} style={{ marginLeft: 20 }}>
                    <Icon iconName="time" /> {timezone || "No timezone selected"}
                </Tag>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.disabled}
                    label="Disabled"
                    key="disabled"
                    onChange={this.handleDisabledChange}
                />,
                <Switch
                    checked={this.state.showUserTimezoneGuess}
                    label="Show user timezone guess"
                    key="show-user-timezone-guess"
                    onChange={this.handleShowUserTimezoneGuessChange}
                />,
                <Switch
                    checked={this.state.useDefault}
                    label="Use a default timezone"
                    key="use-default"
                    onChange={this.handleUseDefaultChange}
                />,
            ],
            [
                this.renderFormatSelect(),
            ],
        ];
    }

    private renderFormatSelect() {
        return (
            <label key="format-select" className={Classes.LABEL}>
                Target format
                <div className={Classes.SELECT}>
                    <select
                        value={this.state.targetFormat}
                        onChange={this.handleFormatChange}
                    >
                        <option value={TimezoneFormat.ABBREVIATION.toString()}>Abbreviation</option>
                        <option value={TimezoneFormat.NAME.toString()}>Name</option>
                        <option value={TimezoneFormat.OFFSET.toString()}>Offset</option>
                    </select>
                </div>
            </label>
        );
    }

    private handleTimezoneSelect = (timezone: string) => {
        this.setState({ timezone });
    }
}
