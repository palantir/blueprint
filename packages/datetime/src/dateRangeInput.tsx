/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";
import DayPicker, { DayPickerProps } from "react-day-picker";
import { polyfill } from "react-lifecycles-compat";

import {
    AbstractPureComponent2,
    Boundary,
    Classes,
    DISPLAYNAME_PREFIX,
    HTMLInputProps,
    IInputGroupProps,
    InputGroup,
    Intent,
    IPopoverProps,
    IProps,
    Keys,
    Popover,
    Position,
    Utils,
} from "@blueprintjs/core";

import { areSameTime, DateRange, isDateValid, isDayInRange } from "./common/dateUtils";
import * as Errors from "./common/errors";
import { getFormattedDateString, IDateFormatProps } from "./dateFormat";
import { getDefaultMaxDate, getDefaultMinDate, IDatePickerBaseProps } from "./datePickerCore";
import { DateRangePicker } from "./dateRangePicker";
import { IDateRangeShortcut } from "./shortcuts";

export interface IDateRangeInputProps extends IDatePickerBaseProps, IDateFormatProps, IProps {
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
     * Whether displayed months in the calendar are contiguous.
     * If false, each side of the calendar can move independently to non-contiguous months.
     * @default true
     */
    contiguousCalendarMonths?: boolean;

    /**
     * Props to pass to ReactDayPicker. See API documentation
     * [here](http://react-day-picker.js.org/api/DayPicker).
     *
     * The following props are managed by the component and cannot be configured:
     * `canChangeMonth`, `captionElement`, `numberOfMonths`, `fromMonth` (use
     * `minDate`), `month` (use `initialMonth`), `toMonth` (use `maxDate`).
     */
    dayPickerProps?: DayPickerProps;

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
     * Props to pass to the end-date [input group](#core/components/text-inputs.input-group).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `ref` is not supported; use `inputRef` instead.
     */
    endInputProps?: HTMLInputProps & IInputGroupProps;

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
     * The error message to display when the selected dates overlap.
     * This can only happen when typing dates in the input field.
     * @default "Overlapping dates"
     */
    overlappingDatesMessage?: string;

    /**
     * The props to pass to the popover.
     * `autoFocus`, `content`, and `enforceFocus` will be ignored to avoid compromising usability.
     */
    popoverProps?: Partial<IPopoverProps>;

    /**
     * Whether the entire text field should be selected on focus.
     * @default false
     */
    selectAllOnFocus?: boolean;

    /**
     * Whether shortcuts to quickly select a range of dates are displayed or not.
     * If `true`, preset shortcuts will be displayed.
     * If `false`, no shortcuts will be displayed.
     * If an array is provided, the custom shortcuts will be displayed.
     * @default true
     */
    shortcuts?: boolean | IDateRangeShortcut[];

    /**
     * Whether to show only a single month calendar.
     * @default false
     */
    singleMonthOnly?: boolean;

    /**
     * Props to pass to the start-date [input group](#core/components/text-inputs.input-group).
     * `disabled` and `value` will be ignored in favor of the top-level props on this component.
     * `ref` is not supported; use `inputRef` instead.
     */
    startInputProps?: HTMLInputProps & IInputGroupProps;

    /**
     * The currently selected date range.
     * If the prop is strictly `undefined`, the component acts in an uncontrolled manner.
     * If this prop is anything else, the component acts in a controlled manner.
     * To display an empty value in the input fields in a controlled manner, pass `[null, null]`.
     * To display an invalid date error in either input field, pass `new Date(undefined)`
     * for the appropriate date in the value prop.
     */
    value?: DateRange;
}

export interface IDateRangeInputState {
    isOpen?: boolean;
    boundaryToModify?: Boundary;
    lastFocusedField?: Boundary;

    formattedMinDateString?: string;
    formattedMaxDateString?: string;

    isStartInputFocused?: boolean;
    isEndInputFocused?: boolean;

    startInputString?: string;
    endInputString?: string;

