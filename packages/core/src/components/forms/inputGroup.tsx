/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent2, Classes, IRef } from "../../common";
import * as Errors from "../../common/errors";
import {
    DISPLAYNAME_PREFIX,
    HTMLInputProps,
    IControlledProps,
    ControlledProps2,
    IntentProps,
    Props,
    MaybeElement,
    removeNonHTMLProps,
} from "../../common/props";
import { Icon, IconName } from "../icon/icon";
import { AsyncControllableInput } from "./asyncControllableInput";

// eslint-disable-next-line deprecation/deprecation
export type InputGroupProps = IInputGroupProps;

/**
 * @deprecated use IInputGroupProps2.
 *
 * NOTE: This interface does not extend HTMLInputProps due to incompatiblity with `IControlledProps`.
 * Instead, we union the props in the component definition, which does work and properly disallows `string[]` values.
 */
export interface IInputGroupProps
    // eslint-disable-next-line deprecation/deprecation
    extends IControlledProps,
        IntentProps,
        Props {
    /**
     * Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.
     * These may occur if you do not immediately call setState in a parent component with the value from
     * the `onChange` handler, or if working with certain libraries like __redux-form__.
     *
     * @default false
     */
    asyncControl?: boolean;

    /**
     * Whether the input is non-interactive.
     * Note that `rightElement` must be disabled separately; this prop will not affect it.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /** Ref handler or a ref object that receives HTML `<input>` element backing this component. */
    inputRef?: IRef<HTMLInputElement>;

    /**
     * Element to render on the left side of input.  This prop is mutually exclusive
     * with `leftIcon`.
     */
    leftElement?: JSX.Element;

    /**
     * Name of a Blueprint UI icon to render on the left side of the input group,
     * before the user's cursor.  This prop is mutually exclusive with `leftElement`.
     * Usage with content is deprecated.  Use `leftElement` for elements.
     */
    leftIcon?: IconName | MaybeElement;

    /** Whether this input should use large styles. */
    large?: boolean;

    /** Whether this input should use small styles. */
    small?: boolean;

    /** Placeholder text in the absence of any value. */
    placeholder?: string;

    /**
     * Element to render on right side of input.
     * For best results, use a minimal button, tag, or small spinner.
     */
    rightElement?: JSX.Element;

    /** Whether the input (and any buttons) should appear with rounded caps. */
    round?: boolean;

    /**
     * HTML `input` type attribute.
     *
     * @default "text"
     */
    type?: string;
}

// eslint-disable-next-line deprecation/deprecation
export type InputGroupProps2 = IInputGroupProps2;
/** @deprecated use InputGroupProps2 */
export interface IInputGroupProps2
    extends Omit<HTMLInputProps, keyof ControlledProps2>,
        ControlledProps2,
        IntentProps,
        Props {
    /**
     * Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.
     * These may occur if you do not immediately call setState in a parent component with the value from
     * the `onChange` handler, or if working with certain libraries like __redux-form__.
     *
     * @default false
     */
    asyncControl?: boolean;

    /**
     * Whether the input is non-interactive.
     * Note that `rightElement` must be disabled separately; this prop will not affect it.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;

    /** Ref handler or a ref object that receives HTML `<input>` element backing this component. */
    inputRef?: IRef<HTMLInputElement>;

    /**
     * Element to render on the left side of input.  This prop is mutually exclusive
     * with `leftIcon`.
     */
    leftElement?: JSX.Element;

    /**
     * Name of a Blueprint UI icon to render on the left side of the input group,
     * before the user's cursor.  This prop is mutually exclusive with `leftElement`.
     * Usage with content is deprecated.  Use `leftElement` for elements.
     */
    leftIcon?: IconName | MaybeElement;

    /** Whether this input should use large styles. */
    large?: boolean;

    /** Whether this input should use small styles. */
    small?: boolean;

    /** Placeholder text in the absence of any value. */
    placeholder?: string;

    /**
     * Element to render on right side of input.
     * For best results, use a minimal button, tag, or small spinner.
     */
    rightElement?: JSX.Element;

    /** Whether the input (and any buttons) should appear with rounded caps. */
    round?: boolean;

    /**
     * HTML `input` type attribute.
     *
     * @default "text"
     */
    type?: string;
}

