/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import {
    AbstractComponent,
    Classes,
    HTMLInputProps,
    IIntentProps,
    IProps,
    Keys,
    Position,
    removeNonHTMLProps,
    Utils,
} from "../../common";
import * as Errors from "../../common/errors";

import { Button } from "../button/buttons";
import { InputGroup } from "./inputGroup";

export interface INumericInputProps extends IIntentProps, IProps {

    /**
     * The position of the buttons with respect to the input field.
     * @default Position.RIGHT
     */
    buttonPosition?: Position.LEFT | Position.RIGHT | "none";

    /**
     * Whether the input is in a non-interactive state.
     * @default false
     */
    disabled?: boolean;

    /** The name of icon (the part after `pt-icon-`) to render on left side of input. */
    leftIconName?: string;

    /** The placeholder text in the absence of any value. */
    placeholder?: string;

    /**
     * The increment between successive values when `shift` is held.
     * @default 10
     */
    majorStepSize?: number;

    /** The maximum value of the input. */
    max?: number;

    /** The minimum value of the input. */
    min?: number;

    /**
     * The increment between successive values when `alt` is held.
     * @default 0.1
     */
    minorStepSize?: number;

    /**
     * The increment between successive values when no modifier keys are held.
     * @default 1
     */
    stepSize?: number;

    /** The value to display in the input field. */
    value?: number | string;

    /** The callback invoked when the value changes. */
    onValueChange?(valueAsNumber: number, valueAsString: string): void;
}

export interface INumericInputState {
    isInputGroupFocused?: boolean;
    isButtonGroupFocused?: boolean;
    shouldSelectAfterUpdate?: boolean;
    value?: string;
}

enum IncrementDirection {
    DOWN = -1,
    UP = +1,
}

@PureRender
export class NumericInput extends AbstractComponent<HTMLInputProps & INumericInputProps, INumericInputState> {
    public static displayName = "Blueprint.NumericInput";

    public static defaultProps: INumericInputProps = {
        buttonPosition: Position.RIGHT,
        majorStepSize: 10,
        minorStepSize: 0.1,
        stepSize: 1,
        value: NumericInput.VALUE_EMPTY,
    };

    private static DECREMENT_KEY = "decrement";
    private static INCREMENT_KEY = "increment";

    private static DECREMENT_ICON_NAME = "chevron-down";
    private static INCREMENT_ICON_NAME = "chevron-up";

    private static VALUE_EMPTY = "";
    private static VALUE_ZERO = "0";

    private inputElement: HTMLInputElement;

    public constructor(props?: HTMLInputProps & INumericInputProps, context?: any) {
        super(props, context);

        this.state = {
            shouldSelectAfterUpdate: false,
            value: this.getValueOrEmptyValue(props.value),
        };
    }

    public componentWillReceiveProps(nextProps: HTMLInputProps & INumericInputProps) {
        super.componentWillReceiveProps(nextProps);

        const value = this.getValueOrEmptyValue(nextProps.value);

        const didMinChange = nextProps.min !== this.props.min;
        const didMaxChange = nextProps.max !== this.props.max;
        const didBoundsChange = didMinChange || didMaxChange;

        // if a new min and max were provided that cause the existing value to fall
        // outside of the new bounds, then clamp the value to the new valid range.
        if (didBoundsChange) {
            const sanitizedValue = (value !== NumericInput.VALUE_EMPTY)
                ? this.getSanitizedValue(value, /* delta */ 0, nextProps.min, nextProps.max)
                : NumericInput.VALUE_EMPTY;
            this.setState({ value: sanitizedValue, shouldSelectAfterUpdate: true });
        } else {
            this.setState({ value, shouldSelectAfterUpdate: true });
        }
    }

    public render() {
        const { buttonPosition, className } = this.props;
        const inputGroup = (
            <InputGroup
                {...removeNonHTMLProps(this.props)}
                intent={this.props.intent}
                inputRef={this.inputRef}
                key="input-group"
                leftIconName={this.props.leftIconName}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleInputChange}
                onKeyDown={this.handleInputKeyDown}
                value={this.state.value}
            />
        );

