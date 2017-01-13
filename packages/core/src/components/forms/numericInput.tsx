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

export interface INumericInputProps extends IIntentProps,
IProps {

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

    /** The callback invoked when `enter` is pressed and when the field loses focus. */
    onConfirm?(value: string): void;

    /** The callback invoked when the value changes. */
    onChange?(value: string): void;
}

export interface INumericInputState {
    isInputGroupFocused?: boolean;
    isButtonGroupFocused?: boolean;
    shouldSelectAfterUpdate?: boolean;
    value?: string;
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

    private static NUMERIC_INPUT_BUTTON_GROUP_FOCUSED = `${Classes.NUMERIC_INPUT}-button-group-focused`;
    private static NUMERIC_INPUT_INPUT_GROUP_FOCUSED = `${Classes.NUMERIC_INPUT}-input-group-focused`;

    private inputElement: HTMLInputElement;

    public constructor(props?: HTMLInputProps & INumericInputProps, context?: any) {
        super(props, context);
        this.state = {
            shouldSelectAfterUpdate: false,
            value: this.getValueOrEmptyValue(props),
        };
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

            const inputClasses = classNames(
                Classes.NUMERIC_INPUT,
                Classes.CONTROL_GROUP,
                {
                    // because both the <input> and <button>s are nested within
                    // pt-input-group and pt-button-group divs, respectively, we
                    // need to keep track of which group has focus in order to
                    // properly style elements' outlines while focused (we'll
                    // primarily want to ensure the focused element's outline
                    // will appear on top of all other elements).
                    [NumericInput.NUMERIC_INPUT_BUTTON_GROUP_FOCUSED]: this.state.isButtonGroupFocused,
                    [NumericInput.NUMERIC_INPUT_INPUT_GROUP_FOCUSED]: this.state.isInputGroupFocused,
                },
                className,
            );
            const inputElems = (buttonPosition === Position.LEFT)
                ? [buttonGroup, inputGroup]
                : [inputGroup, buttonGroup];

            return (
                <div className={inputClasses}>
                    {inputElems}
                </div>
            );
        }
    }

    public componentWillReceiveProps(nextProps: HTMLInputProps & INumericInputProps) {
        super.componentWillReceiveProps(nextProps);

        const value = this.getValueOrEmptyValue(nextProps);

        const didMinChange = nextProps.min !== this.props.min;
        const didMaxChange = nextProps.max !== this.props.max;
        const didBoundsChange = didMinChange || didMaxChange;

        // if a new min and max were provided that cause the existing value to fall
        // outside of the new bounds, then clamp the value to the new valid range.
        if (didBoundsChange) {
            const { min, max } = nextProps;
            const adjustedValue = (value !== NumericInput.VALUE_EMPTY)
                ? this.getAdjustedValue(value, /* delta */ 0, min, max)
                : NumericInput.VALUE_EMPTY;
            this.setState({ value: adjustedValue });
        } else {
            this.setState({ value });
        }
    }

    public componentDidUpdate() {
        if (this.state.shouldSelectAfterUpdate) {
            this.inputElement.setSelectionRange(0, this.state.value.length);
        }
        Utils.safeInvoke<string, void>(this.props.onChange, this.state.value);
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

    private renderButton(key: string, iconName: string, onClick: React.MouseEventHandler<HTMLElement>) {
        const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            this.handleButtonKeyDown(e, onClick);
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
                onKeyDown={onKeyDown}
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

    private handleButtonKeyDown =
            (e: React.KeyboardEvent<HTMLInputElement>, onClick: React.MouseEventHandler<HTMLInputElement>) => {
        if (e.keyCode === Keys.SPACE) {
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

    private handleInputFocus = () => {
        this.setState({ isInputGroupFocused: true });
    }

    private handleInputBlur = () => {
        this.setState({ isInputGroupFocused: false });
        this.handleConfirm();
    }

    private handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.disabled || this.props.readOnly) {
            return;
        }

        const { keyCode } = e;

        let direction: number;

        if (keyCode === Keys.ENTER) {
            this.handleConfirm();
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

    private handleConfirm = () => {
        Utils.safeInvoke(this.props.onConfirm, this.state.value);
        if (this.props.onConfirm == null) {
            const { min, max } = this.props;
            const currValue = this.state.value;
            const nextValue = (currValue.length > 0) ? this.getAdjustedValue(currValue, /* delta */ 0, min, max) : "";
            this.setState({ value: nextValue });
        }
    }

    private handleInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const nextValue = (e.target as HTMLInputElement).value;
        this.setState({ shouldSelectAfterUpdate : false, value: nextValue });
    }

    private updateValue(direction: number, e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) {
        const { min, max } = this.props;

        const delta = this.getDelta(direction, e);

        // pretend we're incrementing from 0 if currValue isn't defined
        const currValue = this.state.value || NumericInput.VALUE_ZERO;
        const nextValue = this.getAdjustedValue(currValue, delta, min, max);

        this.setState({ shouldSelectAfterUpdate : true, value: nextValue });
    }

    private getAdjustedValue(value: string, delta: number, min?: number, max?: number) {
        if (!this.isValueNumeric(value)) {
            return NumericInput.VALUE_EMPTY;
        }

        // truncate floating-point result to avoid precision issues when adding
        // non-integer, binary-unfriendly deltas like 0.1
        let nextValue = parseFloat((parseFloat(value) + delta).toFixed(2));

        // defaultProps won't work if the user passes in null, so just default
        // to +/- infinity here instead, as a catch-all.
        nextValue = Utils.clamp(nextValue, min || -Infinity, max || Infinity);

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

    private getValueOrEmptyValue(props: INumericInputProps) {
        return (props.value != null)
            ? props.value.toString()
            : NumericInput.VALUE_EMPTY;
    }
}

export const NumericInputFactory = React.createFactory(NumericInput);
