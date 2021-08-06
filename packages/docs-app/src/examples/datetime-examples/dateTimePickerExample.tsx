/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { Classes, H5, Switch } from "@blueprintjs/core";
import { DateTimePicker } from "@blueprintjs/datetime";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

import { MomentDate } from "./common/momentDate";

export class DateTimePickerExample extends React.PureComponent<
    IExampleProps,
    { date: Date; showArrowButtons: boolean; useAmPm: boolean }
> {
    public state = {
        date: new Date(),
        showArrowButtons: false,
        useAmPm: true,
    };

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                {/* eslint-disable-next-line deprecation/deprecation */}
                <DateTimePicker
                    className={Classes.ELEVATION_1}
                    value={this.state.date}
                    timePickerProps={{
                        precision: "second",
                        showArrowButtons: this.state.showArrowButtons,
                        useAmPm: this.state.useAmPm,
                    }}
                    onChange={this.handleDateChange}
                />
                <div>
                    <MomentDate date={this.state.date} format="LLLL" />
                </div>
            </Example>
        );
    }

    private renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch checked={this.state.useAmPm} label="Use AM/PM" onChange={this.toggleUseAmPm} />
                <Switch
                    checked={this.state.showArrowButtons}
                    label="Show arrow buttons"
                    onChange={this.toggleShowArrowButtons}
                />
            </>
        );
    }

    private toggleUseAmPm = () => {
        this.setState({ useAmPm: !this.state.useAmPm });
    };

    private toggleShowArrowButtons = () => {
        this.setState({ showArrowButtons: !this.state.showArrowButtons });
    };

    private handleDateChange = (date: Date) => this.setState({ date });
}
