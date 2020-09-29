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
    Intent,
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
    isValidNumericKeyboardEvent,
    isValueNumeric,
    sanitizeNumericInput,
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
     * In uncontrolled mode, this sets the default value of the input.
     * Note that this value is only used upon component instantiation and changes to this prop
     * during the component lifecycle will be ignored.
     * @default ""
     */
    defaultValue?: number | string;

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

    /**
     * The value to display in the input field.
     */
    value?: number | string;

    /** The callback invoked when the value changes due to a button click. */
    onButtonClick?(valueAsNumber: number, valueAsString: string): void;

    /** The callback invoked when the value changes due to typing, arrow keys, or button clicks. */
    onValueChange?(valueAsNumber: number, valueAsString: string, inputElement: HTMLInputElement | null): void;
}

export interface INumericInputState {
    currentImeInputInvalid: boolean;
    prevMinProp?: number;
    prevMaxProp?: number;
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
    "defaultValue",
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
        defaultValue: NumericInput.VALUE_EMPTY,
        large: false,
        majorStepSize: 10,
        minorStepSize: 0.1,
        selectAllOnFocus: false,
        selectAllOnIncrement: false,
        stepSize: 1,
    };

    public static getDerivedStateFromProps(props: INumericInputProps, state: INumericInputState) {
        const nextState = {
            prevMaxProp: props.max,
            prevMinProp: props.min,
        };

        const didMinChange = props.min !== state.prevMinProp;
        const didMaxChange = props.max !== state.prevMaxProp;
        const didBoundsChange = didMinChange || didMaxChange;

        // in controlled mode, use props.value
        // in uncontrolled mode, if state.value has not been assigned yet (upon initial mount), use props.defaultValue
        const value = props.value?.toString() ?? state.value;
        const stepMaxPrecision = NumericInput.getStepMaxPrecision(props);

        const sanitizedValue =
            value !== NumericInput.VALUE_EMPTY
                ? NumericInput.roundAndClampValue(value, stepMaxPrecision, props.min, props.max)
                : NumericInput.VALUE_EMPTY;

        // if a new min and max were provided that cause the existing value to fall
        // outside of the new bounds, then clamp the value to the new valid range.
        if (didBoundsChange && sanitizedValue !== state.value) {
            return { ...nextState, stepMaxPrecision, value: sanitizedValue };
        }

        return { ...nextState, stepMaxPrecision, value };
    }

    private static CONTINUOUS_CHANGE_DELAY = 300;
    private static CONTINUOUS_CHANGE_INTERVAL = 100;

    // Value Helpers
    // =============
    private static getStepMaxPrecision(props: HTMLInputProps & INumericInputProps) {
        if (props.minorStepSize != null) {
            return Utils.countDecimalPlaces(props.minorStepSize);
        } else {
            return Utils.countDecimalPlaces(props.stepSize!);
        }
    }

    private static roundAndClampValue(
        value: string,
        stepMaxPrecision: number,
        min: number | undefined,
        max: number | undefined,
        delta = 0,
    ) {
        if (!isValueNumeric(value)) {
            return NumericInput.VALUE_EMPTY;
        }
        const nextValue = toMaxPrecision(parseFloat(value) + delta, stepMaxPrecision);
        return clampValue(nextValue, min, max).toString();
    }

    public state: INumericInputState = {
        currentImeInputInvalid: false,
        shouldSelectAfterUpdate: false,
        stepMaxPrecision: NumericInput.getStepMaxPrecision(this.props),
        value: getValueOrEmptyValue(this.props.value ?? this.props.defaultValue),
    };

    // updating these flags need not trigger re-renders, so don't include them in this.state.
    private didPasteEventJustOccur = false;
    private delta = 0;
    private inputElement: HTMLInputElement | null = null;
    private intervalId?: number;

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
            this.inputElement?.setSelectionRange(0, this.state.value.length);
        }

        const didMinChange = this.props.min !== prevProps.min;
        const didMaxChange = this.props.max !== prevProps.max;
        const didBoundsChange = didMinChange || didMaxChange;
        if (didBoundsChange && this.state.value !== prevState.value) {
            // we clamped the value due to a bounds change, so we should fire the change callback
            this.props.onValueChange?.(+this.state.value, this.state.value, this.inputElement);
        }
    }

    protected validateProps(nextProps: HTMLInputProps & INumericInputProps) {
        const { majorStepSize, max, min, minorStepSize, stepSize, value } = nextProps;
        if (min != null && max != null && min > max) {
            throw new Error(Errors.NUMERIC_INPUT_MIN_MAX);
        }
        if (stepSize! <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_STEP_SIZE_NON_POSITIVE);
        }
        if (minorStepSize && minorStepSize <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_NON_POSITIVE);
        }
        if (majorStepSize && majorStepSize <= 0) {
            throw new Error(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_NON_POSITIVE);
        }
        if (minorStepSize && minorStepSize > stepSize!) {
            throw new Error(Errors.NUMERIC_INPUT_MINOR_STEP_SIZE_BOUND);
        }
        if (majorStepSize && majorStepSize < stepSize!) {
            throw new Error(Errors.NUMERIC_INPUT_MAJOR_STEP_SIZE_BOUND);
        }

        // controlled mode
        if (value != null) {
            const stepMaxPrecision = NumericInput.getStepMaxPrecision(nextProps);
            const sanitizedValue = NumericInput.roundAndClampValue(value.toString(), stepMaxPrecision, min, max);
            if (sanitizedValue !== value.toString()) {
                console.warn(Errors.NUMERIC_INPUT_CONTROLLED_VALUE_INVALID);
            }
        }
    }

    // Render Helpers
    // ==============

    private renderButtons() {
        const { intent, max, min } = this.props;
        const { value } = this.state;
        const disabled = this.props.disabled || this.props.readOnly;
        const isIncrementDisabled = max !== undefined && value !== "" && +value >= max;
        const isDecrementDisabled = min !== undefined && value !== "" && +value <= min;
        return (
            <ButtonGroup className={Classes.FIXED} key="button-group" vertical={true}>
                <Button
                    disabled={disabled || isIncrementDisabled}
                    icon="chevron-up"
                    intent={intent}
                    {...this.incrementButtonHandlers}
                />
                <Button
                    disabled={disabled || isDecrementDisabled}
                    icon="chevron-down"
                    intent={intent}
                    {...this.decrementButtonHandlers}
                />
            </ButtonGroup>
        );
    }

    private renderInput() {
        const inputGroupHtmlProps = removeNonHTMLProps(this.props, NON_HTML_PROPS, true);
        return (
            <InputGroup
                autoComplete="off"
                {...inputGroupHtmlProps}
                intent={this.state.currentImeInputInvalid ? Intent.DANGER : this.props.intent}
                inputRef={this.inputRef}
                large={this.props.large}
                leftIcon={this.props.leftIcon}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleInputChange}
                onCompositionEnd={this.handleCompositionEnd}
                onCompositionUpdate={this.handleCompositionUpdate}
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
        this.props.inputRef?.(input);
    };

    // Callbacks - Buttons
    // ===================

    private getButtonEventHandlers(direction: IncrementDirection): ButtonEventHandlers {
        return {
            // keydown is fired repeatedly when held so it's implicitly continuous
            onKeyDown: evt => {
                // eslint-disable-next-line deprecation/deprecation
                if (!this.props.disabled && Keys.isKeyboardClick(evt.keyCode)) {
                    this.handleButtonClick(evt, direction);
                }
            },
            onMouseDown: evt => {
                if (!this.props.disabled) {
                    this.handleButtonClick(evt, direction);
                    this.startContinuousChange();
                }
            },
        };
    }

    private handleButtonClick = (e: React.MouseEvent | React.KeyboardEvent, direction: IncrementDirection) => {
        const delta = this.updateDelta(direction, e);
        const nextValue = this.incrementValue(delta);
        this.props.onButtonClick?.(+nextValue, nextValue);
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
        // If either min or max prop is set, when reaching the limit
        // the button will be disabled and stopContinuousChange will be never fired,
        // hence the need to check on each iteration to properly clear the timeout
        if (this.props.min !== undefined || this.props.max !== undefined) {
            const min = this.props.min ?? -Infinity;
            const max = this.props.max ?? Infinity;
            if (Number(this.state.value) <= min || Number(this.state.value) >= max) {
                this.stopContinuousChange();
                return;
            }
        }
        const nextValue = this.incrementValue(this.delta);
        this.props.onButtonClick?.(+nextValue, nextValue);
    };

    // Callbacks - Input
    // =================

    private handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // update this state flag to trigger update for input selection (see componentDidUpdate)
        this.setState({ shouldSelectAfterUpdate: this.props.selectAllOnFocus! });
        this.props.onFocus?.(e);
    };

    private handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // always disable this flag on blur so it's ready for next time.
        this.setState({ shouldSelectAfterUpdate: false });

        if (this.props.clampValueOnBlur) {
            const { value } = e.target as HTMLInputElement;
            this.handleNextValue(this.roundAndClampValue(value));
        }

        this.props.onBlur?.(e);
    };

    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.disabled || this.props.readOnly) {
            return;
        }

        // eslint-disable-next-line deprecation/deprecation
        const { keyCode } = e;

        let direction: IncrementDirection | undefined;

        if (keyCode === Keys.ARROW_UP) {
            direction = IncrementDirection.UP;
        } else if (keyCode === Keys.ARROW_DOWN) {
            direction = IncrementDirection.DOWN;
        }

        if (direction !== undefined) {
            // when the input field has focus, some key combinations will modify
            // the field's selection range. we'll actually want to select all
            // text in the field after we modify the value on the following
            // lines. preventing the default selection behavior lets us do that
            // without interference.
            e.preventDefault();

            const delta = this.updateDelta(direction, e);
            this.incrementValue(delta);
        }

        this.props.onKeyDown?.(e);
    };

    private handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        if (this.props.allowNumericCharactersOnly) {
            this.handleNextValue(sanitizeNumericInput(e.data));
            this.setState({ currentImeInputInvalid: false });
        }
    };

    private handleCompositionUpdate = (e: React.CompositionEvent<HTMLInputElement>) => {
        if (this.props.allowNumericCharactersOnly) {
            const { data } = e;
            const sanitizedValue = sanitizeNumericInput(data);
            if (sanitizedValue.length === 0 && data.length > 0) {
                this.setState({ currentImeInputInvalid: true });
            } else {
                this.setState({ currentImeInputInvalid: false });
            }
        }
    };

    private handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // we prohibit keystrokes in onKeyPress instead of onKeyDown, because
        // e.key is not trustworthy in onKeyDown in all browsers.
        if (this.props.allowNumericCharactersOnly && !isValidNumericKeyboardEvent(e)) {
            e.preventDefault();
        }

        this.props.onKeyPress?.(e);
    };

    private handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        this.didPasteEventJustOccur = true;
        this.props.onPaste?.(e);
    };

    private handleInputChange = (e: React.FormEvent) => {
        const { value } = e.target as HTMLInputElement;

        let nextValue = value;
        if (this.props.allowNumericCharactersOnly && this.didPasteEventJustOccur) {
            this.didPasteEventJustOccur = false;
            nextValue = sanitizeNumericInput(value);
        }

        this.handleNextValue(nextValue);
        this.setState({ shouldSelectAfterUpdate: false });
    };

    // Data logic
    // ==========

    private handleNextValue(valueAsString: string) {
        if (this.props.value == null) {
            this.setState({ value: valueAsString });
        }

        this.props.onValueChange?.(+valueAsString, valueAsString, this.inputElement);
    }

    private incrementValue(delta: number) {
        // pretend we're incrementing from 0 if currValue is empty
        const currValue = this.state.value === NumericInput.VALUE_EMPTY ? NumericInput.VALUE_ZERO : this.state.value;
        const nextValue = this.roundAndClampValue(currValue, delta);

        if (nextValue !== this.state.value) {
            this.handleNextValue(nextValue);
            this.setState({ shouldSelectAfterUpdate: this.props.selectAllOnIncrement! });
        }

        // return value used in continuous change updates
        return nextValue;
    }

    private getIncrementDelta(direction: IncrementDirection, isShiftKeyPressed: boolean, isAltKeyPressed: boolean) {
        const { majorStepSize, minorStepSize, stepSize } = this.props;

        if (isShiftKeyPressed && majorStepSize != null) {
            return direction * majorStepSize;
        } else if (isAltKeyPressed && minorStepSize != null) {
            return direction * minorStepSize;
        } else {
            return direction * stepSize!;
        }
    }

    private roundAndClampValue(value: string, delta = 0) {
        return NumericInput.roundAndClampValue(
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
