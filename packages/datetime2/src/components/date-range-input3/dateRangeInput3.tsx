/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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
import { isSameDay, isValid } from "date-fns";
import * as React from "react";

import {
    Boundary,
    Classes as CoreClasses,
    DISPLAYNAME_PREFIX,
    InputGroup,
    Intent,
    Popover,
    type PopoverClickTargetHandlers,
    type PopoverTargetProps,
    refHandler,
    setRef,
    Utils,
} from "@blueprintjs/core";
import {
    DatePickerUtils,
    type DateRange,
    type DateRangeShortcut,
    DateUtils,
    Errors,
    type NonNullDateRange,
} from "@blueprintjs/datetime";

import { Classes } from "../../classes";
import { getDateFnsFormatter, getDateFnsParser, getDefaultDateFnsFormat } from "../../common/dateFnsFormatUtils";
import { getLocaleCodeFromProps } from "../../common/dateFnsLocaleProps";
import { DateRangePicker3 } from "../date-range-picker3/dateRangePicker3";
import { DateFnsLocalizedComponent } from "../dateFnsLocalizedComponent";
import type {
    DateRangeInput3DefaultProps,
    DateRangeInput3Props,
    DateRangeInput3PropsWithDefaults,
} from "./dateRangeInput3Props";
import type { DateRangeInput3State } from "./dateRangeInput3State";

export type { DateRangeInput3Props };

// We handle events in a kind of generic way in this component, so here
// we enumerate all the different kinds of events for which we have handlers.
type InputEvent =
    | React.MouseEvent<HTMLInputElement>
    | React.KeyboardEvent<HTMLInputElement>
    | React.FocusEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLInputElement>;

interface StateKeysAndValuesObject {
    keys: {
        hoverString: "startHoverString" | "endHoverString";
        inputString: "startInputString" | "endInputString";
        isInputFocused: "isStartInputFocused" | "isEndInputFocused";
        selectedValue: "selectedStart" | "selectedEnd";
    };
    values: {
        controlledValue?: Date | null;
        hoverString?: string | null;
        inputString?: string;
        isInputFocused: boolean;
        selectedValue: Date | null;
    };
}

/**
 * Date range input (v3) component.
 *
 * @see https://blueprintjs.com/docs/#datetime2/date-range-input3
 */
export class DateRangeInput3 extends DateFnsLocalizedComponent<DateRangeInput3Props, DateRangeInput3State> {
    public static defaultProps: DateRangeInput3DefaultProps = {
        allowSingleDayRange: false,
        closeOnSelection: true,
        contiguousCalendarMonths: true,
        dayPickerProps: {},
        disabled: false,
        endInputProps: {},
        invalidDateMessage: "Invalid date",
        locale: "en-US",
        maxDate: DatePickerUtils.getDefaultMaxDate(),
        minDate: DatePickerUtils.getDefaultMinDate(),
        outOfRangeMessage: "Out of range",
        overlappingDatesMessage: "Overlapping dates",
        popoverProps: {},
        selectAllOnFocus: false,
        shortcuts: true,
        singleMonthOnly: false,
        startInputProps: {},
    };

    public static displayName = `${DISPLAYNAME_PREFIX}.DateRangeInput3`;

    public startInputElement: HTMLInputElement | null = null;

    public endInputElement: HTMLInputElement | null = null;

    private handleStartInputRef = refHandler<HTMLInputElement, "startInputElement">(
        this,
        "startInputElement",
        this.props.startInputProps?.inputRef,
    );

    private handleEndInputRef = refHandler<HTMLInputElement, "endInputElement">(
        this,
        "endInputElement",
        this.props.endInputProps?.inputRef,
    );

    public constructor(props: DateRangeInput3Props) {
        super(props);
        const [selectedStart, selectedEnd] = this.getInitialRange();
        this.state = {
            formattedMaxDateString: this.formatMinMaxDateString(props, "maxDate"),
            formattedMinDateString: this.formatMinMaxDateString(props, "minDate"),
            isEndInputFocused: false,
            isOpen: false,
            isStartInputFocused: false,
            locale: undefined,
            selectedEnd,
            selectedShortcutIndex: -1,
            selectedStart,
        };
    }

    public async componentDidMount() {
        await super.componentDidMount();
    }

