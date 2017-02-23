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
    fromDateRangeToMomentDateRange,
    fromMomentDateRangeToDateRange,
    fromMomentToDate,
    isMomentNull,
    isMomentValidAndInRange,
    MomentDateRange,
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
     * This will be ignored if `value` is set.
     */
    defaultValue?: DateRange;

    /**
     * Props to pass to the end-date input.
     */
    endInputProps?: IInputGroupProps;

    /**
     * The format of each date in the date range. See options
     * here: http://momentjs.com/docs/#/displaying/format/
     * @default "YYYY-MM-DD"
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
     * The currently selected date range.
     * If this prop is present, the component acts in a controlled manner.
     * To display no date range in the input fields, pass `[null, null]` to the value prop.
     * To display an invalid date error in either input field, pass `new Date(undefined)`
     * for the appropriate date in the value prop.
     */
    value?: DateRange;
}

export interface IDateRangeInputState {
    isOpen?: boolean;

    isStartInputFocused?: boolean;
    isEndInputFocused?: boolean;

    startInputString?: string;
    endInputString?: string;

    selectedEnd?: moment.Moment;
    selectedStart?: moment.Moment;
};

interface IStateKeysAndValuesObject {
    keys: {
        inputString: "startInputString" | "endInputString";
        isInputFocused: "isStartInputFocused" | "isEndInputFocused";
        selectedValue: "selectedStart" | "selectedEnd";
    };
    values: {
        controlledValue?: moment.Moment,
        inputString?: string;
        isInputFocused?: string;
        selectedValue?: moment.Moment;
    };
};

