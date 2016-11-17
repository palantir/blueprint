/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { removeNonHTMLProps } from "../../common/props";
import { HTMLInputProps, IControlledProps, IIntentProps, IProps } from "../../common/props";

import { Button } from "../button/buttons";
import { InputGroup } from "./inputGroup";

export type ButtonPosition = "none" | "left" | "right" | "split";

export interface INumericStepperProps extends IControlledProps, IIntentProps, IProps {

    /**
     * The button configuration with respect to the input field.
     * @default right
     */
    buttonPosition?: ButtonPosition;

    /**
     * Whether the input is non-interactive.
     * @default false
     */
    disabled?: boolean;

    /** Ref handler that receives HTML `<input>` element backing this component. */
    inputRef?: (ref: HTMLInputElement) => any;

    /** Name of icon (the part after `pt-icon-`) to render on left side of input. */
    leftIconName?: string;

    /** Placeholder text in the absence of any value. */
    placeholder?: string;

    /**
     * Increment between successive values when "Shift" is held.
     * @default 10
     */
    majorStepSize?: number;

    /** Maximum value of the input. */
    max?: number;

    /** Minimum value of the input. */
    min?: number;

    /**
     * Increment between successive values when "Alt" is held.
     * @default 0.1
     */
    minorStepSize?: number;

    /**
     * Increment between successive values when no modifier keys are held.
     * @default 1
     */
    stepSize?: number;

    /**
     * Value to display in the input field
     * @default ""
     */
    value?: string;

}

export interface INumericStepperState {
    shouldSelectAfterUpdate: boolean;
    value: string;
}

@PureRender
export class NumericStepper extends React.Component<HTMLInputProps & INumericStepperProps, INumericStepperState> {
    public static displayName = "Blueprint.NumericStepper";

    public static defaultProps: INumericStepperProps = {
        buttonPosition: "right",
        majorStepSize: 10,
        minorStepSize: 0.1,
        stepSize: 1,
        value: "",
    };

    private static DECREMENT_KEY = "decrement";
    private static INCREMENT_KEY = "increment";

    private static DECREMENT_ICON_NAME = "minus";
    private static INCREMENT_ICON_NAME = "plus";

    private input: HTMLInputElement;

    public constructor(props?: HTMLInputProps & INumericStepperProps) {
        super(props);
        this.state = {
            shouldSelectAfterUpdate: false,
            value: props.value,
        };
    }

    public render() {
        const { buttonPosition, className } = this.props;

        const inputGroup = this.renderInputGroup();
        const decrementButton = this.renderButton(
            NumericStepper.DECREMENT_KEY, NumericStepper.DECREMENT_ICON_NAME, this.handleDecrementButtonClick);
        const incrementButton = this.renderButton(
            NumericStepper.INCREMENT_KEY, NumericStepper.INCREMENT_ICON_NAME, this.handleIncrementButtonClick);

        let elems: JSX.Element[];

        if (buttonPosition === "left") {
            elems = [decrementButton, incrementButton, inputGroup];
        } else if (buttonPosition === "split") {
            elems = [decrementButton, inputGroup, incrementButton];
        } else if (buttonPosition === "right") {
            elems = [inputGroup, decrementButton, incrementButton];
        } else {
            elems = [inputGroup];
        }

        const classes = classNames(Classes.CONTROL_GROUP, { [Classes.DISABLED]: this.props.disabled }, className);

        return <div className={classes}>{elems}</div>;
    }

    public componentDidUpdate() {
        if (this.state.shouldSelectAfterUpdate) {
            this.input.setSelectionRange(0, this.state.value.length);
        }
    }

    private renderInputGroup() {
        return (
            <InputGroup
                {...removeNonHTMLProps(this.props)}
                intent={this.props.intent}
                inputRef={this.inputRef}
                key="input-group"
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                value={this.state.value}
            />
        );
    }

    private renderButton(
            key: string,
            iconName: string,
            onClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>>) {
        return (
            <Button
                disabled={this.props.disabled || this.props.readOnly}
                iconName={iconName}
                intent={this.props.intent}
                key={key}
                onClick={onClick}
            />
        );
    }

    private inputRef = (input: HTMLInputElement) => {
        this.input = input;
    }

    private handleDecrementButtonClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const direction = -1;
        this.updateValue(direction, e.altKey, e.shiftKey);
    }

    private handleIncrementButtonClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const direction = 1;
        this.updateValue(direction, e.altKey, e.shiftKey);
    }

    private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.disabled || this.props.readOnly) {
            return;
        }

        const { keyCode } = e;

        let direction: number;

        if (keyCode === Keys.ARROW_UP) {
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

        this.updateValue(direction, e.altKey, e.shiftKey);
    }

    private handleInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // the type definition for EventTarget (e.target) doesn't include
        // the 'value' property out of the box, hence the janky casting
        const nextValue = (e.target as any).value;
        this.setState({ shouldSelectAfterUpdate : false, value: nextValue });

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    private updateValue(direction: number, isAltPressed: boolean, isShiftPressed: boolean) {
        let delta = this.props.stepSize * direction;

        if (isAltPressed && isShiftPressed) {
            return;
        } else if (isAltPressed) {
            delta *= this.props.minorStepSize;
        } else if (isShiftPressed) {
            delta *= this.props.majorStepSize;
        }

        // pretend we're incrementing from 0 if curValue isn't defined
        const curValue = this.state.value || "0";

        // truncate floating-point result to avoid precision issues when adding
        // binary-unfriendly deltas like 0.1
        const newValue = (!this.isValueNumeric(curValue))
            ? 0
            : parseFloat((parseFloat(curValue) + delta).toFixed(2));

        this.setState({ shouldSelectAfterUpdate : true, value: newValue.toString() });
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

export const NumericStepperFactory = React.createFactory(NumericStepper);
