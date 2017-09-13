/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, Icon, Tag } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

import { TimezoneFormat, TimezoneInput } from "../src";

export interface ITimezoneInputExampleState {
    date?: Date;
    timezone?: string;
    format?: TimezoneFormat;
}

export class TimezoneInputExample extends BaseExample<ITimezoneInputExampleState> {
    public state: ITimezoneInputExampleState = {
        date: new Date(),
        format: TimezoneFormat.OFFSET,
    };

    protected renderExample() {
        const { date, timezone, format } = this.state;

        return (
            <div>
                <TimezoneInput
                    date={date}
                    selectedTimezoneFormat={format}
                    onTimezoneSelect={this.handleTimezoneSelect}
                />

                <Tag className={classNames(Classes.MINIMAL, Classes.LARGE)} style={{ marginLeft: 10 }}>
                    <Icon iconName="time" /> {timezone || "No timezone selected"}
                </Tag>
            </div>
        );
    }

    protected renderOptions() {
        return [
            this.renderFormatSelect(),
        ];
    }

    private renderFormatSelect() {
        return (
            <label key="format-select" className={Classes.LABEL}>
                Selected timezone format
                <div className={Classes.SELECT}>
                    <select
                        value={this.state.format}
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

    private handleFormatChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const format = e.currentTarget.value as TimezoneFormat;
        this.setState({ format });
    }
}