        // the strict null check here is intentional; an undefined value should
        // fall back to the default button position on the right side.
        if (buttonPosition === "none" || buttonPosition === null) {
            // If there are no buttons, then the control group will render the
            // text field with squared border-radii on the left side, causing it
            // to look weird. This problem goes away if we simply don't nest within
            // a control group.
            return (
                <div className={className}>
                    {inputGroup}
                </div>
            );
        } else {
            const incrementButton = this.renderButton(
                NumericInput.INCREMENT_KEY, NumericInput.INCREMENT_ICON_NAME, this.handleIncrementButtonClick);
            const decrementButton = this.renderButton(
                NumericInput.DECREMENT_KEY, NumericInput.DECREMENT_ICON_NAME, this.handleDecrementButtonClick);

            const buttonGroup = (
                <div key="button-group" className={classNames(Classes.BUTTON_GROUP, Classes.VERTICAL)}>
                    {incrementButton}
                    {decrementButton}
                </div>
            );

            const inputElems = (buttonPosition === Position.LEFT)
                ? [buttonGroup, inputGroup]
                : [inputGroup, buttonGroup];

            return (
                <div className={classNames(Classes.NUMERIC_INPUT, Classes.CONTROL_GROUP, className)}>
                    {inputElems}
                </div>
            );
        }
    }

    public componentDidUpdate() {
        if (this.state.shouldSelectAfterUpdate) {
            this.inputElement.setSelectionRange(0, this.state.value.length);
        }
    }

    protected validateProps(nextProps: HTMLInputProps & INumericInputProps) {
        const { majorStepSize, max, min, minorStepSize, stepSize } = nextProps;
        if (min && max && min >= max) {
            throw new Error(Errors.NUMERIC_INPUT_MIN_MAX);
        }
        if (stepSize == null) {
            throw new Error(Errors.NUMERIC_INPUT_STEP_SIZE_NULL);
        }
        if (stepSize <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE);
        }
        if (minorStepSize && minorStepSize <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE);
        }
        if (majorStepSize && majorStepSize <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE);
        }
        if (minorStepSize && minorStepSize > stepSize) {
            throw new Error(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND);
        }
        if (majorStepSize && majorStepSize < stepSize) {
            throw new Error(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND);
        }
    }

    // Render Helpers
    // ==============

    private renderButton(key: string, iconName: string, onClick: React.MouseEventHandler<HTMLElement>) {
        // respond explicitly on key *up*, because onKeyDown triggers multiple
        // times and doesn't always receive modifier-key flags, leading to an
        // unintuitive/out-of-control incrementing experience.
        const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
            this.handleButtonKeyUp(e, onClick);
        };
        return (
            <Button
                disabled={this.props.disabled || this.props.readOnly}
                iconName={iconName}
                intent={this.props.intent}
                key={key}
                onBlur={this.handleButtonBlur}
                onClick={onClick}
                onFocus={this.handleButtonFocus}
                onKeyUp={onKeyUp}
            />
        );
    }

    private inputRef = (input: HTMLInputElement) => {
        this.inputElement = input;
    }

    // Callbacks - Buttons
    // ===================

    private handleDecrementButtonClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const delta = this.getIncrementDelta(IncrementDirection.DOWN, e.shiftKey, e.altKey);
        this.incrementValue(delta);
    }

    private handleIncrementButtonClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const delta = this.getIncrementDelta(IncrementDirection.UP, e.shiftKey, e.altKey);
        this.incrementValue(delta);
    }

    private handleButtonFocus = () => {
        this.setState({ isButtonGroupFocused: true });
    }

    private handleButtonBlur = () => {
        this.setState({ isButtonGroupFocused: false });
    }

    private handleButtonKeyUp =
        (e: React.KeyboardEvent<HTMLInputElement>, onClick: React.MouseEventHandler<HTMLInputElement>) => {

        if (e.keyCode === Keys.SPACE || e.keyCode === Keys.ENTER) {
            // prevent the page from scrolling (this is the default browser
            // behavior for shift + space or alt + space).
            e.preventDefault();

            // trigger a click event to update the input value appropriately,
            // based on the active modifier keys.
            const fakeClickEvent = {
                altKey: e.altKey,
                currentTarget: e.currentTarget,
                shiftKey: e.shiftKey,
                target: e.target,
            };
            onClick(fakeClickEvent as React.MouseEvent<HTMLInputElement>);
        }
    }

    // Callbacks - Input
    // =================

    private handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        this.setState({ isInputGroupFocused: true });
        Utils.safeInvoke(this.props.onFocus, e);
    }

    private handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        this.setState({ isInputGroupFocused: false });
        Utils.safeInvoke(this.props.onBlur, e);
    }

    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.disabled || this.props.readOnly) {
            return;
        }

        const { keyCode } = e;

        let direction: IncrementDirection;

        if (keyCode === Keys.ARROW_UP) {
            direction = IncrementDirection.UP;
        } else if (keyCode === Keys.ARROW_DOWN) {
            direction = IncrementDirection.DOWN;
        }

        if (direction != null) {
            // when the input field has focus, some key combinations will modify
            // the field's selection range. we'll actually want to select all
            // text in the field after we modify the value on the following
            // lines. preventing the default selection behavior lets us do that
            // without interference.
            e.preventDefault();

            const delta = this.getIncrementDelta(direction, e.shiftKey, e.altKey);
            this.incrementValue(delta);
        }

        Utils.safeInvoke(this.props.onKeyDown, e);
    }

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const nextValue = (e.target as HTMLInputElement).value;
        this.setState({ shouldSelectAfterUpdate : false, value: nextValue });
        this.invokeOnChangeCallbacks(nextValue);
    }

    private invokeOnChangeCallbacks(value: string) {
        const valueAsString = value;
        const valueAsNumber = +value; // coerces non-numeric strings to NaN
        Utils.safeInvoke(this.props.onValueChange, valueAsNumber, valueAsString);
    }

    // Value Helpers
    // =============

    private incrementValue(delta: number/*, e: React.FormEvent<HTMLInputElement>*/) {
        // pretend we're incrementing from 0 if currValue is empty
        const currValue = this.state.value || NumericInput.VALUE_ZERO;
        const nextValue = this.getSanitizedValue(currValue, delta, this.props.min, this.props.max);

        this.setState({ shouldSelectAfterUpdate : true, value: nextValue });
        this.invokeOnChangeCallbacks(nextValue);
    }

    private getIncrementDelta(direction: IncrementDirection, isShiftKeyPressed: boolean, isAltKeyPressed: boolean) {
        const { majorStepSize, minorStepSize, stepSize } = this.props;

        if (isShiftKeyPressed && majorStepSize != null) {
            return direction * majorStepSize;
        } else if (isAltKeyPressed && minorStepSize != null) {
            return direction * minorStepSize;
        } else {
            return direction * stepSize;
        }
    }

    private getSanitizedValue(value: string, delta: number = 0, min: number, max: number) {
        if (!this.isValueNumeric(value)) {
            return NumericInput.VALUE_EMPTY;
        }

        // truncate floating-point result to avoid precision issues when adding
        // non-integer, binary-unfriendly deltas like 0.1
        let nextValue = parseFloat((parseFloat(value) + delta).toFixed(2));

        // defaultProps won't work if the user passes in null, so just default
        // to +/- infinity here instead, as a catch-all.
        const adjustedMin = (min != null) ? min : -Infinity;
        const adjustedMax = (max != null) ? max : Infinity;
        nextValue = Utils.clamp(nextValue, adjustedMin, adjustedMax);

        return nextValue.toString();
    }

    private getValueOrEmptyValue(value: number | string) {
        return (value != null) ? value.toString() : NumericInput.VALUE_EMPTY;
    }

    private isValueNumeric(value: string) {
        // checking if a string is numeric in Typescript is a big pain, because
        // we can't simply toss a string parameter to isFinite. below is the
        // essential approach that jQuery uses, which involves subtracting a
        // parsed numeric value from the string representation of the value. we
        // need to cast the value to the `any` type to allow this operation
        // between dissimilar types.
        return value != null && ((value as any) - parseFloat(value) + 1) >= 0;
    }
}

export const NumericInputFactory = React.createFactory(NumericInput);