    public async componentDidUpdate(prevProps: DateRangeInput3Props) {
        super.componentDidUpdate(prevProps);

        const { isStartInputFocused, isEndInputFocused, shouldSelectAfterUpdate } = this.state;

        if (prevProps.startInputProps?.inputRef !== this.props.startInputProps?.inputRef) {
            setRef(prevProps.startInputProps?.inputRef, null);
            this.handleStartInputRef = refHandler(this, "startInputElement", this.props.startInputProps?.inputRef);
            setRef(this.props.startInputProps?.inputRef, this.startInputElement);
        }
        if (prevProps.endInputProps?.inputRef !== this.props.endInputProps?.inputRef) {
            setRef(prevProps.endInputProps?.inputRef, null);
            this.handleEndInputRef = refHandler(this, "endInputElement", this.props.endInputProps?.inputRef);
            setRef(this.props.endInputProps?.inputRef, this.endInputElement);
        }

        const shouldFocusStartInput = this.shouldFocusInputRef(isStartInputFocused, this.startInputElement);
        const shouldFocusEndInput = this.shouldFocusInputRef(isEndInputFocused, this.endInputElement);

        if (shouldFocusStartInput) {
            this.startInputElement?.focus();
        } else if (shouldFocusEndInput) {
            this.endInputElement?.focus();
        }

        if (isStartInputFocused && shouldSelectAfterUpdate) {
            this.startInputElement?.select();
        } else if (isEndInputFocused && shouldSelectAfterUpdate) {
            this.endInputElement?.select();
        }

        let nextState: Partial<DateRangeInput3State> = {};

        if (this.props.value !== prevProps.value) {
            const [selectedStart, selectedEnd] = this.getInitialRange(this.props);
            nextState = {
                ...nextState,
                selectedEnd,
                selectedStart,
            };
        }

        // cache the formatted date strings to avoid computing on each render.
        if (this.props.minDate !== prevProps.minDate) {
            const formattedMinDateString = this.formatMinMaxDateString(this.props, "minDate");
            nextState = { ...nextState, formattedMinDateString };
        }
        if (this.props.maxDate !== prevProps.maxDate) {
            const formattedMaxDateString = this.formatMinMaxDateString(this.props, "maxDate");
            nextState = { ...nextState, formattedMaxDateString };
        }

        this.setState(nextState);
    }

    public render() {
        const { locale, selectedShortcutIndex } = this.state;
        const { popoverProps = {}, popoverRef } = this.props;

        const popoverContent = (
            <DateRangePicker3
                {...this.props}
                boundaryToModify={this.state.boundaryToModify}
                locale={locale ?? this.props.locale}
                onChange={this.handleDateRangePickerChange}
                onHoverChange={this.handleDateRangePickerHoverChange}
                onShortcutChange={this.handleShortcutChange}
                selectedShortcutIndex={selectedShortcutIndex}
                value={this.getSelectedRange()}
            />
        );

        // allow custom props for the popover and each input group, but pass them in an order that
        // guarantees only some props are overridable.
        return (
            <Popover
                isOpen={this.state.isOpen}
                placement="bottom-start"
                {...popoverProps}
                autoFocus={false}
                className={classNames(Classes.DATE_RANGE_INPUT, popoverProps.className, this.props.className)}
                content={popoverContent}
                enforceFocus={false}
                onClose={this.handlePopoverClose}
                popoverClassName={classNames(Classes.DATE_RANGE_INPUT_POPOVER, popoverProps.popoverClassName)}
                ref={popoverRef}
                renderTarget={this.renderTarget}
            />
        );
    }

    protected validateProps(props: DateRangeInput3Props) {
        if (props.value === null) {
            // throw a blocking error here because we don't handle a null value gracefully across this component
            // (it's not allowed by TS under strict null checks anyway)
            throw new Error(Errors.DATERANGEINPUT_NULL_VALUE);
        }
    }

    // We use the renderTarget API to flatten the rendered DOM.
    private renderTarget =
        // N.B. pull out `isOpen` so that it's not forwarded to the DOM.
        ({ isOpen, ...targetProps }: PopoverTargetProps & PopoverClickTargetHandlers) => {
            const { fill, popoverProps = {} } = this.props;
            const { targetTagName = "div" } = popoverProps;
            return React.createElement(
                targetTagName,
                {
                    ...targetProps,
                    className: classNames(CoreClasses.CONTROL_GROUP, targetProps.className, {
                        [CoreClasses.FILL]: fill,
                    }),
                },
                this.renderInputGroup(Boundary.START),
                this.renderInputGroup(Boundary.END),
            );
        };