    startHoverString?: string;
    endHoverString?: string;

    selectedEnd?: Date;
    selectedStart?: Date;

    shouldSelectAfterUpdate?: boolean;
    wasLastFocusChangeDueToHover?: boolean;

    selectedShortcutIndex?: number;
}

interface IStateKeysAndValuesObject {
    keys: {
        hoverString: "startHoverString" | "endHoverString";
        inputString: "startInputString" | "endInputString";
        isInputFocused: "isStartInputFocused" | "isEndInputFocused";
        selectedValue: "selectedStart" | "selectedEnd";
    };
    values: {
        controlledValue?: Date;
        hoverString?: string;
        inputString?: string;
        isInputFocused?: boolean;
        selectedValue?: Date;
    };
}

@polyfill
export class DateRangeInput extends AbstractPureComponent2<IDateRangeInputProps, IDateRangeInputState> {
    public static defaultProps: Partial<IDateRangeInputProps> = {
        allowSingleDayRange: false,
        closeOnSelection: true,
        contiguousCalendarMonths: true,
        dayPickerProps: {},
        disabled: false,
        endInputProps: {},
        invalidDateMessage: "Invalid date",
        maxDate: getDefaultMaxDate(),
        minDate: getDefaultMinDate(),
        outOfRangeMessage: "Out of range",
        overlappingDatesMessage: "Overlapping dates",
        popoverProps: {},
        selectAllOnFocus: false,
        shortcuts: true,
        singleMonthOnly: false,
        startInputProps: {},
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.DateRangeInput`;

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
        this.reset(props);
    }

    /**
     * Public method intended for unit testing only. Do not use in feature work!
     */
    public reset(props: IDateRangeInputProps = this.props) {
        const [selectedStart, selectedEnd] = this.getInitialRange();
        this.state = {
            formattedMaxDateString: this.getFormattedMinMaxDateString(props, "maxDate"),
            formattedMinDateString: this.getFormattedMinMaxDateString(props, "minDate"),
            isOpen: false,
            selectedEnd,
            selectedShortcutIndex: -1,
            selectedStart,
        };
    }

    public componentDidUpdate(prevProps: IDateRangeInputProps, prevState: IDateRangeInputState, snapshot?: {}) {
        super.componentDidUpdate(prevProps, prevState, snapshot);
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

        let nextState: IDateRangeInputState = {};

        if (this.props.value !== prevProps.value) {
            const [selectedStart, selectedEnd] = this.getInitialRange(this.props);
            nextState = { ...nextState, selectedStart, selectedEnd };
        }

        // cache the formatted date strings to avoid computing on each render.
        if (this.props.minDate !== prevProps.minDate) {
            const formattedMinDateString = this.getFormattedMinMaxDateString(this.props, "minDate");
            nextState = { ...nextState, formattedMinDateString };
        }
        if (this.props.maxDate !== prevProps.maxDate) {
            const formattedMaxDateString = this.getFormattedMinMaxDateString(this.props, "maxDate");
            nextState = { ...nextState, formattedMaxDateString };
        }

        this.setState(nextState);
    }

    public render() {
        const { selectedShortcutIndex } = this.state;
        const { popoverProps = {} } = this.props;

        const popoverContent = (
            <DateRangePicker
                {...this.props}
                selectedShortcutIndex={selectedShortcutIndex}
                boundaryToModify={this.state.boundaryToModify}
                onChange={this.handleDateRangePickerChange}
                onShortcutChange={this.handleShortcutChange}
                onHoverChange={this.handleDateRangePickerHoverChange}
                value={this.getSelectedRange()}
            />
        );

        const popoverClassName = classNames(popoverProps.className, this.props.className);

        // allow custom props for the popover and each input group, but pass them in an order that
        // guarantees only some props are overridable.
        return (
            <Popover
                isOpen={this.state.isOpen}
                position={Position.BOTTOM_LEFT}
                {...this.props.popoverProps}
                autoFocus={false}
                className={popoverClassName}
                content={popoverContent}
                enforceFocus={false}
                onClose={this.handlePopoverClose}
            >
                <div className={Classes.CONTROL_GROUP}>
                    {this.renderInputGroup(Boundary.START)}
                    {this.renderInputGroup(Boundary.END)}
                </div>
            </Popover>
        );
    }

    protected validateProps(props: IDateRangeInputProps) {
        if (props.value === null) {
            throw new Error(Errors.DATERANGEINPUT_NULL_VALUE);
        }
    }

    private renderInputGroup = (boundary: Boundary) => {
        const inputProps = this.getInputProps(boundary);
        const handleInputEvent = boundary === Boundary.START ? this.handleStartInputEvent : this.handleEndInputEvent;

        return (
            <InputGroup
                autoComplete="off"
                disabled={inputProps.disabled || this.props.disabled}
                {...inputProps}
                intent={this.isInputInErrorState(boundary) ? Intent.DANGER : inputProps.intent}
                inputRef={this.getInputRef(boundary)}
                onBlur={handleInputEvent}
                onChange={handleInputEvent}
                onClick={handleInputEvent}
                onFocus={handleInputEvent}
                onKeyDown={handleInputEvent}
                onMouseDown={handleInputEvent}
                placeholder={this.getInputPlaceholderString(boundary)}
                value={this.getInputDisplayString(boundary)}
            />
        );
    };

    // Callbacks - DateRangePicker
    // ===========================

    private handleDateRangePickerChange = (selectedRange: DateRange, didSubmitWithEnter = false) => {
        // ignore mouse events in the date-range picker if the popover is animating closed.
        if (!this.state.isOpen) {
            return;
        }

        const [selectedStart, selectedEnd] = selectedRange;

        let isOpen = true;

        let isStartInputFocused: boolean;
        let isEndInputFocused: boolean;

        let startHoverString: string;
        let endHoverString: string;

        let boundaryToModify: Boundary;

        if (selectedStart == null) {
            // focus the start field by default or if only an end date is specified
            if (this.props.timePrecision == null) {
                isStartInputFocused = true;
                isEndInputFocused = false;
            } else {
                isStartInputFocused = false;
                isEndInputFocused = false;
                boundaryToModify = Boundary.START;
            }

            // for clarity, hide the hover string until the mouse moves over a different date
            startHoverString = null;
        } else if (selectedEnd == null) {
            // focus the end field if a start date is specified
            if (this.props.timePrecision == null) {
                isStartInputFocused = false;
                isEndInputFocused = true;
            } else {
                isStartInputFocused = false;
                isEndInputFocused = false;
                boundaryToModify = Boundary.END;
            }

            endHoverString = null;
        } else if (this.props.closeOnSelection) {
            isOpen = this.getIsOpenValueWhenDateChanges(selectedStart, selectedEnd);
            isStartInputFocused = false;

            if (this.props.timePrecision == null && didSubmitWithEnter) {
                // if we submit via click or Tab, the focus will have moved already.
                // it we submit with Enter, the focus won't have moved, and setting
                // the flag to false won't have an effect anyway, so leave it true.
                isEndInputFocused = true;
            } else {
                isEndInputFocused = false;
                boundaryToModify = Boundary.END;
            }
        } else if (this.state.lastFocusedField === Boundary.START) {
            // keep the start field focused
            if (this.props.timePrecision == null) {
                isStartInputFocused = true;
                isEndInputFocused = false;
            } else {
                isStartInputFocused = false;
                isEndInputFocused = false;
                boundaryToModify = Boundary.START;
            }
        } else if (this.props.timePrecision == null) {
            // keep the end field focused
            isStartInputFocused = false;
            isEndInputFocused = true;
        } else {
            isStartInputFocused = false;
            isEndInputFocused = false;
            boundaryToModify = Boundary.END;
        }

        const baseStateChange = {
            boundaryToModify,
            endHoverString,
            endInputString: this.formatDate(selectedEnd),
            isEndInputFocused,
            isOpen,
            isStartInputFocused,
            startHoverString,
            startInputString: this.formatDate(selectedStart),
            wasLastFocusChangeDueToHover: false,
        };

        if (this.isControlled()) {
            this.setState(baseStateChange);
        } else {
            this.setState({ ...baseStateChange, selectedEnd, selectedStart });
        }

        Utils.safeInvoke(this.props.onChange, selectedRange);
    };

    private handleShortcutChange = (_: IDateRangeShortcut, selectedShortcutIndex: number) => {
        this.setState({ selectedShortcutIndex });
    };

    private handleDateRangePickerHoverChange = (
        hoveredRange: DateRange,
        _hoveredDay: Date,
        hoveredBoundary: Boundary,
    ) => {
        // ignore mouse events in the date-range picker if the popover is animating closed.
        if (!this.state.isOpen) {
            return;
        }

        if (hoveredRange == null) {
            // undo whatever focus changes we made while hovering over various calendar dates
            const isEndInputFocused = this.state.boundaryToModify === Boundary.END;

            this.setState({
                endHoverString: null,
                isEndInputFocused,
                isStartInputFocused: !isEndInputFocused,
                lastFocusedField: this.state.boundaryToModify,
                startHoverString: null,
            });
        } else {
            const [hoveredStart, hoveredEnd] = hoveredRange;
            const isStartInputFocused =
                hoveredBoundary != null ? hoveredBoundary === Boundary.START : this.state.isStartInputFocused;
            const isEndInputFocused =
                hoveredBoundary != null ? hoveredBoundary === Boundary.END : this.state.isEndInputFocused;

            this.setState({
                endHoverString: this.formatDate(hoveredEnd),
                isEndInputFocused,
                isStartInputFocused,
                lastFocusedField: isStartInputFocused ? Boundary.START : Boundary.END,
                shouldSelectAfterUpdate: this.props.selectAllOnFocus,
                startHoverString: this.formatDate(hoveredStart),
                wasLastFocusChangeDueToHover: true,
            });
        }
    };

    // Callbacks - Input
    // =================

    // instantiate these two functions once so we don't have to for each callback on each render.

    private handleStartInputEvent = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.handleInputEvent(e, Boundary.START);
    };

    private handleEndInputEvent = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.handleInputEvent(e, Boundary.END);
    };

    private handleInputEvent = (e: React.SyntheticEvent<HTMLInputElement>, boundary: Boundary) => {
        switch (e.type) {
            case "blur":
                this.handleInputBlur(e, boundary);
                break;
            case "change":
                this.handleInputChange(e, boundary);
                break;
            case "click":
                this.handleInputClick(e as React.MouseEvent<HTMLInputElement>);
                break;
            case "focus":
                this.handleInputFocus(e, boundary);
                break;
            case "keydown":
                this.handleInputKeyDown(e as React.KeyboardEvent<HTMLInputElement>);
                break;
            case "mousedown":
                this.handleInputMouseDown();
                break;
            default:
                break;
        }

        const inputProps = this.getInputProps(boundary);
        const callbackFn = this.getInputGroupCallbackForEvent(e, inputProps);

        Utils.safeInvoke(callbackFn, e);
    };

    // add a keydown listener to persistently change focus when tabbing:
    // - if focused in start field, Tab moves focus to end field
    // - if focused in end field, Shift+Tab moves focus to start field
    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const isTabPressed = e.which === Keys.TAB;
        const isEnterPressed = e.which === Keys.ENTER;
        const isShiftPressed = e.shiftKey;

        const { selectedStart, selectedEnd } = this.state;

        // order of JS events is our enemy here. when tabbing between fields,
        // this handler will fire in the middle of a focus exchange when no
        // field is currently focused. we work around this by referring to the
        // most recently focused field, rather than the currently focused field.
        const wasStartFieldFocused = this.state.lastFocusedField === Boundary.START;
        const wasEndFieldFocused = this.state.lastFocusedField === Boundary.END;

        // move focus to the other field
        if (isTabPressed) {
            let isEndInputFocused: boolean;
            let isStartInputFocused: boolean;
            let isOpen = true;

            if (wasStartFieldFocused && !isShiftPressed) {
                isStartInputFocused = false;
                isEndInputFocused = true;

                // prevent the default focus-change behavior to avoid race conditions;
                // we'll handle the focus change ourselves in componentDidUpdate.
                e.preventDefault();
            } else if (wasEndFieldFocused && isShiftPressed) {
                isStartInputFocused = true;
                isEndInputFocused = false;
                e.preventDefault();
            } else {
                // don't prevent default here, otherwise Tab won't do anything.
                isStartInputFocused = false;
                isEndInputFocused = false;
                isOpen = false;
            }

            this.setState({
                isEndInputFocused,
                isOpen,
                isStartInputFocused,
                wasLastFocusChangeDueToHover: false,
            });
        } else if (wasStartFieldFocused && isEnterPressed) {
            const nextStartDate = this.parseDate(this.state.startInputString);
            this.handleDateRangePickerChange([nextStartDate, selectedEnd], true);
        } else if (wasEndFieldFocused && isEnterPressed) {
            const nextEndDate = this.parseDate(this.state.endInputString);
            this.handleDateRangePickerChange([selectedStart, nextEndDate] as DateRange, true);
        } else {
            // let the default keystroke happen without side effects
            return;
        }
    };

    private handleInputMouseDown = () => {
        // clicking in the field constitutes an explicit focus change. we update
        // the flag on "mousedown" instead of on "click", because it needs to be
        // set before onFocus is called ("click" triggers after "focus").
        this.setState({ wasLastFocusChangeDueToHover: false });
    };

    private handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        // unless we stop propagation on this event, a click within an input
        // will close the popover almost as soon as it opens.
        e.stopPropagation();
    };

    private handleInputFocus = (_e: React.FormEvent<HTMLInputElement>, boundary: Boundary) => {
        const { keys, values } = this.getStateKeysAndValuesForBoundary(boundary);
        const inputString = getFormattedDateString(values.selectedValue, this.props, true);

        // change the boundary only if the user explicitly focused in the field.
        // focus changes from hovering don't count; they're just temporary.
        const boundaryToModify = this.state.wasLastFocusChangeDueToHover ? this.state.boundaryToModify : boundary;

        this.setState({
            [keys.inputString]: inputString,
            [keys.isInputFocused]: true,
            boundaryToModify,
            isOpen: true,
            lastFocusedField: boundary,
            shouldSelectAfterUpdate: this.props.selectAllOnFocus,
            wasLastFocusChangeDueToHover: false,
        });
    };

    private handleInputBlur = (_e: React.FormEvent<HTMLInputElement>, boundary: Boundary) => {
        const { keys, values } = this.getStateKeysAndValuesForBoundary(boundary);

        const maybeNextDate = this.parseDate(values.inputString);
        const isValueControlled = this.isControlled();

        let nextState: IDateRangeInputState = {
            [keys.isInputFocused]: false,
            shouldSelectAfterUpdate: false,
        };

        if (this.isInputEmpty(values.inputString)) {
            if (isValueControlled) {
                nextState = {
                    ...nextState,
                    [keys.inputString]: getFormattedDateString(values.controlledValue, this.props),
                };
            } else {
                nextState = {
                    ...nextState,
                    [keys.inputString]: null,
                    [keys.selectedValue]: null,
                };
            }
        } else if (!this.isNextDateRangeValid(maybeNextDate, boundary)) {
            if (!isValueControlled) {
                nextState = {
                    ...nextState,
                    [keys.inputString]: null,
                    [keys.selectedValue]: maybeNextDate,
                };
            }
            Utils.safeInvoke(this.props.onError, this.getDateRangeForCallback(maybeNextDate, boundary));
        }

        this.setState(nextState);
    };

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>, boundary: Boundary) => {
        const inputString = (e.target as HTMLInputElement).value;

        const { keys } = this.getStateKeysAndValuesForBoundary(boundary);
        const maybeNextDate = this.parseDate(inputString);
        const isValueControlled = this.isControlled();

        let nextState: IDateRangeInputState = { shouldSelectAfterUpdate: false };

        if (inputString.length === 0) {
            // this case will be relevant when we start showing the hovered range in the input
            // fields. goal is to show an empty field for clarity until the mouse moves over a
            // different date.
            const baseState = { ...nextState, [keys.inputString]: "" };
            if (isValueControlled) {
                nextState = baseState;
            } else {
                nextState = { ...baseState, [keys.selectedValue]: null };
            }
            Utils.safeInvoke(this.props.onChange, this.getDateRangeForCallback(null, boundary));
        } else if (this.isDateValidAndInRange(maybeNextDate)) {
            // note that error cases that depend on both fields (e.g. overlapping dates) should fall
            // through into this block so that the UI can update immediately, possibly with an error
            // message on the other field.
            // also, clear the hover string to ensure the most recent keystroke appears.
            const baseState: IDateRangeInputState = {
                ...nextState,
                [keys.hoverString]: null,
                [keys.inputString]: inputString,
            };
            if (isValueControlled) {
                nextState = baseState;
            } else {
                nextState = { ...baseState, [keys.selectedValue]: maybeNextDate };
            }
            if (this.isNextDateRangeValid(maybeNextDate, boundary)) {
                Utils.safeInvoke(this.props.onChange, this.getDateRangeForCallback(maybeNextDate, boundary));
            }
        } else {
            // again, clear the hover string to ensure the most recent keystroke appears
            nextState = { ...nextState, [keys.inputString]: inputString, [keys.hoverString]: null };
        }

        this.setState(nextState);
    };

    // Callbacks - Popover
    // ===================

    private handlePopoverClose = () => {
        this.setState({ isOpen: false });
        Utils.safeInvoke(this.props.popoverProps.onClose);
    };

    // Helpers
    // =======

    private shouldFocusInputRef(isFocused: boolean, inputRef: HTMLInputElement) {
        return isFocused && inputRef !== undefined && document.activeElement !== inputRef;
    }

    private getIsOpenValueWhenDateChanges = (nextSelectedStart: Date, nextSelectedEnd: Date): boolean => {
        if (this.props.closeOnSelection) {
            // trivial case when TimePicker is not shown
            if (this.props.timePrecision == null) {
                return false;
            }

            const fallbackDate = new Date(new Date().setHours(0, 0, 0, 0));
            const [selectedStart, selectedEnd] = this.getSelectedRange([fallbackDate, fallbackDate]);

            // case to check if the user has changed TimePicker values
            if (
                areSameTime(selectedStart, nextSelectedStart) === true &&
                areSameTime(selectedEnd, nextSelectedEnd) === true
            ) {
                return false;
            }
            return true;
        }

        return true;
    };

    private getInitialRange = (props = this.props): DateRange => {
        const { defaultValue, value } = props;
        if (value != null) {
            return value;
        } else if (defaultValue != null) {
            return defaultValue;
        } else {
            return [null, null];
        }
    };

    private getSelectedRange = (fallbackRange?: [Date, Date]) => {
        let selectedStart: Date;
        let selectedEnd: Date;

        if (this.isControlled()) {
            [selectedStart, selectedEnd] = this.props.value;
        } else {
            selectedStart = this.state.selectedStart;
            selectedEnd = this.state.selectedEnd;
        }

        // this helper function checks if the provided boundary date *would* overlap the selected
        // other boundary date. providing the already-selected start date simply tells us if we're
        // currently in an overlapping state.
        const doBoundaryDatesOverlap = this.doBoundaryDatesOverlap(selectedStart, Boundary.START);
        const dateRange = [selectedStart, doBoundaryDatesOverlap ? undefined : selectedEnd];

        return dateRange.map((selectedBound: Date | undefined, index: number) => {
            const fallbackDate = fallbackRange != null ? fallbackRange[index] : undefined;
            return this.isDateValidAndInRange(selectedBound) ? selectedBound : fallbackDate;
        }) as DateRange;
    };

    private getInputGroupCallbackForEvent = (
        e: React.SyntheticEvent<HTMLInputElement>,
        inputProps: HTMLInputProps & IInputGroupProps,
    ) => {
        // use explicit switch cases to ensure callback function names remain grep-able in the codebase.
        switch (e.type) {
            case "blur":
                return inputProps.onBlur;
            case "change":
                return inputProps.onChange;
            case "click":
                return inputProps.onClick;
            case "focus":
                return inputProps.onFocus;
            case "keydown":
                return inputProps.onKeyDown;
            case "mousedown":
                return inputProps.onMouseDown;
            default:
                return undefined;
        }
    };

    private getInputDisplayString = (boundary: Boundary) => {
        const { values } = this.getStateKeysAndValuesForBoundary(boundary);
        const { isInputFocused, inputString, selectedValue, hoverString } = values;

        if (hoverString != null) {
            return hoverString;
        } else if (isInputFocused) {
            return inputString == null ? "" : inputString;
        } else if (selectedValue == null) {
            return "";
        } else if (this.doesEndBoundaryOverlapStartBoundary(selectedValue, boundary)) {
            return this.props.overlappingDatesMessage;
        } else {
            return getFormattedDateString(selectedValue, this.props);
        }
    };

    private getInputPlaceholderString = (boundary: Boundary) => {
        const isStartBoundary = boundary === Boundary.START;
        const isEndBoundary = boundary === Boundary.END;

        const inputProps = this.getInputProps(boundary);
        const { isInputFocused } = this.getStateKeysAndValuesForBoundary(boundary).values;

        // use the custom placeholder text for the input, if providied
        if (inputProps.placeholder != null) {
            return inputProps.placeholder;
        } else if (isStartBoundary) {
            return isInputFocused ? this.state.formattedMinDateString : "Start date";
        } else if (isEndBoundary) {
            return isInputFocused ? this.state.formattedMaxDateString : "End date";
        } else {
            return "";
        }
    };

    private getInputProps = (boundary: Boundary) => {
        return boundary === Boundary.START ? this.props.startInputProps : this.props.endInputProps;
    };

    private getInputRef = (boundary: Boundary) => {
        return boundary === Boundary.START ? this.refHandlers.startInputRef : this.refHandlers.endInputRef;
    };

    private getStateKeysAndValuesForBoundary = (boundary: Boundary): IStateKeysAndValuesObject => {
        const controlledRange = this.props.value;
        if (boundary === Boundary.START) {
            return {
                keys: {
                    hoverString: "startHoverString",
                    inputString: "startInputString",
                    isInputFocused: "isStartInputFocused",
                    selectedValue: "selectedStart",
                },
                values: {
                    controlledValue: controlledRange != null ? controlledRange[0] : undefined,
                    hoverString: this.state.startHoverString,
                    inputString: this.state.startInputString,
                    isInputFocused: this.state.isStartInputFocused,
                    selectedValue: this.state.selectedStart,
                },
            };
        } else {
            return {
                keys: {
                    hoverString: "endHoverString",
                    inputString: "endInputString",
                    isInputFocused: "isEndInputFocused",
                    selectedValue: "selectedEnd",
                },
                values: {
                    controlledValue: controlledRange != null ? controlledRange[1] : undefined,
                    hoverString: this.state.endHoverString,
                    inputString: this.state.endInputString,
                    isInputFocused: this.state.isEndInputFocused,
                    selectedValue: this.state.selectedEnd,
                },
            };
        }
    };

    private getDateRangeForCallback = (currDate: Date | null, currBoundary?: Boundary) => {
        const otherBoundary = this.getOtherBoundary(currBoundary);
        const otherDate = this.getStateKeysAndValuesForBoundary(otherBoundary).values.selectedValue;

        return currBoundary === Boundary.START ? [currDate, otherDate] : [otherDate, currDate];
    };

    private getOtherBoundary = (boundary?: Boundary) => {
        return boundary === Boundary.START ? Boundary.END : Boundary.START;
    };

    private doBoundaryDatesOverlap = (date: Date | null, boundary: Boundary) => {
        const { allowSingleDayRange } = this.props;
        const otherBoundary = this.getOtherBoundary(boundary);
        const otherBoundaryDate = this.getStateKeysAndValuesForBoundary(otherBoundary).values.selectedValue;
        if (date == null || otherBoundaryDate == null) {
            return false;
        }

        if (boundary === Boundary.START) {
            const isAfter = DayPicker.DateUtils.isDayAfter(date, otherBoundaryDate);
            return isAfter || (!allowSingleDayRange && DayPicker.DateUtils.isSameDay(date, otherBoundaryDate));
        } else {
            const isBefore = DayPicker.DateUtils.isDayBefore(date, otherBoundaryDate);
            return isBefore || (!allowSingleDayRange && DayPicker.DateUtils.isSameDay(date, otherBoundaryDate));
        }
    };

    /**
     * Returns true if the provided boundary is an END boundary overlapping the
     * selected start date. (If the boundaries overlap, we consider the END
     * boundary to be erroneous.)
     */
    private doesEndBoundaryOverlapStartBoundary = (boundaryDate: Date, boundary: Boundary) => {
        return boundary === Boundary.START ? false : this.doBoundaryDatesOverlap(boundaryDate, boundary);
    };

    private isControlled = () => this.props.value !== undefined;

    private isInputEmpty = (inputString: string) => inputString == null || inputString.length === 0;

    private isInputInErrorState = (boundary: Boundary) => {
        const values = this.getStateKeysAndValuesForBoundary(boundary).values;
        const { isInputFocused, hoverString, inputString, selectedValue } = values;
        if (hoverString != null || this.isInputEmpty(inputString)) {
            // don't show an error state while we're hovering over a valid date.
            return false;
        }

        const boundaryValue = isInputFocused ? this.parseDate(inputString) : selectedValue;
        return (
            boundaryValue != null &&
            (!this.isDateValidAndInRange(boundaryValue) ||
                this.doesEndBoundaryOverlapStartBoundary(boundaryValue, boundary))
        );
    };

    private isDateValidAndInRange = (date: Date | false | null): date is Date => {
        return isDateValid(date) && isDayInRange(date, [this.props.minDate, this.props.maxDate]);
    };

    private isNextDateRangeValid(nextDate: Date | false | null, boundary: Boundary): nextDate is Date {
        return this.isDateValidAndInRange(nextDate) && !this.doBoundaryDatesOverlap(nextDate, boundary);
    }

    // this is a slightly kludgy function, but it saves us a good amount of repeated code between
    // the constructor and componentDidUpdate.
    private getFormattedMinMaxDateString(props: IDateRangeInputProps, propName: "minDate" | "maxDate") {
        const date = props[propName];
        const defaultDate = DateRangeInput.defaultProps[propName];
        // default values are applied only if a prop is strictly `undefined`
        // See: https://facebook.github.io/react/docs/react-component.html#defaultprops
        return getFormattedDateString(date === undefined ? defaultDate : date, this.props);
    }

    private parseDate(dateString: string): Date | null {
        if (dateString === this.props.outOfRangeMessage || dateString === this.props.invalidDateMessage) {
            return null;
        }
        const { locale, parseDate } = this.props;
        const newDate = parseDate(dateString, locale);
        return newDate === false ? new Date(undefined) : newDate;
    }

    private formatDate(date: Date): string {
        if (!this.isDateValidAndInRange(date)) {
            return "";
        }
        const { locale, formatDate } = this.props;
        return formatDate(date, locale);
    }
}
