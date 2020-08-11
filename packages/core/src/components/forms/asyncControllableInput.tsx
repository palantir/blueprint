/* !
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";
import { polyfill } from "react-lifecycles-compat";

export interface IAsyncControllableInputProps
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    inputRef?: React.LegacyRef<HTMLInputElement>;
}

export interface IAsyncControllableInputState {
    /**
     * Whether we are in the middle of a composition event.
     * @default false
     */
    isComposing: boolean;

    /**
     * The source of truth for the input value. This is not updated during IME composition.
     * It may be updated by a parent component.
     * @default ""
     */
    externalValue: IAsyncControllableInputProps["value"];

    /**
     * The latest input value, which updates during IME composition. If undefined, we use
     * externalValue instead.
     */
    localValue: IAsyncControllableInputProps["value"];
}

/**
 * A stateful wrapper around the low-level <input> component which works around a
 * [React bug](https://github.com/facebook/react/issues/3926). This bug is reproduced when an input
 * receives CompositionEvents (for example, through IME composition) and has its value prop updated
 * asychronously. This might happen if a component chooses to do async validation of a value
 * returned by the input's `onChange` callback.
 *
 * Implementation adapted from https://jsfiddle.net/m792qtys/ (linked in the above issue thread).
 *
 * Note: this component does not apply any Blueprint-specific styling.
 */
@polyfill
export class AsyncControllableInput extends React.PureComponent<
    IAsyncControllableInputProps,
    IAsyncControllableInputState
> {
    public state: IAsyncControllableInputState = {
        externalValue: this.props.value,
        isComposing: false,
        localValue: this.props.value,
    };

    public static getDerivedStateFromProps({ value }: IAsyncControllableInputProps) {
        return {
            externalValue: value,
        };
    }

    public render() {
        const { isComposing, externalValue, localValue } = this.state;
        const { inputRef, ...restProps } = this.props;
        return (
            <input
                {...restProps}
                ref={inputRef}
                value={isComposing ? localValue : externalValue}
                onCompositionStart={this.handleCompositionStart}
                onCompositionEnd={this.handleCompositionEnd}
                onChange={this.handleChange}
            />
        );
    }

    private handleCompositionStart = (e: React.CompositionEvent<HTMLInputElement>) => {
        this.setState({
            isComposing: true,
            // Make sure that localValue matches externalValue, in case externalValue
            // has changed since the last onChange event.
            localValue: this.state.externalValue,
        });
        this.props.onCompositionStart?.(e);
    };

    private handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        this.setState({ isComposing: false });
        this.props.onCompositionEnd?.(e);
    };

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        this.setState({ localValue: value });
        this.props.onChange?.(e);
    };
}
