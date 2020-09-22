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
import { shallowCompareKeys } from "../../common/utils";

export interface IAsyncControllableInputProps
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    inputRef?: React.LegacyRef<HTMLInputElement>;
}

type InputValue = IAsyncControllableInputProps["value"];

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
    value: InputValue;

    /**
     * The latest input value, which updates during IME composition. If undefined, we use
     * value instead.
     */
    nextValue: InputValue;
}

/**
 * A stateful wrapper around the low-level <input> component which works around a
 * [React bug](https://github.com/facebook/react/issues/3926). This bug is reproduced when an input
 * receives CompositionEvents (for example, through IME composition) and has its value prop updated
 * asychronously. This might happen if a component chooses to do async validation of a value
 * returned by the input's `onChange` callback.
 *
 * Note: this component does not apply any Blueprint-specific styling.
 */
@polyfill
export class AsyncControllableInput extends React.Component<
    IAsyncControllableInputProps,
    IAsyncControllableInputState
> {
    public state: IAsyncControllableInputState = {
        isComposing: false,
        nextValue: this.props.value,
        value: this.props.value,
    };

    public static getDerivedStateFromProps(
        nextProps: IAsyncControllableInputProps,
        nextState: IAsyncControllableInputState,
    ): Partial<IAsyncControllableInputState> | null {
        if (nextState.isComposing) {
            // don't derive anything from props, we'll do that after composition ends
            return null;
        }

        const userTriggeredUpdate = nextState.nextValue !== nextState.value;

        if (userTriggeredUpdate) {
            if (nextProps.value !== nextState.nextValue) {
                // accept controlled update overriding user action
                return { value: nextProps.value, nextValue: nextProps.value };
            }
        } else {
            // accept controlled update, could be confirming or denying user action
            return { value: nextProps.value, nextValue: nextProps.value };
        }

        return null;
    }

    public shouldComponentUpdate(nextProps: IAsyncControllableInputProps, nextState: IAsyncControllableInputState) {
        // equivalent to a React.PureComponent
        const hasShallowDifference =
            !shallowCompareKeys(this.props, nextProps) || !shallowCompareKeys(this.state, nextState);

        if (this.props.value != null) {
            // controlled mode
            if (!nextState.isComposing) {
                // during composition, we behave like a normal input, so we don't have to worry about async stuff
                // otherwise, we need special handling for async controlled updates

                const userTriggeredUpdate = nextState.nextValue !== nextState.value;
                const hasParentFlushedNewValue = nextProps.value === nextState.nextValue;

                if (userTriggeredUpdate && !hasParentFlushedNewValue) {
                    // async update hasn't flushed down to us yet, so hold off on rendering
                    // to avoid the side effect of the input cursor jumping to the end
                    return false;
                }
            }
        }

        return hasShallowDifference;
    }

    public render() {
        const { isComposing, value, nextValue } = this.state;
        const { inputRef, ...restProps } = this.props;
        return (
            <input
                {...restProps}
                ref={inputRef}
                value={isComposing ? nextValue : value}
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
            nextValue: this.state.value,
        });
        this.props.onCompositionStart?.(e);
    };

    private handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        this.setState({ isComposing: false });
        this.props.onCompositionEnd?.(e);
    };

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        this.setState({ nextValue: value });
        this.props.onChange?.(e);
    };
}
