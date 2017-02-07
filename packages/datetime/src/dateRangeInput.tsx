/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import {
    AbstractComponent,
    Classes,
    IInputGroupProps,
    InputGroup,
    IProps,
} from "@blueprintjs/core";

import {
    IDatePickerBaseProps,
} from "./datePickerCore";

export interface IDateRangeInputProps extends IDatePickerBaseProps, IProps {
    startInputProps?: IInputGroupProps;
    endInputProps?: IInputGroupProps;
}

export class DateRangeInput extends AbstractComponent<IDateRangeInputProps, {}> {
    public static defaultProps: IDateRangeInputProps = {};

    public displayName = "Blueprint.DateRangeInput";

    private startDateInputRef: HTMLInputElement = null;
    private endDateInputRef: HTMLInputElement = null;

    public render() {
        // allow custom props for each input group, but pass them in an order
        // that guarantees only some props are overridable.
        return (
            <div className={Classes.CONTROL_GROUP}>
                <InputGroup
                    placeholder="Start date"
                    {...this.props.startInputProps}
                    inputRef={this.setStartDateInputRef}
                />
                <InputGroup
                    placeholder="End date"
                    {...this.props.endInputProps}
                    inputRef={this.setEndDateInputRef}
                />
            </div>
        );
    }

    private setStartDateInputRef = (el: HTMLInputElement) => {
        this.startDateInputRef = el;
    }

    private setEndDateInputRef = (el: HTMLInputElement) => {
        this.endDateInputRef = el;
    }
}
