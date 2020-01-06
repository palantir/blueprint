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
import { polyfill } from "react-lifecycles-compat";

import { IconName } from "@blueprintjs/icons";
import {
    AbstractPureComponent2,
    Classes,
    DISPLAYNAME_PREFIX,
    HTMLInputProps,
    IIntentProps,
    IProps,
    Keys,
    MaybeElement,
    Position,
    removeNonHTMLProps,
    Utils,
} from "../../common";
import * as Errors from "../../common/errors";

import { ButtonGroup } from "../button/buttonGroup";
import { Button } from "../button/buttons";
import { ControlGroup } from "./controlGroup";
import { InputGroup } from "./inputGroup";
import {
    clampValue,
    getValueOrEmptyValue,
    isFloatingPointNumericCharacter,
    isValidNumericKeyboardEvent,
    isValueNumeric,
    toMaxPrecision,
} from "./numericInputUtils";

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
    buttonPosition?: typeof Position.LEFT | typeof Position.RIGHT | "none";

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

    /** Whether the numeric input should take up the full width of its container. */
    fill?: boolean;

    /**
     * Ref handler that receives HTML `<input>` element backing this component.
     */
    inputRef?: (ref: HTMLInputElement | null) => any;

    /**
     * If set to `true`, the input will display with larger styling.
     * This is equivalent to setting `Classes.LARGE` via className on the
     * parent control group and on the child input group.
     * @default false
     */
    large?: boolean;

    /**
     * Name of a Blueprint UI icon (or an icon element) to render on the left side of input.
     */
    leftIcon?: IconName | MaybeElement;

    /**
     * The increment between successive values when <kbd>shift</kbd> is held.
     * Pass explicit `null` value to disable this interaction.
     * @default 10
     */
    majorStepSize?: number | null;

    /** The maximum value of the input. */
    max?: number;

    /** The minimum value of the input. */
    min?: number;

    /**
     * The increment between successive values when <kbd>alt</kbd> is held.
     * Pass explicit `null` value to disable this interaction.
     * @default 0.1
     */
    minorStepSize?: number | null;

    /** The placeholder text in the absence of any value. */
    placeholder?: string;

    /**
     * Element to render on right side of input.
     * For best results, use a minimal button, tag, or small spinner.
     */
    rightElement?: JSX.Element;

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
    prevMinProp?: number;
    prevMaxProp?: number;
    prevValueProp?: number | string;
    shouldSelectAfterUpdate: boolean;
    stepMaxPrecision: number;
    value: string;
}

enum IncrementDirection {
    DOWN = -1,
    UP = +1,
}

const NON_HTML_PROPS: Array<keyof INumericInputProps> = [
    "allowNumericCharactersOnly",
    "buttonPosition",
    "clampValueOnBlur",
    "className",
    "majorStepSize",
    "minorStepSize",
    "onButtonClick",
    "onValueChange",
    "selectAllOnFocus",
    "selectAllOnIncrement",
    "stepSize",
];

type ButtonEventHandlers = Required<Pick<React.HTMLAttributes<Element>, "onKeyDown" | "onMouseDown">>;

