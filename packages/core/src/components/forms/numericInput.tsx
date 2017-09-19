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
    IconName,
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
     * Whether to allow only floating-point number characters in the field,
     * mimicking the native `input[type="number"]`.
     * @default true
     */
    allowNumericCharactersOnly?: boolean;

    /**
     * The position of the buttons with respect to the input field.
     * @default Position.RIGHT
     */
    buttonPosition?: Position.LEFT | Position.RIGHT | "none";

    /**
     * Whether the value should be clamped to `[min, max]` on blur.
     * The value will be clamped to each bound only if the bound is defined.
     * Note that native `input[type="number"]` controls do *NOT* clamp on blur.
     * @default false
     */
    clampValueOnBlur?: boolean;

    /**
     * Whether the input is non-interactive.
     * @default false
     */
    disabled?: boolean;

    /**
     * If set to `true`, the input will display with larger styling.
     * This is equivalent to setting `pt-large` via className on the
     * parent `.pt-control-group` and on the child `.pt-input-group`.
     * @default false
     */
    large?: boolean;

    /**
     * Name of the icon (the part after `pt-icon-`) to render
     * on the left side of input.
     */
    leftIconName?: IconName;

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
     * Whether the entire text field should be selected on focus.
     * @default false
     */
    selectAllOnFocus?: boolean;

    /**
     * Whether the entire text field should be selected on increment.
     * @default false
     */
    selectAllOnIncrement?: boolean;

    /**
     * The increment between successive values when no modifier keys are held.
     * @default 1
     */
    stepSize?: number;

    /** The value to display in the input field. */
    value?: number | string;

    /** The callback invoked when the value changes due to a button click. */
    onButtonClick?(valueAsNumber: number, valueAsString: string): void;

    /** The callback invoked when the value changes due to typing, arrow keys, or button clicks. */
    onValueChange?(valueAsNumber: number, valueAsString: string): void;
}

export interface INumericInputState {
    isInputGroupFocused?: boolean;
    isButtonGroupFocused?: boolean;
    shouldSelectAfterUpdate?: boolean;
    stepMaxPrecision?: number;
    value?: string;
}

enum IncrementDirection {
    DOWN = -1,
    UP = +1,
}

@PureRender
export class NumericInput extends AbstractComponent<HTMLInputProps & INumericInputProps, INumericInputState> {
    public static displayName = "Blueprint.NumericInput";

    public static VALUE_EMPTY = "";
    public static VALUE_ZERO = "0";

    public static defaultProps: INumericInputProps = {
        allowNumericCharactersOnly: true,
        buttonPosition: Position.RIGHT,
        clampValueOnBlur: false,
        large: false,
        majorStepSize: 10,
        minorStepSize: 0.1,
        selectAllOnFocus: false,
        selectAllOnIncrement: false,
        stepSize: 1,
        value: NumericInput.VALUE_EMPTY,
    };

    private static DECREMENT_KEY = "decrement";
    private static INCREMENT_KEY = "increment";

    private static DECREMENT_ICON_NAME: IconName = "chevron-down";
    private static INCREMENT_ICON_NAME: IconName = "chevron-up";

    /**
     * A regex that matches a string of length 1 (i.e. a standalone character)
     * if and only if it is a floating-point number character as defined by W3C:
     * https://www.w3.org/TR/2012/WD-html-markup-20120329/datatypes.html#common.data.float
     *
     * Floating-point number characters are the only characters that can be
     * printed within a default input[type="number"]. This component should
     * behave the same way when this.props.allowNumericCharactersOnly = true.
     * See here for the input[type="number"].value spec:
     * https://www.w3.org/TR/2012/WD-html-markup-20120329/input.number.html#input.number.attrs.value
     */
    private static FLOATING_POINT_NUMBER_CHARACTER_REGEX = /^[Ee0-9\+\-\.]$/;

    private inputElement: HTMLInputElement;

    // updating these flags need not trigger re-renders, so don't include them in this.state.
    private didPasteEventJustOccur = false;
    private shouldSelectAfterUpdate = false;

    public constructor(props?: HTMLInputProps & INumericInputProps, context?: any) {
        super(props, context);
        this.state = {
            stepMaxPrecision: this.getStepMaxPrecision(props),
            value: this.getValueOrEmptyValue(props.value),
        };
    }

    public componentWillReceiveProps(nextProps: HTMLInputProps & INumericInputProps) {
        super.componentWillReceiveProps(nextProps);

        const value = this.getValueOrEmptyValue(nextProps.value);

        const didMinChange = nextProps.min !== this.props.min;
        const didMaxChange = nextProps.max !== this.props.max;
        const didBoundsChange = didMinChange || didMaxChange;

        const sanitizedValue =
            value !== NumericInput.VALUE_EMPTY
                ? this.getSanitizedValue(value, /* delta */ 0, nextProps.min, nextProps.max)
                : NumericInput.VALUE_EMPTY;

        const stepMaxPrecision = this.getStepMaxPrecision(nextProps);

        // if a new min and max were provided that cause the existing value to fall
        // outside of the new bounds, then clamp the value to the new valid range.
        if (didBoundsChange && sanitizedValue !== this.state.value) {
            this.setState({ stepMaxPrecision, value: sanitizedValue });
            this.invokeValueCallback(sanitizedValue, this.props.onValueChange);
        } else {
            this.setState({ stepMaxPrecision, value });
        }
    }