enum DateRangeBoundary {
    START,
    END,
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
        const startInputString = this.getStartInputDisplayString();
        const endInputString = this.getEndInputDisplayString();

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
                        onBlur={this.handleStartInputBlur}
                        onChange={this.handleStartInputChange}
                        onClick={this.handleInputClick}
                        onFocus={this.handleStartInputFocus}
                        value={startInputString}
                    />
                    <InputGroup
                        placeholder="End date"
                        {...this.props.endInputProps}
                        inputRef={this.refHandlers.endInputRef}
                        onBlur={this.handleEndInputBlur}
                        onChange={this.handleEndInputChange}
                        onClick={this.handleInputClick}
                        onFocus={this.handleEndInputFocus}
                        value={endInputString}
                    />
                </div>
            </Popover>
        );
    }

    public componentWillReceiveProps(nextProps: IDateRangeInputProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.value !== this.props.value) {
            const [selectedStart, selectedEnd] = this.getInitialRange(nextProps);
            this.setState({ selectedStart, selectedEnd });
        }
    }

    // Callbacks - DateRangePicker
    // ===========================

    private handleDateRangePickerChange = (selectedRange: DateRange) => {
        if (this.props.value === undefined) {
            const [selectedStart, selectedEnd] = fromDateRangeToMomentDateRange(selectedRange);
            this.setState({ selectedStart, selectedEnd });
        }
        Utils.safeInvoke(this.props.onChange, selectedRange);
    }

    // Callbacks - Input
    // =================

    // Click

    private handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        // unless we stop propagation on this event, a click within an input
        // will close the popover almost as soon as it opens.
        e.stopPropagation();
    }

    // Focus

    private handleStartInputFocus = (e: React.FormEvent<HTMLInputElement>) => {
        this.handleInputFocus(e, DateRangeBoundary.START);
    }

    private handleEndInputFocus = (e: React.FormEvent<HTMLInputElement>) => {
        this.handleInputFocus(e, DateRangeBoundary.END);
    }

    private handleInputFocus = (_e: React.FormEvent<HTMLInputElement>, boundary: DateRangeBoundary) => {
        const { keys, values } = this.getStateKeysAndValuesForBoundary(boundary);
        const inputString = this.getFormattedDateString(values.selectedValue);

        this.setState({
            isOpen: true,
            [keys.inputString]: inputString,
            [keys.isInputFocused]: true,
        });
    }

    // Blur

    private handleStartInputBlur = (e: React.FormEvent<HTMLInputElement>) => {
        this.handleInputBlur(e, DateRangeBoundary.START);
    }

    private handleEndInputBlur = (e: React.FormEvent<HTMLInputElement>) => {
        this.handleInputBlur(e, DateRangeBoundary.END);
    }

    private handleInputBlur = (_e: React.FormEvent<HTMLInputElement>, boundary: DateRangeBoundary) => {
        const { keys, values } = this.getStateKeysAndValuesForBoundary(boundary);

        const maybeNextValue = this.dateStringToMoment(values.inputString);
        const isValueControlled = this.isControlled();

        if (values.inputString == null || values.inputString.length === 0) {
            if (isValueControlled) {
                this.setState({
                    [keys.isInputFocused]: false,
                    [keys.inputString]: this.getFormattedDateString(values.controlledValue),
                });
            } else {
                this.setState({
                    [keys.isInputFocused]: false,
                    [keys.selectedValue]: moment(null),
                    [keys.inputString]: null,
                });
            }
        } else if (!this.isMomentValidAndInRange(maybeNextValue)) {
            if (isValueControlled) {
                this.setState({ [keys.isInputFocused]: false });
            } else {
                this.setState({
                    [keys.isInputFocused]: false,
                    [keys.inputString]: null,
                    [keys.selectedValue]: maybeNextValue,
                });
            }

            // TODO:
            // - if date invalid, invoke onError with...?
            // - if date out of range, invoke onError with...?
            // - if end date invalid, invoke onError with...?
            // - else, invoke onChange with...?
        } else {
            this.setState({ [keys.isInputFocused]: false });
        }
    }

    // Change

    private handleStartInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.handleInputChange(e, DateRangeBoundary.START);
    }

    private handleEndInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.handleInputChange(e, DateRangeBoundary.END);
    }

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>, boundary: DateRangeBoundary) => {
        const inputString = (e.target as HTMLInputElement).value;

        const { keys } = this.getStateKeysAndValuesForBoundary(boundary);
        const maybeNextValue = this.dateStringToMoment(inputString);
        const isValueControlled = this.isControlled();

        if (inputString.length === 0) {
            // this case will be relevant when we start showing the hovered
            // range in the input fields. goal is to show an empty field for
            // clarity until the mouse moves over a different date.
            if (isValueControlled) {
                this.setState({ [keys.inputString]: "" });
            } else {
                this.setState({ [keys.inputString]: "", [keys.selectedValue]: moment(null) });
            }
            Utils.safeInvoke(this.props.onChange, [null, null] as DateRange);
        } else if (this.isMomentValidAndInRange(maybeNextValue)) {
            if (isValueControlled) {
                this.setState({ [keys.inputString]: inputString });
            } else {
                this.setState({ [keys.inputString]: inputString, [keys.selectedValue]: maybeNextValue });
            }

            const nextMomentDateRange: MomentDateRange = (boundary === DateRangeBoundary.START)
                ? [maybeNextValue, this.state.selectedEnd]
                : [this.state.selectedStart, maybeNextValue];

            Utils.safeInvoke(this.props.onChange, fromMomentDateRangeToDateRange(nextMomentDateRange));
        } else {
            this.setState({ [keys.inputString]: inputString });
        }
    }

    // Callbacks - Popover
    // ===================

    private handlePopoverClose = () => {
        this.setState({ isOpen: false });
    }

    // Helpers
    // =======

    private dateStringToMoment = (dateString: String) => {
        return moment(dateString, this.props.format);
    }

    private getInitialRange = (props = this.props) => {
        const { defaultValue, value } = props;
        if (value != null) {
            return fromDateRangeToMomentDateRange(value);
        } else if (defaultValue != null) {
            return fromDateRangeToMomentDateRange(defaultValue);
        } else {
            return [moment(null), moment(null)] as MomentDateRange;
        }
    }

    private getSelectedRange = () => {
        return [this.state.selectedStart, this.state.selectedEnd].map((selectedBound?: moment.Moment) => {
            return this.isMomentValidAndInRange(selectedBound)
                ? fromMomentToDate(selectedBound)
                : undefined;
        }) as DateRange;
    }

    private getStartInputDisplayString = () => {
        return this.state.isStartInputFocused
            ? this.state.startInputString
            : this.getFormattedDateString(this.state.selectedStart);
    }

    private getEndInputDisplayString = () => {
        return this.state.isEndInputFocused
            ? this.state.endInputString
            : this.getFormattedDateString(this.state.selectedEnd);
    }

    private getFormattedDateString = (momentDate: moment.Moment) => {
        if (isMomentNull(momentDate)) {
            return "";
        } else {
            return momentDate.format(this.props.format);
        }
    }

    private getStateKeysAndValuesForBoundary = (boundary: DateRangeBoundary) => {
        const controlledRange = fromDateRangeToMomentDateRange(this.props.value);
        if (boundary === DateRangeBoundary.START) {
            return {
                keys: {
                    inputString: "startInputString",
                    isInputFocused: "isStartInputFocused",
                    selectedValue: "selectedStart",
                },
                values: {
                    controlledValue: (controlledRange != null) ? controlledRange[0] : undefined,
                    inputString: this.state.startInputString,
                    isFocused: this.state.isStartInputFocused,
                    selectedValue: this.state.selectedStart,
                },
            } as IStateKeysAndValuesObject;
        } else {
            return {
                keys: {
                    inputString: "endInputString",
                    isInputFocused: "isEndInputFocused",
                    selectedValue: "selectedEnd",
                },
                values: {
                    controlledValue: (controlledRange != null) ? controlledRange[1] : undefined,
                    inputString: this.state.endInputString,
                    isFocused: this.state.isEndInputFocused,
                    selectedValue: this.state.selectedEnd,
                },
            } as IStateKeysAndValuesObject;
        }
    }

    private isControlled = () => {
        return this.props.value !== undefined;
    }

    private isMomentValidAndInRange = (momentDate: moment.Moment) => {
        return isMomentValidAndInRange(momentDate, this.props.minDate, this.props.maxDate);
    }
}