export interface IInputGroupState {
    leftElementWidth?: number;
    rightElementWidth?: number;
}

@polyfill
export class InputGroup extends AbstractPureComponent2<InputGroupProps2, IInputGroupState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.InputGroup`;

    public state: IInputGroupState = {};

    private leftElement: HTMLElement | null = null;

    private rightElement: HTMLElement | null = null;

    private refHandlers = {
        leftElement: (ref: HTMLSpanElement | null) => (this.leftElement = ref),
        rightElement: (ref: HTMLSpanElement | null) => (this.rightElement = ref),
    };

    public render() {
        const { asyncControl = false, className, disabled, fill, inputRef, intent, large, small, round } = this.props;
        const inputGroupClasses = classNames(
            Classes.INPUT_GROUP,
            Classes.intentClass(intent),
            {
                [Classes.DISABLED]: disabled,
                [Classes.FILL]: fill,
                [Classes.LARGE]: large,
                [Classes.SMALL]: small,
                [Classes.ROUND]: round,
            },
            className,
        );
        const style: React.CSSProperties = {
            ...this.props.style,
            paddingLeft: this.state.leftElementWidth,
            paddingRight: this.state.rightElementWidth,
        };
        const inputProps = {
            type: "text",
            ...removeNonHTMLProps(this.props),
            className: Classes.INPUT,
            style,
        };

        return (
            <div className={inputGroupClasses}>
                {this.maybeRenderLeftElement()}
                {asyncControl ? (
                    <AsyncControllableInput {...inputProps} inputRef={inputRef} />
                ) : (
                    <input {...inputProps} ref={inputRef} />
                )}
                {this.maybeRenderRightElement()}
            </div>
        );
    }

    public componentDidMount() {
        this.updateInputWidth();
    }

    public componentDidUpdate(prevProps: InputGroupProps2) {
        const { leftElement, rightElement } = this.props;
        if (prevProps.leftElement !== leftElement || prevProps.rightElement !== rightElement) {
            this.updateInputWidth();
        }
    }

    protected validateProps(props: InputGroupProps2) {
        if (props.leftElement != null && props.leftIcon != null) {
            console.warn(Errors.INPUT_WARN_LEFT_ELEMENT_LEFT_ICON_MUTEX);
        }
    }

    private maybeRenderLeftElement() {
        const { leftElement, leftIcon } = this.props;

        if (leftElement != null) {
            return (
                <span className={Classes.INPUT_LEFT_CONTAINER} ref={this.refHandlers.leftElement}>
                    {leftElement}
                </span>
            );
        } else if (leftIcon != null) {
            return <Icon icon={leftIcon} aria-hidden={true} tabIndex={-1} />;
        }

        return undefined;
    }

    private maybeRenderRightElement() {
        const { rightElement } = this.props;
        if (rightElement == null) {
            return undefined;
        }
        return (
            <span className={Classes.INPUT_ACTION} ref={this.refHandlers.rightElement}>
                {rightElement}
            </span>
        );
    }

    private updateInputWidth() {
        const { leftElementWidth, rightElementWidth } = this.state;

        if (this.leftElement != null) {
            const { clientWidth } = this.leftElement;
            // small threshold to prevent infinite loops
            if (leftElementWidth === undefined || Math.abs(clientWidth - leftElementWidth) > 2) {
                this.setState({ leftElementWidth: clientWidth });
            }
        } else {
            this.setState({ leftElementWidth: undefined });
        }

        if (this.rightElement != null) {
            const { clientWidth } = this.rightElement;
            // small threshold to prevent infinite loops
            if (rightElementWidth === undefined || Math.abs(clientWidth - rightElementWidth) > 2) {
                this.setState({ rightElementWidth: clientWidth });
            }
        } else {
            this.setState({ rightElementWidth: undefined });
        }
    }
}
