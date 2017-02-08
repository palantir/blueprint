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
    startInputProps?: IInputGroupProps;
    endInputProps?: IInputGroupProps;
}

export interface IDateRangeInputState {
    isOpen?: boolean;
    selectedEnd?: moment.Moment;
    selectedStart?: moment.Moment;
};

export class DateRangeInput extends AbstractComponent<IDateRangeInputProps, IDateRangeInputState> {
    public static defaultProps: IDateRangeInputProps = {
        endInputProps: {},
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
        this.state = {
            isOpen: false,
            selectedEnd: moment(null),
            selectedStart: moment(null),
        };
    }

    public render() {
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
                useSmartArrowPositioning={false}
            >
                <div className={Classes.CONTROL_GROUP}>
                    <InputGroup
                        placeholder="Start date"
                        {...this.props.startInputProps}
                        inputRef={this.refHandlers.startInputRef}
                        onClick={this.handleInputClick}
                        onFocus={this.handleInputFocus}
                    />
                    <InputGroup
                        placeholder="End date"
                        {...this.props.endInputProps}
                        inputRef={this.refHandlers.endInputRef}
                        onClick={this.handleInputClick}
                        onFocus={this.handleInputFocus}
                    />
                </div>
            </Popover>
        );
    }

    private handleDateRangePickerChange = (selectedRange: DateRange) => {
        const [selectedStart, selectedEnd] = selectedRange.map(this.fromDateToMoment);
        this.setState({ selectedStart, selectedEnd });
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

    private getSelectedRange = () => {
        return [this.state.selectedStart, this.state.selectedEnd].map((selectedBound?: moment.Moment) => {
            return (!this.isDateValidAndInRange(selectedBound))
                ? undefined
                : this.fromMomentToDate(selectedBound);
        }) as DateRange;
    }

    private isDateValidAndInRange(value: moment.Moment) {
        return value.isValid() && this.dateIsInRange(value);
    }

    private dateIsInRange(value: moment.Moment) {
        return value.isBetween(this.props.minDate, this.props.maxDate, "day", "[]");
    }

    /**
     * Translate a Date object into a moment, adjusting the local timezone into the moment one.
     * This is a no-op unless moment-timezone's setDefault has been called.
     */
    private fromDateToMoment = (date: Date) => {
        if (date == null || typeof date === "string") {
            return moment(date);
        } else {
            return moment([
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds(),
            ]);
        }
    }

    /**
     * Translate a moment into a Date object, adjusting the moment timezone into the local one.
     * This is a no-op unless moment-timezone's setDefault has been called.
     */
    private fromMomentToDate = (momentDate: moment.Moment) => {
        if (momentDate == null) {
            return undefined;
        } else {
            return new Date(
                momentDate.year(),
                momentDate.month(),
                momentDate.date(),
                momentDate.hours(),
                momentDate.minutes(),
                momentDate.seconds(),
                momentDate.milliseconds(),
            );
        }
    }
}
