/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as moment from "moment";
import * as React from "react";

import {
    AbstractComponent,
    Classes,
    IInputGroupProps,
    InputGroup,
    IProps,
    Keys,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";

import {
    DateRange,
    DateRangeBoundary,
    fromDateRangeToMomentDateRange,
    fromDateToMoment,
    fromMomentToDate,
    isMomentInRange,
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
     * Whether the start and end dates of the range can be the same day.
     * If `true`, clicking a selected date will create a one-day range.
     * If `false`, clicking a selected date will clear the selection.
     * @default false
     */
    allowSingleDayRange?: boolean;

    /**
     * Whether the calendar popover should close when a date range is fully selected.
     * @default true
     */
    closeOnSelection?: boolean;

    /**
     * The default date range to be used in the component when uncontrolled.
     * This will be ignored if `value` is set.
     */
    defaultValue?: DateRange;

    /**
     * Whether the text inputs are non-interactive.
     * @default false
     */
    disabled?: boolean;

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
     * The error message to display when the selected date is invalid.
     * @default "Invalid date"
     */
    invalidDateMessage?: string;

    /**
     * Called when the user selects a day.
     * If no days are selected, it will pass `[null, null]`.
     * If a start date is selected but not an end date, it will pass `[selectedDate, null]`.
     * If both a start and end date are selected, it will pass `[startDate, endDate]`.
     */
    onChange?: (selectedRange: DateRange) => void;

    /**
     * Called when the user finishes typing in a new date and the date causes an error state.
     * If the date is invalid, `new Date(undefined)` will be returned for the corresponding
     * boundary of the date range.
     * If the date is out of range, the out-of-range date will be returned for the corresponding
     * boundary of the date range (`onChange` is not called in this case).
     */
    onError?: (errorRange: DateRange) => void;

    /**
     * The error message to display when the date selected is out of range.
     * @default "Out of range"
     */
    outOfRangeMessage?: string;

    /**
     * The error message to display when the selected dates overlap.
     * This can only happen when typing dates in the input field.
     * @default "Overlapping dates"
     */
    overlappingDatesMessage?: string;

    /**
     * Whether the entire text field should be selected on focus.
     * @default false
     */
    selectAllOnFocus?: boolean;

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
    boundaryToModify?: DateRangeBoundary;
    lastFocusedField?: DateRangeBoundary;

    formattedMinDateString?: string;
    formattedMaxDateString?: string;

    isStartInputFocused?: boolean;
    isEndInputFocused?: boolean;

    startInputString?: string;
    endInputString?: string;

    startHoverString?: string;
    endHoverString?: string;

    selectedEnd?: moment.Moment;
    selectedStart?: moment.Moment;

    shouldSelectAfterUpdate?: boolean;
    wasLastFocusChangeDueToHover?: boolean;
};

interface IStateKeysAndValuesObject {
    keys: {
        hoverString: "startHoverString" | "endHoverString";
        inputString: "startInputString" | "endInputString";
        isInputFocused: "isStartInputFocused" | "isEndInputFocused";
        selectedValue: "selectedStart" | "selectedEnd";
    };
    values: {
        controlledValue?: moment.Moment,
        hoverString?: string;
        inputString?: string;
        isInputFocused?: boolean;
        selectedValue?: moment.Moment;
    };
};

export class DateRangeInput extends AbstractComponent<IDateRangeInputProps, IDateRangeInputState> {
    public static defaultProps: IDateRangeInputProps = {
        allowSingleDayRange: false,
        closeOnSelection: true,
        disabled: false,
        endInputProps: {},
        format: "YYYY-MM-DD",
        invalidDateMessage: "Invalid date",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        outOfRangeMessage: "Out of range",
        overlappingDatesMessage: "Overlapping dates",
        selectAllOnFocus: false,
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
            formattedMaxDateString: this.getFormattedMinMaxDateString(props, "maxDate"),
            formattedMinDateString: this.getFormattedMinMaxDateString(props, "minDate"),
            isOpen: false,
            selectedEnd,
            selectedStart,
        };
    }

    public componentDidUpdate() {
        const { isStartInputFocused, isEndInputFocused, shouldSelectAfterUpdate } = this.state;

        const shouldFocusStartInput = this.shouldFocusInputRef(isStartInputFocused, this.startInputRef);
        const shouldFocusEndInput = this.shouldFocusInputRef(isEndInputFocused, this.endInputRef);

        if (shouldFocusStartInput) {
            this.startInputRef.focus();
        } else if (shouldFocusEndInput) {
            this.endInputRef.focus();
        }

        if (isStartInputFocused && shouldSelectAfterUpdate) {
            this.startInputRef.select();
        } else if (isEndInputFocused && shouldSelectAfterUpdate) {
            this.endInputRef.select();
        }
    }

    public render() {
        const { startInputProps, endInputProps } = this.props;

        const popoverContent = (
            <DateRangePicker
                allowSingleDayRange={this.props.allowSingleDayRange}
                onChange={this.handleDateRangePickerChange}
                onHoverChange={this.handleDateRangePickerHoverChange}
                maxDate={this.props.maxDate}
                minDate={this.props.minDate}
                boundaryToModify={this.state.boundaryToModify}
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
                position={Position.BOTTOM_LEFT}
            >
                <div className={Classes.CONTROL_GROUP}>
                    <InputGroup
                        {...startInputProps}
                        className={this.getInputClasses(DateRangeBoundary.START, startInputProps)}
                        disabled={this.props.disabled}
                        inputRef={this.refHandlers.startInputRef}
                        onBlur={this.handleStartInputBlur}
                        onChange={this.handleStartInputChange}
                        onClick={this.handleInputClick}
                        onFocus={this.handleStartInputFocus}
                        onKeyDown={this.handleInputKeyDown}
                        onMouseDown={this.handleInputMouseDown}
                        placeholder={this.getInputPlaceholderString(DateRangeBoundary.START)}
                        value={this.getInputDisplayString(DateRangeBoundary.START)}
                    />
                    <InputGroup
                        {...endInputProps}
                        className={this.getInputClasses(DateRangeBoundary.END, endInputProps)}
                        disabled={this.props.disabled}
                        inputRef={this.refHandlers.endInputRef}
                        onBlur={this.handleEndInputBlur}
                        onChange={this.handleEndInputChange}
                        onClick={this.handleInputClick}
                        onFocus={this.handleEndInputFocus}
                        onKeyDown={this.handleInputKeyDown}
                        onMouseDown={this.handleInputMouseDown}
                        placeholder={this.getInputPlaceholderString(DateRangeBoundary.END)}
                        value={this.getInputDisplayString(DateRangeBoundary.END)}
                    />
                </div>
            </Popover>
        );
    }

    public componentWillReceiveProps(nextProps: IDateRangeInputProps) {
        super.componentWillReceiveProps(nextProps);

        let nextState: IDateRangeInputState = {};

        if (nextProps.value !== this.props.value) {
            const [selectedStart, selectedEnd] = this.getInitialRange(nextProps);
            nextState = { ...nextState, selectedStart, selectedEnd };
        }

        // we use Moment to format date strings, but min/max dates come in as vanilla JS Dates.
        // cache the formatted date strings to avoid creating new Moment instances on each render.
        const didFormatChange = nextProps.format !== this.props.format;
        if (didFormatChange || nextProps.minDate !== this.props.minDate) {
            const formattedMinDateString = this.getFormattedMinMaxDateString(nextProps, "minDate");
            nextState = { ...nextState, formattedMinDateString };
        }
        if (didFormatChange || nextProps.maxDate !== this.props.maxDate) {
            const formattedMaxDateString = this.getFormattedMinMaxDateString(nextProps, "maxDate");
            nextState = { ...nextState, formattedMaxDateString };
        }

        this.setState(nextState);
    }

    // Callbacks - DateRangePicker
    // ===========================

    private handleDateRangePickerChange = (selectedRange: DateRange) => {
        // ignore mouse events in the date-range picker if the popover is animating closed.
        if (!this.state.isOpen) {
            return;
        }

        if (this.props.value === undefined) {
            const [selectedStart, selectedEnd] = fromDateRangeToMomentDateRange(selectedRange);

            let isOpen = true;

            let isStartInputFocused: boolean;
            let isEndInputFocused: boolean;

            let startHoverString: string;
            let endHoverString: string;

            if (isMomentNull(selectedStart)) {
                // focus the start field by default or if only an end date is specified
                isStartInputFocused = true;
                isEndInputFocused = false;

                // for clarity, hide the hover string until the mouse moves over a different date
                startHoverString = null;
            } else if (isMomentNull(selectedEnd)) {
                // focus the end field if a start date is specified
                isStartInputFocused = false;
                isEndInputFocused = true;

                endHoverString = null;
            } else if (this.props.closeOnSelection) {
                isOpen = false;
                isStartInputFocused = false;
                isEndInputFocused = false;
            } else if (this.state.lastFocusedField === DateRangeBoundary.START) {
                // keep the start field focused
                isStartInputFocused = true;
                isEndInputFocused = false;
            } else {
                // keep the end field focused
                isStartInputFocused = false;
                isEndInputFocused = true;
            }

            this.setState({
                isOpen,
                selectedEnd,
                selectedStart,
                isEndInputFocused,
                isStartInputFocused,
                startHoverString,
                endHoverString,
                endInputString: this.getFormattedDateString(selectedEnd),
                startInputString: this.getFormattedDateString(selectedStart),
                wasLastFocusChangeDueToHover: false,
            });
        }
        Utils.safeInvoke(this.props.onChange, selectedRange);
    }

    private handleDateRangePickerHoverChange = (hoveredRange: DateRange, day: Date) => {
        // ignore mouse events in the date-range picker if the popover is animating closed.
        if (!this.state.isOpen) {
            return;
        }

        if (hoveredRange == null) {
            // undo whatever focus changes we made while hovering
            // over various calendar dates
            const isEndInputFocused = (this.state.boundaryToModify === DateRangeBoundary.END);
            const isStartInputFocused = !isEndInputFocused;
            const lastFocusedField = (isEndInputFocused) ? DateRangeBoundary.END : DateRangeBoundary.START;

            this.setState({
                isEndInputFocused,
                isStartInputFocused,
                lastFocusedField,
                endHoverString: null,
                startHoverString: null,
            });
            return;
        }

        const { selectedStart, selectedEnd, boundaryToModify } = this.state;

        const [hoveredStart, hoveredEnd] = fromDateRangeToMomentDateRange(hoveredRange);
        const [startHoverString, endHoverString] = [hoveredStart, hoveredEnd].map((momentDate: moment.Moment) => {
            return this.getFormattedDateString(momentDate);
        });
        const [isHoveredStartDefined, isHoveredEndDefined] = [hoveredStart, hoveredEnd].map((d) => !isMomentNull(d));
        const [isStartDateSelected, isEndDateSelected] = [selectedStart, selectedEnd].map((d) => !isMomentNull(d));

        const isModifyingStartBoundary = boundaryToModify === DateRangeBoundary.START;
        const isModifyingEndBoundary = !isModifyingStartBoundary;

        const hoveredDay = fromDateToMoment(day);

        // pull the existing values from state; we may not overwrite them.
        let { isStartInputFocused, isEndInputFocused } = this.state;

        if (isStartDateSelected && isEndDateSelected) {
            if (isHoveredStartDefined && isHoveredEndDefined) {
                if (hoveredStart.isSame(selectedStart, "day")) {
                    // we'd be modifying the end date on click
                    isStartInputFocused = false;
                    isEndInputFocused = true;
                } else if (hoveredEnd.isSame(selectedEnd, "day")) {
                    // we'd be modifying the start date on click
                    isStartInputFocused = true;
                    isEndInputFocused = false;
                }
            } else if (isHoveredStartDefined) {
                if (isModifyingStartBoundary && hoveredDay.isSame(selectedEnd, "day")) {
                    // we'd be deselecting the end date on click
                    isStartInputFocused = false;
                    isEndInputFocused = true;
                } else if (isModifyingStartBoundary) {
                    // we'd be specifying a new start date and clearing the end date on click
                    isStartInputFocused = true;
                    isEndInputFocused = false;
                } else {
                    // we'd be deselecting the end date on click
                    isStartInputFocused = false;
                    isEndInputFocused = true;
                }
            } else if (isHoveredEndDefined) {
                if (isModifyingEndBoundary && hoveredDay.isSame(selectedStart, "day")) {
                    // we'd be deselecting the start date on click
                    isStartInputFocused = true;
                    isEndInputFocused = false;
                } else if (isModifyingEndBoundary) {
                    // we'd be specifying a new end date (clearing the start date) on click
                    isStartInputFocused = false;
                    isEndInputFocused = true;
                } else {
                    // we'd be deselecting the start date on click
                    isStartInputFocused = true;
                    isEndInputFocused = false;
                }
            }
        } else if (isStartDateSelected) {
            if (isHoveredStartDefined && isHoveredEndDefined) {
                if (hoveredStart.isSame(selectedStart, "day")) {
                    // we'd be modifying the end date on click, so focus the end field
                    isStartInputFocused = false;
                    isEndInputFocused = true;
                } else if (hoveredEnd.isSame(selectedStart, "day")) {
                    // we'd be modifying the start date on click, so focus the start field
                    isStartInputFocused = true;
                    isEndInputFocused = false;
                }
            } else if (isHoveredStartDefined) {
                // we'd be replacing the start date on click
                isStartInputFocused = true;
                isEndInputFocused = false;
            } else if (isHoveredEndDefined) {
                // we'd be converting the selected start date to an end date
                isStartInputFocused = false;
                isEndInputFocused = true;
            } else {
                // we'd be deselecting start date on click
                isStartInputFocused = true;
                isEndInputFocused = false;
            }
        } else if (isEndDateSelected) {
            if (isHoveredStartDefined && isHoveredEndDefined) {
                if (hoveredEnd.isSame(selectedEnd, "day")) {
                    // we'd be modifying the start date on click
                    isStartInputFocused = true;
                    isEndInputFocused = false;
                } else if (hoveredStart.isSame(selectedEnd, "day")) {
                    // we'd be modifying the end date on click
                    isStartInputFocused = false;
                    isEndInputFocused = true;
                }
            } else if (isHoveredEndDefined) {
                // we'd be replacing the end date on click
                isStartInputFocused = false;
                isEndInputFocused = true;
            } else if (isHoveredStartDefined) {
                // we'd be converting the selected end date to a start date
                isStartInputFocused = true;
                isEndInputFocused = false;
            } else {
                // we'd be deselecting end date on click
                isStartInputFocused = false;
                isEndInputFocused = true;
            }
        }

        this.setState({
            startHoverString,
            endHoverString,
            isStartInputFocused,
            isEndInputFocused,
            lastFocusedField: (isStartInputFocused) ? DateRangeBoundary.START : DateRangeBoundary.END,
            shouldSelectAfterUpdate: this.props.selectAllOnFocus,
            wasLastFocusChangeDueToHover: true,
        });
    }

    // Callbacks - Input
    // =================

    // Key down

    // add a keydown listener to persistently change focus when tabbing:
    // - if focused in start field, Tab moves focus to end field
    // - if focused in end field, Shift+Tab moves focus to start field
    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const isTabPressed = e.keyCode === Keys.TAB;
        const isShiftPressed = e.shiftKey;

        // order of JS events is our enemy here. when tabbing between fields,
        // this handler will fire in the middle of a focus exchange when no
        // field is currently focused. we work around this by referring to the
        // most recently focused field, rather than the currently focused field.
        const wasStartFieldFocused = this.state.lastFocusedField === DateRangeBoundary.START;
        const wasEndFieldFocused = this.state.lastFocusedField === DateRangeBoundary.END;

        let isEndInputFocused: boolean;
        let isStartInputFocused: boolean;

        // move focus to the other field
        if (wasStartFieldFocused && isTabPressed && !isShiftPressed) {
            isStartInputFocused = false;
            isEndInputFocused = true;
        } else if (wasEndFieldFocused && isTabPressed && isShiftPressed) {
            isStartInputFocused = true;
            isEndInputFocused = false;
        } else {
            // let the default keystroke happen without side effects
            return;
        }

        // prevent the default focus-change behavior to avoid race conditions;
        // we'll handle the focus change ourselves in componentDidUpdate.
        e.preventDefault();

        this.setState({
            isStartInputFocused,
            isEndInputFocused,
            wasLastFocusChangeDueToHover: false,
        });
    }

    // Mouse down

    private handleInputMouseDown = () => {
        // clicking in the field constitutes an explicit focus change. we update
        // the flag on "mousedown" instead of on "click", because it needs to be
        // set before onFocus is called ("click" triggers after "focus").
        this.setState({ wasLastFocusChangeDueToHover: false });
    }

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

        // change the boundary only if the user explicitly focused in the field.
        // focus changes from hovering don't count; they're just temporary.
        const boundaryToModify = (this.state.wasLastFocusChangeDueToHover)
            ? this.state.boundaryToModify
            : boundary;

        this.setState({
            isOpen: true,
            boundaryToModify,
            [keys.inputString]: inputString,
            [keys.isInputFocused]: true,
            lastFocusedField: boundary,
            shouldSelectAfterUpdate: this.props.selectAllOnFocus,
            wasLastFocusChangeDueToHover: false,
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

        let nextState: IDateRangeInputState = {
            [keys.isInputFocused]: false,
            shouldSelectAfterUpdate: false,
        };

        if (this.isInputEmpty(values.inputString)) {
            if (isValueControlled) {
                nextState = {
                    ...nextState,
                    [keys.inputString]: this.getFormattedDateString(values.controlledValue),
                };
            } else {
                nextState = {
                    ...nextState,
                    [keys.inputString]: null,
                    [keys.selectedValue]: moment(null),
                };
            }
        } else if (!this.isNextDateRangeValid(maybeNextValue, boundary)) {
            if (!isValueControlled) {
                nextState = {
                    ...nextState,
                    [keys.inputString]: null,
                    [keys.selectedValue]: maybeNextValue,
                };
            }
            Utils.safeInvoke(this.props.onError, this.getDateRangeForCallback(maybeNextValue, boundary));
        }

        this.setState(nextState);
    }

    // Change

    private handleStartInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.handleInputChange(e, DateRangeBoundary.START);
        Utils.safeInvoke(this.props.startInputProps.onChange, e);
    }

    private handleEndInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.handleInputChange(e, DateRangeBoundary.END);
        Utils.safeInvoke(this.props.endInputProps.onChange, e);
    }

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>, boundary: DateRangeBoundary) => {
        const inputString = (e.target as HTMLInputElement).value;

        const { keys } = this.getStateKeysAndValuesForBoundary(boundary);
        const maybeNextValue = this.dateStringToMoment(inputString);
        const isValueControlled = this.isControlled();

        let nextState: IDateRangeInputState = { shouldSelectAfterUpdate: false };

        if (inputString.length === 0) {
            // this case will be relevant when we start showing the hovered
            // range in the input fields. goal is to show an empty field for
            // clarity until the mouse moves over a different date.
            if (isValueControlled) {
                nextState = { ...nextState, [keys.inputString]: "" };
            } else {
                nextState = { ...nextState, [keys.inputString]: "", [keys.selectedValue]: moment(null) };
            }
            Utils.safeInvoke(this.props.onChange, this.getDateRangeForCallback(moment(null), boundary));
        } else if (this.isMomentValidAndInRange(maybeNextValue)) {
            // note that error cases that depend on both fields (e.g.
            // overlapping dates) should fall through into this block so that
            // the UI can update immediately, possibly with an error message on
            // the other field.
            if (isValueControlled) {
                nextState = { ...nextState, [keys.inputString]: inputString };
            } else {
                nextState = { ...nextState, [keys.inputString]: inputString, [keys.selectedValue]: maybeNextValue };
            }
            if (this.isNextDateRangeValid(maybeNextValue, boundary)) {
                Utils.safeInvoke(this.props.onChange, this.getDateRangeForCallback(maybeNextValue, boundary));
            }
        } else {
            nextState = { ...nextState, [keys.inputString]: inputString };
        }

        this.setState(nextState);
    }

    // Callbacks - Popover
    // ===================

    private handlePopoverClose = () => {
        this.setState({ isOpen: false });
    }

    // Helpers
    // =======

    private shouldFocusInputRef(isFocused: boolean, inputRef: HTMLInputElement) {
        return isFocused && inputRef !== undefined && document.activeElement !== inputRef;
    }

    private dateStringToMoment = (dateString: string) => {
        if (this.isInputEmpty(dateString)) {
            return moment(null);
        }
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
        const { selectedStart, selectedEnd } = this.state;

        // this helper function checks if the provided boundary date *would* overlap the selected
        // other boundary date. providing the already-selected start date simply tells us if we're
        // currently in an overlapping state.
        const doBoundaryDatesOverlap = this.doBoundaryDatesOverlap(selectedStart, DateRangeBoundary.START);
        const momentDateRange = [selectedStart, doBoundaryDatesOverlap ? moment(null) : selectedEnd];

        return momentDateRange.map((selectedBound?: moment.Moment) => {
            return this.isMomentValidAndInRange(selectedBound)
                ? fromMomentToDate(selectedBound)
                : undefined;
        }) as DateRange;
    }

    private getInputClasses = (boundary: DateRangeBoundary, boundaryInputProps: IInputGroupProps) => {
        return classNames(boundaryInputProps.className, {
            [Classes.INTENT_DANGER]: this.isInputInErrorState(boundary),
        });
    }

    private getInputDisplayString = (boundary: DateRangeBoundary) => {
        const { values } = this.getStateKeysAndValuesForBoundary(boundary);
        const { isInputFocused, inputString, selectedValue, hoverString } = values;

        if (hoverString != null && !this.isControlled()) {
            // we don't want to overwrite the inputStrings in controlled mode
            return hoverString;
        } else if (isInputFocused) {
            return (inputString == null) ? "" : inputString;
        } else if (isMomentNull(selectedValue)) {
            return "";
        } else if (!this.isMomentInRange(selectedValue)) {
            return this.props.outOfRangeMessage;
        } else if (this.doesEndBoundaryOverlapStartBoundary(selectedValue, boundary)) {
            return this.props.overlappingDatesMessage;
        } else {
            return this.getFormattedDateString(selectedValue);
        }
    }

    private getInputPlaceholderString = (boundary: DateRangeBoundary) => {
        const { isInputFocused } = this.getStateKeysAndValuesForBoundary(boundary).values;
        const isStartBoundary = boundary === DateRangeBoundary.START;

        const dateString = isStartBoundary ? this.state.formattedMinDateString : this.state.formattedMaxDateString;
        const defaultString = isStartBoundary ? "Start date" : "End date";

        return isInputFocused ? dateString : defaultString;
    }

    private getFormattedDateString = (momentDate: moment.Moment, format?: string) => {
        if (isMomentNull(momentDate)) {
            return "";
        } else if (!momentDate.isValid()) {
            return this.props.invalidDateMessage;
        } else {
            return momentDate.format((format != null) ? format : this.props.format);
        }
    }

    private getStateKeysAndValuesForBoundary = (boundary: DateRangeBoundary) => {
        const controlledRange = fromDateRangeToMomentDateRange(this.props.value);
        if (boundary === DateRangeBoundary.START) {
            return {
                keys: {
                    hoverString: "startHoverString",
                    inputString: "startInputString",
                    isInputFocused: "isStartInputFocused",
                    selectedValue: "selectedStart",
                },
                values: {
                    controlledValue: (controlledRange != null) ? controlledRange[0] : undefined,
                    hoverString: this.state.startHoverString,
                    inputString: this.state.startInputString,
                    isInputFocused: this.state.isStartInputFocused,
                    selectedValue: this.state.selectedStart,
                },
            } as IStateKeysAndValuesObject;
        } else {
            return {
                keys: {
                    hoverString: "endHoverString",
                    inputString: "endInputString",
                    isInputFocused: "isEndInputFocused",
                    selectedValue: "selectedEnd",
                },
                values: {
                    controlledValue: (controlledRange != null) ? controlledRange[1] : undefined,
                    hoverString: this.state.endHoverString,
                    inputString: this.state.endInputString,
                    isInputFocused: this.state.isEndInputFocused,
                    selectedValue: this.state.selectedEnd,
                },
            } as IStateKeysAndValuesObject;
        }
    }

    private getDateRangeForCallback = (currValue?: moment.Moment, currBoundary?: DateRangeBoundary) => {
        const otherBoundary = this.getOtherBoundary(currBoundary);
        const otherValue = this.getStateKeysAndValuesForBoundary(otherBoundary).values.selectedValue;

        const currDate = this.getDateForCallback(currValue);
        const otherDate = this.getDateForCallback(otherValue);

        return (currBoundary === DateRangeBoundary.START)
            ? [currDate, otherDate]
            : [otherDate, currDate];
    }

    private getDateForCallback = (momentDate: moment.Moment) => {
        if (isMomentNull(momentDate)) {
            return null;
        } else if (!momentDate.isValid()) {
            return new Date(undefined);
        } else {
            return fromMomentToDate(momentDate);
        }
    }

    private getOtherBoundary = (boundary?: DateRangeBoundary) => {
        return (boundary === DateRangeBoundary.START) ? DateRangeBoundary.END : DateRangeBoundary.START;
    }

    private doBoundaryDatesOverlap = (boundaryDate: moment.Moment, boundary: DateRangeBoundary) => {
        const { allowSingleDayRange } = this.props;

        const otherBoundary = this.getOtherBoundary(boundary);
        const otherBoundaryDate = this.getStateKeysAndValuesForBoundary(otherBoundary).values.selectedValue;

        if (boundary === DateRangeBoundary.START) {
            return allowSingleDayRange
                ? boundaryDate.isAfter(otherBoundaryDate, "day")
                : boundaryDate.isSameOrAfter(otherBoundaryDate, "day");
        } else {
            return allowSingleDayRange
                ? boundaryDate.isBefore(otherBoundaryDate, "day")
                : boundaryDate.isSameOrBefore(otherBoundaryDate, "day");
        }
    }

    /**
     * Returns true if the provided boundary is an END boundary overlapping the
     * selected start date. (If the boundaries overlap, we consider the END
     * boundary to be erroneous.)
     */
    private doesEndBoundaryOverlapStartBoundary = (boundaryDate: moment.Moment, boundary: DateRangeBoundary) => {
        return (boundary === DateRangeBoundary.START)
            ? false
            : this.doBoundaryDatesOverlap(boundaryDate, boundary);
    }

    private isControlled = () => {
        return this.props.value !== undefined;
    }

    private isInputEmpty = (inputString: string) => {
        return inputString == null || inputString.length === 0;
    }

    private isInputInErrorState = (boundary: DateRangeBoundary) => {
        const values = this.getStateKeysAndValuesForBoundary(boundary).values;
        const { isInputFocused, inputString, selectedValue } = values;

        const boundaryValue = (isInputFocused)
            ? this.dateStringToMoment(inputString)
            : selectedValue;

        // break down the boolean logic to an elementary level to make it
        // utterly simple to grok.

        if (isMomentNull(boundaryValue)) {
            return false;
        }

        if (!boundaryValue.isValid()) {
            return true;
        }

        if (!this.isMomentInRange(boundaryValue)) {
            return true;
        }

        if (this.doesEndBoundaryOverlapStartBoundary(boundaryValue, boundary)) {
            return true;
        }

        return false;
    }

    private isMomentValidAndInRange = (momentDate: moment.Moment) => {
        return isMomentValidAndInRange(momentDate, this.props.minDate, this.props.maxDate);
    }

    private isMomentInRange = (momentDate: moment.Moment) => {
        return isMomentInRange(momentDate, this.props.minDate, this.props.maxDate);
    }

    private isNextDateRangeValid(nextMomentDate: moment.Moment, boundary: DateRangeBoundary) {
        return this.isMomentValidAndInRange(nextMomentDate)
            && !this.doBoundaryDatesOverlap(nextMomentDate, boundary);
    }

    // this is a slightly kludgy function, but it saves us a good amount of repeated code between
    // the constructor and componentWillReceiveProps.
    private getFormattedMinMaxDateString(props: IDateRangeInputProps, propName: "minDate" | "maxDate") {
        const date = props[propName];
        const defaultDate = DateRangeInput.defaultProps[propName];
        // default values are applied only if a prop is strictly `undefined`
        // See: https://facebook.github.io/react/docs/react-component.html#defaultprops
        return this.getFormattedDateString(moment((date === undefined) ? defaultDate : date), props.format);
    }
}
