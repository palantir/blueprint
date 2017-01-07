/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { AbstractComponent, Classes, Keys } from "../../common";
import * as Errors from "../../common/errors";
import { Position } from "../../common/position";
import { HTMLInputProps, IIntentProps, IProps, removeNonHTMLProps } from "../../common/props";

import { Button } from "../button/buttons";
import { InputGroup } from "./inputGroup";

export interface INumericStepperProps extends IIntentProps, IProps {

    /**
     * The position of the buttons with respect to the input field
     * @default Position.RIGHT
     */
    buttonPosition?: Position.LEFT | Position.RIGHT | "none";

    /**
     * Whether the input is in a non-interactive state
     * @default false
     */
    disabled?: boolean;

    /** The name of icon (the part after `pt-icon-`) to render on left side of input */
    leftIconName?: string;

    /** The placeholder text in the absence of any value */
    placeholder?: string;

    /**
     * The increment between successive values when `shift` is held
     * @default 10
     */
    majorStepSize?: number;

    /** The maximum value of the input */
    max?: number;

    /** The minimum value of the input */
    min?: number;

    /**
     * The increment between successive values when `alt` is held
     * @default 0.1
     */
    minorStepSize?: number;

    /**
     * The increment between successive values when no modifier keys are held
     * @default 1
     */
    stepSize?: number;

    /** The value to display in the input field */
    value?: number | string;

    /** The callback invoked when `enter` is pressed and when the field loses focus */
    onConfirm?(value: string): void;

    /** The callback invoked when the value changes */
    onUpdate?(value: string): void;
}

export interface INumericStepperState {
    isInputGroupFocused?: boolean;
    isButtonGroupFocused?: boolean;
    shouldSelectAfterUpdate?: boolean;
    value?: string;
}

@PureRender
export class NumericStepper extends AbstractComponent<HTMLInputProps & INumericStepperProps, INumericStepperState> {
    public static displayName = "Blueprint.NumericStepper";

    public static defaultProps: INumericStepperProps = {
        buttonPosition: Position.RIGHT,
        majorStepSize: 10,
        minorStepSize: 0.1,
        stepSize: 1,
        value: NumericStepper.VALUE_EMPTY,
    };

    private static DECREMENT_KEY = "decrement";
    private static INCREMENT_KEY = "increment";
    private static DECREMENT_ICON_NAME = "chevron-down";
    private static INCREMENT_ICON_NAME = "chevron-up";
    private static VALUE_EMPTY = "";
    private static VALUE_ZERO = "0";

    private inputElement: HTMLInputElement;

    public constructor(props?: HTMLInputProps & INumericStepperProps) {
        super(props);
        this.state = {
            shouldSelectAfterUpdate: false,
            value: this.getValueOrEmptyValue(props),
        };
    }

    public render() {
        const { buttonPosition, className } = this.props;

        const inputGroup = (
            <InputGroup
                {...this.removeNonHTMLProps(this.props)}
                intent={this.props.intent}
                inputRef={this.inputRef}
                key="input-group"
                leftIconName={this.props.leftIconName}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleInputUpdate}
                onKeyDown={this.handleKeyDown}
                value={this.state.value}
            />
        );

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
            // alias this class to avoid line-length lint errors when defining the button group.
            const NS = NumericStepper;

            const buttonGroup = (
                <div key="button-group" className={classNames(Classes.BUTTON_GROUP, Classes.VERTICAL)}>
                    {this.renderButton(NS.INCREMENT_KEY, NS.INCREMENT_ICON_NAME, this.handleIncrementButtonClick)}
                    {this.renderButton(NS.DECREMENT_KEY, NS.DECREMENT_ICON_NAME, this.handleDecrementButtonClick)}
                </div>
            );

