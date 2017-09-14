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

import { TimezoneDisplayFormat, TimezoneSelect } from "../src";

export interface ITimezoneSelectBasicExampleState {
    timezone?: string;
}

export class TimezoneSelectBasicExample extends BaseExample<ITimezoneSelectBasicExampleState> {
    public state: ITimezoneSelectBasicExampleState = {};

    protected renderExample() {
        const { timezone } = this.state;

        return (
            <div>
                <TimezoneSelect
                    value={timezone}
                    onChange={this.handleTimezoneChange}
                    targetDisplayFormat={TimezoneDisplayFormat.NAME}
                />

                <div style={{ marginTop: 20 }}>
                    <Tag
                        className={classNames(Classes.MINIMAL, Classes.LARGE)}
                        onRemove={this.reset}
                    >
                        <Icon iconName="time" />
                        <span style={{ marginLeft: 10 }}>{timezone || "Select a timezone"}</span>
                    </Tag>
                </div>
            </div>
        );
    }

    private handleTimezoneChange = (timezone: string) => {
        this.setState({ timezone });
    }

    private reset = () => {
        this.setState({ timezone: "" });
    }
}