@polyfill
export class NumericInput extends AbstractPureComponent2<HTMLInputProps & INumericInputProps, INumericInputState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.NumericInput`;

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

    public static getDerivedStateFromProps(props: INumericInputProps, state: INumericInputState) {
        const nextState = { prevMinProp: props.min, prevMaxProp: props.max, prevValueProp: props.value };

        const didMinChange = props.min !== state.prevMinProp;
        const didMaxChange = props.max !== state.prevMaxProp;
        const didBoundsChange = didMinChange || didMaxChange;

        const didValuePropChange = props.value !== state.prevValueProp;
        const value = getValueOrEmptyValue(didValuePropChange ? props.value : state.value);

        const stepMaxPrecision = NumericInput.getStepMaxPrecision(props);

        const sanitizedValue =
            value !== NumericInput.VALUE_EMPTY
                ? NumericInput.getSanitizedValue(value, stepMaxPrecision, props.min, props.max)
                : NumericInput.VALUE_EMPTY;

        // if a new min and max were provided that cause the existing value to fall
        // outside of the new bounds, then clamp the value to the new valid range.
        if (didBoundsChange && sanitizedValue !== state.value) {
            return { ...nextState, stepMaxPrecision, value: sanitizedValue };
        } else {
            return { ...nextState, stepMaxPrecision, value };
        }
    }

    private static CONTINUOUS_CHANGE_DELAY = 300;
    private static CONTINUOUS_CHANGE_INTERVAL = 100;

    // Value Helpers
    // =============
    private static getStepMaxPrecision(props: HTMLInputProps & INumericInputProps) {
        if (props.minorStepSize != null) {
            return Utils.countDecimalPlaces(props.minorStepSize);
        } else {
            return Utils.countDecimalPlaces(props.stepSize);
        }
    }

    private static getSanitizedValue(value: string, stepMaxPrecision: number, min: number, max: number, delta = 0) {
        if (!isValueNumeric(value)) {
            return NumericInput.VALUE_EMPTY;
        }
        const nextValue = toMaxPrecision(parseFloat(value) + delta, stepMaxPrecision);
        return clampValue(nextValue, min, max).toString();
    }

    public state: INumericInputState = {
        shouldSelectAfterUpdate: false,
        stepMaxPrecision: NumericInput.getStepMaxPrecision(this.props),
        value: getValueOrEmptyValue(this.props.value),
    };

    // updating these flags need not trigger re-renders, so don't include them in this.state.
    private didPasteEventJustOccur = false;
    private delta = 0;
    private inputElement: HTMLInputElement | null = null;
    private intervalId: number | null = null;

    private incrementButtonHandlers = this.getButtonEventHandlers(IncrementDirection.UP);
    private decrementButtonHandlers = this.getButtonEventHandlers(IncrementDirection.DOWN);

    public render() {
        const { buttonPosition, className, fill, large } = this.props;
        const containerClasses = classNames(Classes.NUMERIC_INPUT, { [Classes.LARGE]: large }, className);
        const buttons = this.renderButtons();
        return (
            <ControlGroup className={containerClasses} fill={fill}>
                {buttonPosition === Position.LEFT && buttons}
                {this.renderInput()}
                {buttonPosition === Position.RIGHT && buttons}
            </ControlGroup>
        );
    }

    public componentDidUpdate(prevProps: INumericInputProps, prevState: INumericInputState) {
        super.componentDidUpdate(prevProps, prevState);
        if (this.state.shouldSelectAfterUpdate) {
            this.inputElement.setSelectionRange(0, this.state.value.length);
        }

        const didControlledValueChange = this.props.value !== prevProps.value;

        if (!didControlledValueChange && this.state.value !== prevState.value) {
            this.invokeValueCallback(this.state.value, this.props.onValueChange);
        }
    }

    protected validateProps(nextProps: HTMLInputProps & INumericInputProps) {
        const { majorStepSize, max, min, minorStepSize, stepSize } = nextProps;
        if (min != null && max != null && min > max) {
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

    private renderButtons() {
        const { intent } = this.props;
        const disabled = this.props.disabled || this.props.readOnly;
        return (
            <ButtonGroup className={Classes.FIXED} key="button-group" vertical={true}>
                <Button disabled={disabled} icon="chevron-up" intent={intent} {...this.incrementButtonHandlers} />
                <Button disabled={disabled} icon="chevron-down" intent={intent} {...this.decrementButtonHandlers} />
            </ButtonGroup>
        );
    }

    private renderInput() {
        const inputGroupHtmlProps = removeNonHTMLProps(this.props, NON_HTML_PROPS, true);
        return (
            <InputGroup
                autoComplete="off"
                {...inputGroupHtmlProps}
                intent={this.props.intent}
                inputRef={this.inputRef}
                large={this.props.large}
                leftIcon={this.props.leftIcon}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleInputChange}
                onKeyDown={this.handleInputKeyDown}
                onKeyPress={this.handleInputKeyPress}
                onPaste={this.handleInputPaste}
                rightElement={this.props.rightElement}
                value={this.state.value}
            />
        );
    }

    private inputRef = (input: HTMLInputElement | null) => {
        this.inputElement = input;
        Utils.safeInvoke(this.props.inputRef, input);
    };

    // Callbacks - Buttons
    // ===================

    private getButtonEventHandlers(direction: IncrementDirection): ButtonEventHandlers {
        return {
            // keydown is fired repeatedly when held so it's implicitly continuous
            onKeyDown: evt => {
                if (Keys.isKeyboardClick(evt.keyCode)) {
                    this.handleButtonClick(evt, direction);
                }
            },
            onMouseDown: evt => {
                this.handleButtonClick(evt, direction);
                this.startContinuousChange();
            },
        };
    }

    private handleButtonClick = (e: React.MouseEvent | React.KeyboardEvent, direction: IncrementDirection) => {
        const delta = this.updateDelta(direction, e);
        const nextValue = this.incrementValue(delta);
        this.invokeValueCallback(nextValue, this.props.onButtonClick);
    };

    private startContinuousChange() {
        // The button's onMouseUp event handler doesn't fire if the user
        // releases outside of the button, so we need to watch all the way
        // from the top.
        document.addEventListener("mouseup", this.stopContinuousChange);

        // Initial delay is slightly longer to prevent the user from
        // accidentally triggering the continuous increment/decrement.
        this.setTimeout(() => {
            this.intervalId = window.setInterval(this.handleContinuousChange, NumericInput.CONTINUOUS_CHANGE_INTERVAL);
        }, NumericInput.CONTINUOUS_CHANGE_DELAY);
    }

    private stopContinuousChange = () => {
        this.delta = 0;
        this.clearTimeouts();
        clearInterval(this.intervalId);
        document.removeEventListener("mouseup", this.stopContinuousChange);
    };

    private handleContinuousChange = () => {
        const nextValue = this.incrementValue(this.delta);
        this.invokeValueCallback(nextValue, this.props.onButtonClick);
    };

    // Callbacks - Input
    // =================

    private handleInputFocus = (e: React.FocusEvent) => {
        // update this state flag to trigger update for input selection (see componentDidUpdate)
        this.setState({ shouldSelectAfterUpdate: this.props.selectAllOnFocus });
        Utils.safeInvoke(this.props.onFocus, e);
    };

    private handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // always disable this flag on blur so it's ready for next time.
        this.setState({ shouldSelectAfterUpdate: false });

        if (this.props.clampValueOnBlur) {
            const { value } = e.target as HTMLInputElement;
            const sanitizedValue = this.getSanitizedValue(value);
            this.setState({ value: sanitizedValue });
        }

        Utils.safeInvoke(this.props.onBlur, e);
    };

    private handleInputKeyDown = (e: React.KeyboardEvent) => {
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

            const delta = this.updateDelta(direction, e);
            this.incrementValue(delta);
        }

        Utils.safeInvoke(this.props.onKeyDown, e);
    };

    private handleInputKeyPress = (e: React.KeyboardEvent) => {
        // we prohibit keystrokes in onKeyPress instead of onKeyDown, because
        // e.key is not trustworthy in onKeyDown in all browsers.
        if (this.props.allowNumericCharactersOnly && !isValidNumericKeyboardEvent(e)) {
            e.preventDefault();
        }

        Utils.safeInvoke(this.props.onKeyPress, e);
    };

    private handleInputPaste = (e: React.ClipboardEvent) => {
        this.didPasteEventJustOccur = true;
        Utils.safeInvoke(this.props.onPaste, e);
    };

    private handleInputChange = (e: React.FormEvent) => {
        const { value } = e.target as HTMLInputElement;

        let nextValue = value;
        if (this.props.allowNumericCharactersOnly && this.didPasteEventJustOccur) {
            this.didPasteEventJustOccur = false;
            const valueChars = value.split("");
            const sanitizedValueChars = valueChars.filter(isFloatingPointNumericCharacter);
            const sanitizedValue = sanitizedValueChars.join("");
            nextValue = sanitizedValue;
        }

        this.setState({ shouldSelectAfterUpdate: false, value: nextValue });
    };

    private invokeValueCallback(value: string, callback: (valueAsNumber: number, valueAsString: string) => void) {
        Utils.safeInvoke(callback, +value, value);
    }

    private incrementValue(delta: number) {
        // pretend we're incrementing from 0 if currValue is empty
        const currValue = this.state.value || NumericInput.VALUE_ZERO;
        const nextValue = this.getSanitizedValue(currValue, delta);

        this.setState({ shouldSelectAfterUpdate: this.props.selectAllOnIncrement, value: nextValue });

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

    private getSanitizedValue(value: string, delta = 0) {
        return NumericInput.getSanitizedValue(
            value,
            this.state.stepMaxPrecision,
            this.props.min,
            this.props.max,
            delta,
        );
    }

    private updateDelta(direction: IncrementDirection, e: React.MouseEvent | React.KeyboardEvent) {
        this.delta = this.getIncrementDelta(direction, e.shiftKey, e.altKey);
        return this.delta;
    }
}
