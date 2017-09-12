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

import { ITimezone, TimezoneInput } from "../src";

export interface ITimezoneInputExampleState {
    timezone?: ITimezone;
}

export class TimezoneInputExample extends BaseExample<ITimezoneInputExampleState> {
    public state: ITimezoneInputExampleState = {};

    protected renderExample() {
        const { timezone } = this.state;
        return (
            <div>
                <TimezoneInput
                    onTimezoneSelect={this.handleTimezoneSelect}
                />

                <Tag className={classNames(Classes.MINIMAL, Classes.LARGE)} style={{ marginLeft: 10 }}>
                    <Icon iconName="time" /> {timezone ? timezone.name : "No timezone selected"}
                </Tag>
            </div>
        );
    }

    private handleTimezoneSelect = (timezone: ITimezone) => {
        this.setState({ timezone });
    }
}