    public render() {
        const { buttonPosition, className, large } = this.props;

        const inputGroupHtmlProps = removeNonHTMLProps(
            this.props,
            [
                "allowNumericCharactersOnly",
                "buttonPosition",
                "clampValueOnBlur",
                "className",
                "large",
                "majorStepSize",
                "minorStepSize",
                "onButtonClick",
                "onValueChange",
                "selectAllOnFocus",
                "selectAllOnIncrement",
                "stepSize",
            ],
            true,
        );

        const inputGroup = (
            <InputGroup
                autoComplete="off"
                {...inputGroupHtmlProps}
                className={classNames({ [Classes.LARGE]: large })}
                intent={this.props.intent}
                inputRef={this.inputRef}
                key="input-group"
                leftIconName={this.props.leftIconName}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleInputChange}
                onKeyDown={this.handleInputKeyDown}
                onKeyPress={this.handleInputKeyPress}
                onPaste={this.handleInputPaste}
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
            return <div className={className}>{inputGroup}</div>;
        } else {
            const incrementButton = this.renderButton(
                NumericInput.INCREMENT_KEY,
                NumericInput.INCREMENT_ICON_NAME,
                this.handleIncrementButtonClick,
            );
            const decrementButton = this.renderButton(
                NumericInput.DECREMENT_KEY,
                NumericInput.DECREMENT_ICON_NAME,
                this.handleDecrementButtonClick,
            );

            const buttonGroup = (
                <div key="button-group" className={classNames(Classes.BUTTON_GROUP, Classes.VERTICAL, Classes.FIXED)}>
                    {incrementButton}
                    {decrementButton}
                </div>
            );

            const inputElems = buttonPosition === Position.LEFT ? [buttonGroup, inputGroup] : [inputGroup, buttonGroup];

            const classes = classNames(
                Classes.NUMERIC_INPUT,
                Classes.CONTROL_GROUP,
                {
                    [Classes.LARGE]: large,
                },
                className,
            );

            return <div className={classes}>{inputElems}</div>;
        }
    }

    public componentDidUpdate() {
        if (this.shouldSelectAfterUpdate) {
            this.inputElement.setSelectionRange(0, this.state.value.length);
        }
    }

    protected validateProps(nextProps: HTMLInputProps & INumericInputProps) {
        const { majorStepSize, max, min, minorStepSize, stepSize } = nextProps;
        if (min != null && max != null && min >= max) {
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

    private renderButton(key: string, iconName: IconName, onClick: React.MouseEventHandler<HTMLElement>) {
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
    };

    // Callbacks - Buttons
    // ===================

    private handleDecrementButtonClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const delta = this.getIncrementDelta(IncrementDirection.DOWN, e.shiftKey, e.altKey);
        const nextValue = this.incrementValue(delta);
        this.invokeValueCallback(nextValue, this.props.onButtonClick);
    };

    private handleIncrementButtonClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const delta = this.getIncrementDelta(IncrementDirection.UP, e.shiftKey, e.altKey);
        const nextValue = this.incrementValue(delta);
        this.invokeValueCallback(nextValue, this.props.onButtonClick);
    };

    private handleButtonFocus = () => {
        this.setState({ isButtonGroupFocused: true });
    };

    private handleButtonBlur = () => {
        this.setState({ isButtonGroupFocused: false });
    };

    private handleButtonKeyUp = (
        e: React.KeyboardEvent<HTMLInputElement>,
        onClick: React.MouseEventHandler<HTMLInputElement>,
    ) => {
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
    };

    // Callbacks - Input
    // =================

    private handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        this.shouldSelectAfterUpdate = this.props.selectAllOnFocus;
        this.setState({ isInputGroupFocused: true });
        Utils.safeInvoke(this.props.onFocus, e);
    };

    private handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // explicitly set `shouldSelectAfterUpdate` to `false` to prevent focus
        // hoarding on IE11 (#704)
        this.shouldSelectAfterUpdate = false;

        const baseStateChange: INumericInputState = { isInputGroupFocused: false };
        if (this.props.clampValueOnBlur) {
            const value = (e.target as HTMLInputElement).value;
            const sanitizedValue = this.getSanitizedValue(value);
            this.setState({ ...baseStateChange, value: sanitizedValue });
            if (value !== sanitizedValue) {
                this.invokeValueCallback(sanitizedValue, this.props.onValueChange);
            }
        } else {
            this.setState(baseStateChange);
        }

        Utils.safeInvoke(this.props.onBlur, e);
    };

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
    };

    private handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // we prohibit keystrokes in onKeyPress instead of onKeyDown, because
        // e.key is not trustworthy in onKeyDown in all browsers.
        if (this.props.allowNumericCharactersOnly && this.isKeyboardEventDisabledForBasicNumericEntry(e)) {
            e.preventDefault();
        }

        Utils.safeInvoke(this.props.onKeyPress, e);
    };

    private handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        this.didPasteEventJustOccur = true;
        Utils.safeInvoke(this.props.onPaste, e);
    };

    private handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).value;

        let nextValue: string;

        if (this.props.allowNumericCharactersOnly && this.didPasteEventJustOccur) {
            this.didPasteEventJustOccur = false;
            const valueChars = value.split("");
            const sanitizedValueChars = valueChars.filter(this.isFloatingPointNumericCharacter);
            const sanitizedValue = sanitizedValueChars.join("");
            nextValue = sanitizedValue;
        } else {
            nextValue = value;
        }

        this.shouldSelectAfterUpdate = false;
        this.setState({ value: nextValue });
        this.invokeValueCallback(nextValue, this.props.onValueChange);
    };

    private invokeValueCallback(value: string, callback: (valueAsNumber: number, valueAsString: string) => void) {
        Utils.safeInvoke(callback, +value, value);
    }

    // Value Helpers
    // =============

    private incrementValue(delta: number) {
        // pretend we're incrementing from 0 if currValue is empty
        const currValue = this.state.value || NumericInput.VALUE_ZERO;
        const nextValue = this.getSanitizedValue(currValue, delta);

        this.shouldSelectAfterUpdate = this.props.selectAllOnIncrement;
        this.setState({ value: nextValue });
        this.invokeValueCallback(nextValue, this.props.onValueChange);

        return nextValue;
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

    private getSanitizedValue(value: string, delta = 0, min = this.props.min, max = this.props.max) {
        if (!this.isValueNumeric(value)) {
            return NumericInput.VALUE_EMPTY;
        }

        let nextValue = this.toMaxPrecision(parseFloat(value) + delta);

        // defaultProps won't work if the user passes in null, so just default
        // to +/- infinity here instead, as a catch-all.
        const adjustedMin = min != null ? min : -Infinity;
        const adjustedMax = max != null ? max : Infinity;
        nextValue = Utils.clamp(nextValue, adjustedMin, adjustedMax);

        return nextValue.toString();
    }

    private getValueOrEmptyValue(value: number | string) {
        return value != null ? value.toString() : NumericInput.VALUE_EMPTY;
    }

    private isValueNumeric(value: string) {
        // checking if a string is numeric in Typescript is a big pain, because
        // we can't simply toss a string parameter to isFinite. below is the
        // essential approach that jQuery uses, which involves subtracting a
        // parsed numeric value from the string representation of the value. we
        // need to cast the value to the `any` type to allow this operation
        // between dissimilar types.
        return value != null && (value as any) - parseFloat(value) + 1 >= 0;
    }

    private isKeyboardEventDisabledForBasicNumericEntry(e: React.KeyboardEvent<HTMLInputElement>) {
        // unit tests may not include e.key. don't bother disabling those events.
        if (e.key == null) {
            return false;
        }

        // allow modified key strokes that may involve letters and other
        // non-numeric/invalid characters (Cmd + A, Cmd + C, Cmd + V, Cmd + X).
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return false;
        }

        // keys that print a single character when pressed have a `key` name of
        // length 1. every other key has a longer `key` name (e.g. "Backspace",
        // "ArrowUp", "Shift"). since none of those keys can print a character
        // to the field--and since they may have important native behaviors
        // beyond printing a character--we don't want to disable their effects.
        const isSingleCharKey = e.key.length === 1;
        if (!isSingleCharKey) {
            return false;
        }

        // now we can simply check that the single character that wants to be printed
        // is a floating-point number character that we're allowed to print.
        return !this.isFloatingPointNumericCharacter(e.key);
    }

    private isFloatingPointNumericCharacter(char: string) {
        return NumericInput.FLOATING_POINT_NUMBER_CHARACTER_REGEX.test(char);
    }

    private getStepMaxPrecision(props: HTMLInputProps & INumericInputProps) {
        if (props.minorStepSize != null) {
            return Utils.countDecimalPlaces(props.minorStepSize);
        } else {
            return Utils.countDecimalPlaces(props.stepSize);
        }
    }

    private toMaxPrecision(value: number) {
        // round the value to have the specified maximum precision (toFixed is the wrong choice,
        // because it would show trailing zeros in the decimal part out to the specified precision)
        // source: http://stackoverflow.com/a/18358056/5199574
        const scaleFactor = Math.pow(10, this.state.stepMaxPrecision);
        return Math.round(value * scaleFactor) / scaleFactor;
    }
}

export const NumericInputFactory = React.createFactory(NumericInput);
