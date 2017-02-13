/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as moment from "moment";
import * as React from "react";

import {
    AbstractComponent,
    Classes,
    IInputGroupProps,
    InputGroup,
    IProps,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";

import {
    DateRange,
    fromDateRangeToMomentArray,
    fromDateToMoment,
    fromMomentToDate,
    isMomentNull,
    isMomentValidAndInRange,
} from "./common/dateUtils";
import {
    getDefaultMaxDate,
    getDefaultMinDate,
    IDatePickerBaseProps,
} from "./datePickerCore";
import {
    DateRangePicker,
} from "./dateRangePicker";

export interface IDateRangeInputProps extends IDatePickerBaseProps, IProps {
    defaultValue?: DateRange;
    endInputProps?: IInputGroupProps;
    format?: string;
    onChange?: (selectedRange: DateRange) => void;
    startInputProps?: IInputGroupProps;
    value?: DateRange;
}

export interface IDateRangeInputState {
    isOpen?: boolean;
    selectedEnd?: moment.Moment;
    selectedStart?: moment.Moment;
};

export class DateRangeInput extends AbstractComponent<IDateRangeInputProps, IDateRangeInputState> {
    public static defaultProps: IDateRangeInputProps = {
        endInputProps: {},
        format: "YYYY-MM-DD",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
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

    public constructor(props: IDateRangeInputProps, context?: any) {
        super(props, context);

        const [selectedStart, selectedEnd] = this.getInitialRange();

        this.state = {
            isOpen: false,
            selectedEnd,
            selectedStart,
        };
    }

    public render() {
        const startInputString = this.getFormattedDateString(this.state.selectedStart);
        const endInputString = this.getFormattedDateString(this.state.selectedEnd);

        const popoverContent = (
            <DateRangePicker
                onChange={this.handleDateRangePickerChange}
                maxDate={this.props.maxDate}
                minDate={this.props.minDate}
                value={this.getSelectedRange()}
            />
        );

        // allow custom props for each input group, but pass them in an order
        // that guarantees only some props are overridable.
        return (
            <Popover
                autoFocus={false}
                content={popoverContent}
                enforceFocus={false}
                inline={true}
                isOpen={this.state.isOpen}
                onClose={this.handlePopoverClose}
                position={Position.TOP_LEFT}
            >
                <div className={Classes.CONTROL_GROUP}>
                    <InputGroup
                        placeholder="Start date"
                        {...this.props.startInputProps}
                        inputRef={this.refHandlers.startInputRef}
                        onClick={this.handleInputClick}
                        onFocus={this.handleInputFocus}
                        value={startInputString}
                    />
                    <InputGroup
                        placeholder="End date"
                        {...this.props.endInputProps}
                        inputRef={this.refHandlers.endInputRef}
                        onClick={this.handleInputClick}
                        onFocus={this.handleInputFocus}
                        value={endInputString}
                    />
                </div>
            </Popover>
        );
    }

    private handleDateRangePickerChange = (selectedRange: DateRange) => {
        const [selectedStart, selectedEnd] = selectedRange.map(fromDateToMoment);
        this.setState({ selectedStart, selectedEnd });
        Utils.safeInvoke(this.props.onChange, selectedRange);
    }

    private handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        // unless we stop propagation on this event, a click within an input
        // will close the popover almost as soon as it opens.
        e.stopPropagation();
    }

    private handleInputFocus = () => {
        this.setState({ isOpen: true });
    }

    private handlePopoverClose = () => {
        this.setState({ isOpen: false });
    }

    private getInitialRange = (): moment.Moment[] => {
        const { defaultValue, value } = this.props;

        let initialStart: moment.Moment;
        let initialEnd: moment.Moment;

        if (value != null) {
            [initialStart, initialEnd] = fromDateRangeToMomentArray(value);
        } else if (defaultValue != null) {
            [initialStart, initialEnd] = fromDateRangeToMomentArray(defaultValue);
        } else {
            [initialStart, initialEnd] = [moment(null), moment(null)];
        }

        return [initialStart, initialEnd];
    }

    private getSelectedRange = () => {
        return [this.state.selectedStart, this.state.selectedEnd].map((selectedBound?: moment.Moment) => {
            return (!isMomentValidAndInRange(selectedBound, this.props.minDate, this.props.maxDate))
                ? undefined
                : fromMomentToDate(selectedBound);
        }) as DateRange;
    }

    private getFormattedDateString = (momentDate: moment.Moment) => {
        if (isMomentNull(momentDate)) {
            return "";
        } else {
            return momentDate.format(this.props.format);
        }
    }
}
