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

import { AbstractPureComponent, Classes } from "../../common";
import * as Errors from "../../common/errors";
import { type ControlledProps, DISPLAYNAME_PREFIX, type HTMLInputProps, removeNonHTMLProps } from "../../common/props";
import { Icon } from "../icon/icon";
import { AsyncControllableInput } from "./asyncControllableInput";
import type { InputSharedProps } from "./inputSharedProps";

export interface InputGroupProps
    extends Omit<HTMLInputProps, keyof ControlledProps>,
        ControlledProps,
        InputSharedProps {
    /**
     * Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.
     * These may occur if you do not immediately call setState in a parent component with the value from
     * the `onChange` handler, or if working with certain libraries like __redux-form__.
     *
     * @default false
     */
    asyncControl?: boolean;

    /** Whether this input should use large styles. */
    large?: boolean;

    /**
     * Callback invoked when the input value changes, typically via keyboard interactions.
     *
     * Using this prop instead of `onChange` can help avoid common bugs in React 16 related to Event Pooling
     * where developers forget to save the text value from a change event or call `event.persist()`.
     *
     * @see https://legacy.reactjs.org/docs/legacy-event-pooling.html
     */
    onValueChange?(value: string, targetElement: HTMLInputElement | null): void;

    /** Whether this input should use small styles. */
    small?: boolean;

    /** Whether the input (and any buttons) should appear with rounded caps. */
    round?: boolean;

    /**
     * Name of the HTML tag that contains the input group.
     *
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * HTML `input` type attribute.
     *
     * @default "text"
     */
    type?: string;
}

export interface InputGroupState {
    leftElementWidth?: number;
    rightElementWidth?: number;
}

const NON_HTML_PROPS: Array<keyof InputGroupProps> = ["onValueChange"];

/**
 * Input group component.
 *
 * @see https://blueprintjs.com/docs/#core/components/input-group
 */
export class InputGroup extends AbstractPureComponent<InputGroupProps, InputGroupState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.InputGroup`;

    public state: InputGroupState = {};

    private leftElement: HTMLElement | null = null;

    private rightElement: HTMLElement | null = null;

    private refHandlers = {
        leftElement: (ref: HTMLSpanElement | null) => (this.leftElement = ref),
        rightElement: (ref: HTMLSpanElement | null) => (this.rightElement = ref),
    };

    public render() {
        const {
            asyncControl = false,
            className,
            disabled,
            fill,
            inputClassName,
            inputRef,
            intent,
            large,
            readOnly,
            round,
            small,
            tagName = "div",
        } = this.props;
        const inputGroupClasses = classNames(
            Classes.INPUT_GROUP,
            Classes.intentClass(intent),
            {
                [Classes.DISABLED]: disabled,
                [Classes.READ_ONLY]: readOnly,
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
            ...removeNonHTMLProps(this.props, NON_HTML_PROPS, true),
            className: classNames(Classes.INPUT, inputClassName),
            onChange: this.handleInputChange,
            style,
        };
        const inputElement = asyncControl ? (
            <AsyncControllableInput {...inputProps} inputRef={inputRef} />
        ) : (
            <input {...inputProps} ref={inputRef} />
        );

        return React.createElement(
            tagName,
            { className: inputGroupClasses },
            this.maybeRenderLeftElement(),
            inputElement,
            this.maybeRenderRightElement(),
        );
    }

    public componentDidMount() {
        this.updateInputWidth();
    }

    public componentDidUpdate(prevProps: InputGroupProps) {
        const { leftElement, rightElement } = this.props;
        if (prevProps.leftElement !== leftElement || prevProps.rightElement !== rightElement) {
            this.updateInputWidth();
        }
    }

    protected validateProps(props: InputGroupProps) {
        if (props.leftElement != null && props.leftIcon != null) {
            console.warn(Errors.INPUT_WARN_LEFT_ELEMENT_LEFT_ICON_MUTEX);
        }
    }

    private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        this.props.onChange?.(event);
        this.props.onValueChange?.(value, event.target);
    };

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