    private renderInputGroup = (boundary: Boundary) => {
        const inputProps = this.getInputProps(boundary);
        const handleInputEvent = boundary === Boundary.START ? this.handleStartInputEvent : this.handleEndInputEvent;

        return (
            <InputGroup
                autoComplete="off"
                disabled={inputProps?.disabled ?? this.props.disabled}
                fill={this.props.fill}
                {...inputProps}
                intent={this.isInputInErrorState(boundary) ? Intent.DANGER : inputProps?.intent}
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

    // Callbacks - DateRangePicker3
    // ===========================

    private handleDateRangePickerChange = (selectedRange: DateRange, didSubmitWithEnter = false) => {
        // ignore mouse events in the date-range picker if the popover is animating closed.
        if (!this.state.isOpen) {
            return;
        }

        const [selectedStart, selectedEnd] = selectedRange;

        let isOpen = true;

        let isStartInputFocused: boolean | undefined;
        let isEndInputFocused: boolean | undefined;

        let startHoverString: string | null | undefined;
        let endHoverString: string | null | undefined;

        let boundaryToModify: Boundary | undefined;

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

        this.props.onChange?.(selectedRange);
    };

    private handleShortcutChange = (_: DateRangeShortcut, selectedShortcutIndex: number) => {
        this.setState({ selectedShortcutIndex });
    };

    private handleDateRangePickerHoverChange = (
        hoveredRange: DateRange | undefined,
        _hoveredDay: Date,
        hoveredBoundary: Boundary | undefined,
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

    private handleStartInputEvent = (e: InputEvent) => {
        this.handleInputEvent(e, Boundary.START);
    };

    private handleEndInputEvent = (e: InputEvent) => {
        this.handleInputEvent(e, Boundary.END);
    };

    private handleInputEvent = (e: InputEvent, boundary: Boundary) => {
        const inputProps = this.getInputProps(boundary);

        switch (e.type) {
            case "blur":
                this.handleInputBlur(e, boundary);
                inputProps?.onBlur?.(e as React.FocusEvent<HTMLInputElement>);
                break;
            case "change":
                this.handleInputChange(e, boundary);
                inputProps?.onChange?.(e as React.ChangeEvent<HTMLInputElement>);
                break;
            case "click":
                e = e as React.MouseEvent<HTMLInputElement>;
                this.handleInputClick(e);
                inputProps?.onClick?.(e);
                break;
            case "focus":
                this.handleInputFocus(e, boundary);
                inputProps?.onFocus?.(e as React.FocusEvent<HTMLInputElement>);
                break;
            case "keydown":
                e = e as React.KeyboardEvent<HTMLInputElement>;
                this.handleInputKeyDown(e);
                inputProps?.onKeyDown?.(e);
                break;
            case "mousedown":
                e = e as React.MouseEvent<HTMLInputElement>;
                this.handleInputMouseDown();
                inputProps?.onMouseDown?.(e);
                break;
            default:
                break;
        }
    };

    // add a keydown listener to persistently change focus when tabbing:
    // - if focused in start field, Tab moves focus to end field
    // - if focused in end field, Shift+Tab moves focus to start field
    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const isTabPressed = e.key === "Tab";
        const isEnterPressed = e.key === "Enter";
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
        const isValueControlled = this.isControlled();
        // We may be reacting to a programmatic focus triggered by componentDidUpdate() at a point when
        // values.selectedValue may not have been updated yet in controlled mode, so we must use values.controlledValue
        // in that case.
        const inputString = formatDateString(
            isValueControlled ? values.controlledValue : values.selectedValue,
            this.props,
            this.state.locale,
            true,
        );

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

        let nextState: Partial<DateRangeInput3State> = {
            [keys.isInputFocused]: false,
            shouldSelectAfterUpdate: false,
        };

        if (this.isInputEmpty(values.inputString)) {
            if (isValueControlled) {
                nextState = {
                    ...nextState,
                    [keys.inputString]: formatDateString(values.controlledValue, this.props, this.state.locale),
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
            this.props.onError?.(this.getDateRangeForCallback(maybeNextDate, boundary));
        }

        this.setState(nextState);
    };

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>, boundary: Boundary) => {
        const inputString = (e.target as HTMLInputElement).value;

        const { keys } = this.getStateKeysAndValuesForBoundary(boundary);
        const maybeNextDate = this.parseDate(inputString);
        const isValueControlled = this.isControlled();

        let nextState: Partial<DateRangeInput3State> = { shouldSelectAfterUpdate: false };

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
            this.props.onChange?.(this.getDateRangeForCallback(null, boundary));
        } else if (this.isDateValidAndInRange(maybeNextDate)) {
            // note that error cases that depend on both fields (e.g. overlapping dates) should fall
            // through into this block so that the UI can update immediately, possibly with an error
            // message on the other field.
            // also, clear the hover string to ensure the most recent keystroke appears.
            const baseState: Partial<DateRangeInput3State> = {
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
                this.props.onChange?.(this.getDateRangeForCallback(maybeNextDate, boundary));
            }
        } else {
            // again, clear the hover string to ensure the most recent keystroke appears
            nextState = { ...nextState, [keys.inputString]: inputString, [keys.hoverString]: null };
        }

        this.setState(nextState);
    };

    // Callbacks - Popover
    // ===================

    private handlePopoverClose = (event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ isOpen: false });
        this.props.popoverProps?.onClose?.(event);
    };

