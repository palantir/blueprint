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
    Utils,
} from "@blueprintjs/core";

import {
    IDatePickerBaseProps,
} from "./datePickerCore";

export interface IDateRangeInputProps extends IDatePickerBaseProps, IProps {
    startInputProps?: IInputGroupProps;
    endInputProps?: IInputGroupProps;
}

export class DateRangeInput extends AbstractComponent<IDateRangeInputProps, {}> {
    public static defaultProps: IDateRangeInputProps = {
        endInputProps: {},
        startInputProps: {},
    };

    public displayName = "Blueprint.DateRangeInput";

    private startInputRef: HTMLInputElement;
    private endInputRef: HTMLInputElement;
    private refHandlers = {
        endInputRef: (ref: HTMLInputElement) => {
            this.endInputRef = ref;
            Utils.safeInvoke(this.props.endInputProps.inputRef, ref);
        },
        startInputRef: (ref: HTMLInputElement) => {
            this.startInputRef = ref;
            Utils.safeInvoke(this.props.startInputProps.inputRef, ref);
        },
    };

    public render() {
        // allow custom props for each input group, but pass them in an order
        // that guarantees only some props are overridable.
        return (
            <div className={Classes.CONTROL_GROUP}>
                <InputGroup
                    placeholder="Start date"
                    {...this.props.startInputProps}
                    inputRef={this.refHandlers.startInputRef}
                />
                <InputGroup
                    placeholder="End date"
                    {...this.props.endInputProps}
                    inputRef={this.refHandlers.endInputRef}
                />
            </div>
        );
    }
}
