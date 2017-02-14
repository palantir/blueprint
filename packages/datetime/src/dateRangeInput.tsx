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

    /**
     * The default date range to be used in the component when uncontrolled.
     * This should not be set if `value` is set.
     */
    defaultValue?: DateRange;

    /**
     * Props to pass to the end-date input.
     */
    endInputProps?: IInputGroupProps;

    /**
     * The format of each date in the date range. See options
     * here: http://momentjs.com/docs/#/displaying/format/
     * @default "MM/DD/YYYY"
     */
    format?: string;

    /**
     * Called when the user selects a day.
     * If no days are selected, it will pass `[null, null]`.
     * If a start date is selected but not an end date, it will pass `[selectedDate, null]`.
     * If both a start and end date are selected, it will pass `[startDate, endDate]`.
     */
    onChange?: (selectedRange: DateRange) => void;

    /**
     * Props to pass to the start-date input.
     */
    startInputProps?: IInputGroupProps;

    /**
     * The currently selected date range. If this prop is present, the component acts in a controlled manner.
     * To display no date range in the input fields, pass `null` to the value prop. To display an invalid date error
     * in either input field, pass `new Date(undefined)` for the appropriate date in the value prop.
     */
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

    public componentWillReceiveProps(nextProps: IDateRangeInputProps) {
        if (nextProps.value !== this.props.value) {
            const [selectedStart, selectedEnd] = this.getInitialRange(nextProps);
            this.setState({ selectedStart, selectedEnd });
        }
        super.componentWillReceiveProps(nextProps);
    }

    private handleDateRangePickerChange = (selectedRange: DateRange) => {
        if (this.props.value === undefined) {
            const [selectedStart, selectedEnd] = selectedRange.map(fromDateToMoment);
            this.setState({ selectedStart, selectedEnd });
        }
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

    private getInitialRange = (props = this.props): moment.Moment[] => {
        const { defaultValue, value } = props;

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