    // Helpers
    // =======

    private shouldFocusInputRef(isFocused: boolean, inputRef: HTMLInputElement | null) {
        return isFocused && inputRef != null && Utils.getActiveElement(this.startInputElement) !== inputRef;
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
                DateUtils.isSameTime(selectedStart, nextSelectedStart) &&
                DateUtils.isSameTime(selectedEnd, nextSelectedEnd)
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

    private getSelectedRange = (fallbackRange?: NonNullDateRange) => {
        let selectedStart: Date | null;
        let selectedEnd: Date | null;

        if (this.isControlled()) {
            [selectedStart, selectedEnd] = this.props.value!;
        } else {
            selectedStart = this.state.selectedStart;
            selectedEnd = this.state.selectedEnd;
        }

        // this helper function checks if the provided boundary date *would* overlap the selected
        // other boundary date. providing the already-selected start date simply tells us if we're
        // currently in an overlapping state.
        const doBoundaryDatesOverlap = this.doBoundaryDatesOverlap(selectedStart, Boundary.START);
        const dateRange = [selectedStart, doBoundaryDatesOverlap ? undefined : selectedEnd];

        return dateRange.map((selectedBound: Date | null | undefined, index: number) => {
            const fallbackDate = fallbackRange != null ? fallbackRange[index] : undefined;
            return this.isDateValidAndInRange(selectedBound ?? null) ? selectedBound : fallbackDate;
        }) as DateRange;
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
            return formatDateString(selectedValue, this.props, this.state.locale);
        }
    };