            const stepperClasses = classNames(
                Classes.NUMERIC_STEPPER,
                Classes.CONTROL_GROUP,
                {
                    // because both the <input> and <button>s are nested within
                    // pt-input-group and pt-button-group divs, respectively, we
                    // need to keep track of which group has focus in order to
                    // properly style elements' outlines while focused (we'll
                    // primarily want to ensure the focused element's outline
                    // will appear on top of all other elements).
                    [Classes.NUMERIC_STEPPER_BUTTON_GROUP_FOCUSED]: this.state.isButtonGroupFocused,
                    [Classes.NUMERIC_STEPPER_INPUT_GROUP_FOCUSED]: this.state.isInputGroupFocused,
                },
                className,
            );
            const stepperElems = (buttonPosition === Position.LEFT)
                ? [buttonGroup, inputGroup]
                : [inputGroup, buttonGroup];

            return (
                <div className={stepperClasses}>
                    {stepperElems}
                </div>
            );
        }
    }

    public componentWillReceiveProps(nextProps: HTMLInputProps & INumericStepperProps) {
        super.componentWillReceiveProps(nextProps);

        const value = this.getValueOrEmptyValue(nextProps);

        const didMinChange = nextProps.min !== this.props.min;
        const didMaxChange = nextProps.max !== this.props.max;
        const didBoundsChange = didMinChange || didMaxChange;

        // if a new min and max were provided that cause the existing value to fall
        // outside of the new bounds, then clamp the value to the new valid range.
        if (didBoundsChange) {
            const { min, max } = nextProps;
            const adjustedValue = (value !== NumericStepper.VALUE_EMPTY)
                ? this.getAdjustedValue(value, /* delta */ 0, min, max)
                : NumericStepper.VALUE_EMPTY;
            this.setState({ value: adjustedValue });
        } else {
            this.setState({ value });
        }
    }

    public componentDidUpdate() {
        if (this.state.shouldSelectAfterUpdate) {
            this.inputElement.setSelectionRange(0, this.state.value.length);
        }
        this.maybeInvokeOnUpdateCallback(this.state.value);
    }

    protected validateProps(nextProps: HTMLInputProps & INumericStepperProps) {
        const { majorStepSize, max, min, minorStepSize, stepSize } = nextProps;
        if (min && max && min >= max) {
            throw new Error(Errors.NUMERIC_STEPPER_MIN_MAX);
        }
        if (stepSize == null) {
            throw new Error(Errors.NUMERIC_STEPPER_STEP_SIZE_NULL);
        }
        if (stepSize <= 0) {
            throw new Error(Errors.NUMERIC_STEPPER_STEP_SIZE_NON_POSITIVE);
        }
        if (minorStepSize && minorStepSize <= 0) {
            throw new Error(Errors.NUMERIC_STEPPER_MINOR_STEP_SIZE_NON_POSITIVE);
        }
        if (majorStepSize && majorStepSize <= 0) {
            throw new Error(Errors.NUMERIC_STEPPER_MAJOR_STEP_SIZE_NON_POSITIVE);
        }
        if (minorStepSize && minorStepSize > stepSize) {
            throw new Error(Errors.NUMERIC_STEPPER_MINOR_STEP_SIZE_BOUND);
        }
        if (majorStepSize && majorStepSize < stepSize) {
            throw new Error(Errors.NUMERIC_STEPPER_MAJOR_STEP_SIZE_BOUND);
        }
    }

    private renderButton(key: string, iconName: string, onClick: React.MouseEventHandler<HTMLElement>) {
        return (
            <Button
                disabled={this.props.disabled || this.props.readOnly}
                iconName={iconName}
                intent={this.props.intent}
                key={key}
                onBlur={this.handleButtonBlur}
                onClick={onClick}
                onFocus={this.handleButtonFocus}
            />
        );
    }

    private inputRef = (input: HTMLInputElement) => {
        this.inputElement = input;
    }

    private handleDecrementButtonClick = (e: React.MouseEvent<HTMLInputElement>) => {
        this.updateValue(-1, e);
    }

    private handleIncrementButtonClick = (e: React.MouseEvent<HTMLInputElement>) => {
        this.updateValue(+1, e);
    }

    private handleButtonFocus = () => {
        this.setState({ isButtonGroupFocused: true });
    }

    private handleButtonBlur = () => {
        this.setState({ isButtonGroupFocused: false });
    }

    private handleInputFocus = () => {
        this.setState({ isInputGroupFocused: true });
    }

    private handleInputBlur = () => {
        this.setState({ isInputGroupFocused: false });
        this.handleDone();
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.disabled || this.props.readOnly) {
            return;
        }

        const { keyCode } = e;

        let direction: number;

        if (keyCode === Keys.ENTER) {
            this.handleDone();
            return;
        } else if (keyCode === Keys.ARROW_UP) {
            direction = 1;
        } else if (keyCode === Keys.ARROW_DOWN) {
            direction = -1;
        } else {
            return;
        }

        // we'd like to select the field contents after running the code in this
        // onKeyDown handler, as a UX nicety. without e.preventDefault, some
        // hotkeys (e.g. shift + up/down, alt + up/down) will clear the selection,
        // resulting in an inconsistent or unintuitive experience.
        e.preventDefault();

        this.updateValue(direction, e);
    }

    private handleDone = () => {
        if (this.props.onConfirm != null) {
            this.props.onConfirm(this.state.value);
        } else {
            const { min, max } = this.props;
            const currValue = this.state.value;
            const nextValue = (currValue.length > 0) ? this.getAdjustedValue(currValue, /* delta */ 0, min, max) : "";
            this.setState({ value: nextValue });
        }
    }

    private handleInputUpdate = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const nextValue = (e.target as HTMLInputElement).value;
        this.setState({ shouldSelectAfterUpdate : false, value: nextValue });
    }

    private updateValue(direction: number, e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) {
        const { min, max } = this.props;

        const delta = this.getDelta(direction, e);

        // pretend we're incrementing from 0 if currValue isn't defined
        const currValue = this.state.value || NumericStepper.VALUE_ZERO;
        const nextValue = this.getAdjustedValue(currValue, delta, min, max);

        this.setState({ shouldSelectAfterUpdate : true, value: nextValue });
    }

    private getAdjustedValue(value: string, delta: number, min?: number, max?: number) {
        if (!this.isValueNumeric(value)) {
            return NumericStepper.VALUE_EMPTY;
        }

        // truncate floating-point result to avoid precision issues when adding
        // non-integer, binary-unfriendly deltas like 0.1
        let nextValue = parseFloat((parseFloat(value) + delta).toFixed(2));

        nextValue = (min != null) ? Math.max(nextValue, min) : nextValue;
        nextValue = (max != null) ? Math.min(nextValue, max) : nextValue;

        return nextValue.toString();
    }

    private getDelta(direction: number, e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) {
        const { majorStepSize, minorStepSize, stepSize } = this.props;

        if (e.shiftKey && majorStepSize != null) {
            return direction * majorStepSize;
        } else if (e.altKey && minorStepSize != null) {
            return direction * minorStepSize;
        } else {
            return direction * stepSize;
        }
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

    private getValueOrEmptyValue(props: INumericStepperProps) {
        return (props.value != null)
            ? props.value.toString()
            : NumericStepper.VALUE_EMPTY;
    }

    private maybeInvokeOnUpdateCallback(value: string) {
        if (this.props.onUpdate) {
            this.props.onUpdate(value);
        }
    }

    private removeNonHTMLProps(props: HTMLInputProps & INumericStepperProps) {
        const additionalProps = ["buttonPosition", "majorStepSize", "minorStepSize", "stepSize", "onUpdate", "onConfirm"];
        return removeNonHTMLProps(props, additionalProps, /* shouldMerge */ true);
    }
}

export const NumericStepperFactory = React.createFactory(NumericStepper);
