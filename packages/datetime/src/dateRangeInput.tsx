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
        inputString: string;
        isInputFocused: string;
        selectedValue: string;
    };
    values: {
        inputString?: string;
        isInputFocused?: string;
        selectedValue?: moment.Moment;
    };
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
                        onBlur={this.handleInputBlur}
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClick}
                        onFocus={this.handleInputFocus}
                        value={startInputString}
                    />
                    <InputGroup
                        placeholder="End date"
                        {...this.props.endInputProps}
                        inputRef={this.refHandlers.endInputRef}
                        onBlur={this.handleInputBlur}
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClick}
                        onFocus={this.handleInputFocus}
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

    private handleDateRangePickerChange = (selectedRange: DateRange) => {
        if (this.props.value === undefined) {
            const [selectedStart, selectedEnd] = fromDateRangeToMomentDateRange(selectedRange);
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

    private handleInputBlur = (e: React.FormEvent<HTMLInputElement>) => {
        const inputElement = e.target as HTMLInputElement;
        const { keys, values } = this.getStateKeysAndValuesForInput(inputElement);

        const maybeNextValue = this.dateStringToMoment(values.inputString);

        if (values.inputString == null || values.inputString.length === 0) {
            this.setState({
                [keys.isInputFocused]: false,
                [keys.selectedValue]: moment(null),
                [keys.inputString]: null,
            });
        } else if (!this.isMomentValidAndInRange(maybeNextValue)) {
            if (this.props.value === undefined) {
                // uncontrolled mode
                this.setState({
                    [keys.isInputFocused]: false,
                    [keys.inputString]: null,
                    [keys.selectedValue]: maybeNextValue,
                });
            } else {
                // controlled mode
                this.setState({ [keys.isInputFocused]: false });
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

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const inputElement = e.target as HTMLInputElement;
        const inputString = inputElement.value;

        const nextValue = this.dateStringToMoment(inputString);
        const { keys } = this.getStateKeysAndValuesForInput(e.target as HTMLInputElement);

        if (inputString.length === 0) {
            // this case will be relevant when we start showing the hovered
            // range in the input fields. goal is to show an empty field for
            // clarity until the mouse moves over a different date.
            this.setState({ [keys.inputString]: "", [keys.selectedValue]: moment(null) });
        } else if (this.props.value === undefined && this.isMomentValidAndInRange(nextValue)) {
            this.setState({ [keys.inputString]: inputString, [keys.selectedValue]: nextValue });
        } else {
            this.setState({ [keys.inputString]: inputString });
        }
    }

    private handlePopoverClose = () => {
        this.setState({ isOpen: false });
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

    private getFormattedDateString = (momentDate: moment.Moment) => {
        if (isMomentNull(momentDate)) {
            return "";
        } else {
            return momentDate.format(this.props.format);
        }
    }

    private dateStringToMoment = (dateString: String) => {
        return moment(dateString, this.props.format);
    }

    private isMomentValidAndInRange = (momentDate: moment.Moment) => {
        return isMomentValidAndInRange(momentDate, this.props.minDate, this.props.maxDate);
    }

    private getStateKeysAndValuesForInput = (inputElement: HTMLInputElement): IStateKeysAndValuesObject => {
        if (inputElement === this.startInputRef) {
            return {
                keys: {
                    inputString: "startInputString",
                    isInputFocused: "isStartInputFocused",
                    selectedValue: "selectedStart",
                },
                values: {
                    inputString: this.state.startInputString,
                    isFocused: this.state.isStartInputFocused,
                    selectedValue: this.state.selectedStart,
                },
            } as IStateKeysAndValuesObject;
        } else if (inputElement === this.endInputRef) {
            return {
                keys: {
                    inputString: "endInputString",
                    isInputFocused: "isEndInputFocused",
                    selectedValue: "selectedEnd",
                },
                values: {
                    inputString: this.state.endInputString,
                    isFocused: this.state.isEndInputFocused,
                    selectedValue: this.state.selectedEnd,
                },
            } as IStateKeysAndValuesObject;
        } else {
            // return an object to help downstream code stay less verbose.
            return {} as IStateKeysAndValuesObject;
        }
    }
}