    private getInputPlaceholderString = (boundary: Boundary) => {
        const isStartBoundary = boundary === Boundary.START;
        const isEndBoundary = boundary === Boundary.END;

        const inputProps = this.getInputProps(boundary);
        const { isInputFocused } = this.getStateKeysAndValuesForBoundary(boundary).values;

        // use the custom placeholder text for the input, if providied
        if (inputProps?.placeholder != null) {
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
        return boundary === Boundary.START ? this.handleStartInputRef : this.handleEndInputRef;
    };

    private getStateKeysAndValuesForBoundary = (boundary: Boundary): StateKeysAndValuesObject => {
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

    private getDateRangeForCallback = (currDate: Date | null, currBoundary?: Boundary): DateRange => {
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
            const isAfter = date > otherBoundaryDate;
            return isAfter || (!allowSingleDayRange && isSameDay(date, otherBoundaryDate));
        } else {
            const isBefore = date < otherBoundaryDate;
            return isBefore || (!allowSingleDayRange && isSameDay(date, otherBoundaryDate));
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

    private isInputEmpty = (inputString: string | undefined) => inputString == null || inputString.length === 0;

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

    private isDateValidAndInRange = (date: Date | null): date is Date => {
        // min/max dates defined in defaultProps
        return isValid(date) && DateUtils.isDayInRange(date, [this.props.minDate!, this.props.maxDate!]);
    };

    private isNextDateRangeValid(nextDate: Date | null, boundary: Boundary): nextDate is Date {
        return this.isDateValidAndInRange(nextDate) && !this.doBoundaryDatesOverlap(nextDate, boundary);
    }

    // this is a slightly kludgy function, but it saves us a good amount of repeated code between
    // the constructor and componentDidUpdate.
    private formatMinMaxDateString = (props: DateRangeInput3Props, propName: "minDate" | "maxDate") => {
        const date = props[propName];

        // N.B. default values are applied only if a prop is strictly `undefined`
        // See: https://facebook.github.io/react/docs/react-component.html#defaultprops
        const defaultDate = DateRangeInput3.defaultProps[propName];

        // N.B. this.state will be undefined in the constructor, so we need a fallback in that case
        const maybeLocale = this.state?.locale ?? typeof props.locale === "string" ? undefined : props.locale;

        return formatDateString(date ?? defaultDate, this.props, maybeLocale);
    };

    private parseDate = (dateString: string | undefined): Date | null => {
        if (
            dateString === undefined ||
            dateString === this.props.outOfRangeMessage ||
            dateString === this.props.invalidDateMessage
        ) {
            return null;
        }

        // HACKHACK: this code below is largely copied from the `useDateParser()` hook, which is the preferred
        // implementation that we can migrate to once DateRangeInput3 is a function component.
        const { dateFnsFormat, locale: localeFromProps, parseDate, timePickerProps, timePrecision } = this.props;
        const { locale } = this.state;
        let newDate: false | Date | null = null;

        if (parseDate !== undefined) {
            // user-provided date parser
            newDate = parseDate(dateString, locale?.code ?? getLocaleCodeFromProps(localeFromProps));
        } else {
            // use user-provided date-fns format or one of the default formats inferred from time picker props
            const format = dateFnsFormat ?? getDefaultDateFnsFormat({ timePickerProps, timePrecision });
            newDate = getDateFnsParser(format, locale)(dateString);
        }

        return newDate === false ? new Date() : newDate;
    };

    // called on date hover & selection
    private formatDate = (date: Date | null): string => {
        if (!this.isDateValidAndInRange(date)) {
            return "";
        }

        // HACKHACK: the code below is largely copied from the `useDateFormatter()` hook, which is the preferred
        // implementation that we can migrate to once DateRangeInput3 is a function component.
        const { dateFnsFormat, formatDate, locale: localeFromProps, timePickerProps, timePrecision } = this.props;
        const { locale } = this.state;

        if (formatDate !== undefined) {
            // user-provided date formatter
            return formatDate(date, locale?.code ?? getLocaleCodeFromProps(localeFromProps));
        } else {
            // use user-provided date-fns format or one of the default formats inferred from time picker props
            const format = dateFnsFormat ?? getDefaultDateFnsFormat({ timePickerProps, timePrecision });
            return getDateFnsFormatter(format, locale)(date);
        }
    };
}

// called on initial construction, input focus & blur, and the standard input render path
function formatDateString(
    date: Date | false | null | undefined,
    props: DateRangeInput3Props,
    locale: Locale | undefined,
    ignoreRange = false,
) {
    const { invalidDateMessage, maxDate, minDate, outOfRangeMessage } = props as DateRangeInput3PropsWithDefaults;

    if (date == null) {
        return "";
    } else if (!DateUtils.isDateValid(date)) {
        return invalidDateMessage;
    } else if (ignoreRange || DateUtils.isDayInRange(date, [minDate, maxDate])) {
        // HACKHACK: the code below is largely copied from the `useDateFormatter()` hook, which is the preferred
        // implementation that we can migrate to once DateRangeInput3 is a function component.
        const { dateFnsFormat, formatDate, locale: localeFromProps, timePickerProps, timePrecision } = props;
        if (formatDate !== undefined) {
            // user-provided date formatter
            return formatDate(date, locale?.code ?? getLocaleCodeFromProps(localeFromProps));
        } else {
            // use user-provided date-fns format or one of the default formats inferred from time picker props
            const format = dateFnsFormat ?? getDefaultDateFnsFormat({ timePickerProps, timePrecision });
            return getDateFnsFormatter(format, locale)(date);
        }
    } else {
        return outOfRangeMessage;
    }
}
