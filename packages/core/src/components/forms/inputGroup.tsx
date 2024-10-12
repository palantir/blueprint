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

import { Classes } from "../../common";
import * as Errors from "../../common/errors";
import {
    type ControlledValueProps,
    DISPLAYNAME_PREFIX,
    type HTMLInputProps,
    removeNonHTMLProps,
} from "../../common/props";
import { Icon } from "../icon/icon";

import { AsyncControllableInput } from "./asyncControllableInput";
import type { InputSharedProps } from "./inputSharedProps";

type ControlledInputValueProps = ControlledValueProps<string, HTMLInputElement>;

export interface InputGroupProps
    extends Omit<HTMLInputProps, keyof ControlledInputValueProps>,
        ControlledInputValueProps,
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

    /** Whether this input should use small styles. */
    small?: boolean;

    /** Whether the input (and any buttons) should appear with rounded caps. */
    round?: boolean;

    /**
     * Name of the HTML tag that contains the input group.
     *
     * @default "div"
     */
    tagName?: keyof React.JSX.IntrinsicElements;

    /**
     * HTML `input` type attribute.
     *
     * @default "text"
     */
    type?: string;
}

const NON_HTML_PROPS: Array<keyof InputGroupProps> = ["onValueChange"];

/**
 * Input group component.
 *
 * @see https://blueprintjs.com/docs/#core/components/input-group
 */
export const InputGroup: React.FC<InputGroupProps> = props => {
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
    } = props;

    const [leftElementWidth, setLeftElementWidth] = React.useState<number>();
    const [rightElementWidth, setRightElementWidth] = React.useState<number>();

    const leftElementRef = React.useRef<HTMLSpanElement | null>(null);
    const rightElementRef = React.useRef<HTMLSpanElement | null>(null);

    const updateInputWidth = React.useCallback(() => {
        if (leftElementRef.current) {
            const { clientWidth } = leftElementRef.current;
            if (leftElementWidth === undefined || Math.abs(clientWidth - leftElementWidth) > 2) {
                setLeftElementWidth(clientWidth);
            }
        } else {
            setLeftElementWidth(undefined);
        }

        if (rightElementRef.current) {
            const { clientWidth } = rightElementRef.current;
            if (rightElementWidth === undefined || Math.abs(clientWidth - rightElementWidth) > 2) {
                setRightElementWidth(clientWidth);
            }
        } else {
            setRightElementWidth(undefined);
        }
    }, [leftElementWidth, rightElementWidth]);

    React.useEffect(() => {
        updateInputWidth();
    }, [props.leftElement, props.rightElement, updateInputWidth]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        props.onChange?.(event);
        props.onValueChange?.(value, event.target);
    };

    const maybeRenderLeftElement = () => {
        const { leftElement, leftIcon } = props;

        if (leftElement != null) {
            return (
                <span className={Classes.INPUT_LEFT_CONTAINER} ref={leftElementRef}>
                    {leftElement}
                </span>
            );
        } else if (leftIcon != null) {
            return <Icon icon={leftIcon} aria-hidden={true} tabIndex={-1} />;
        }

        return undefined;
    };

    const maybeRenderRightElement = () => {
        const { rightElement } = props;
        return (
            rightElement && (
                <span className={Classes.INPUT_ACTION} ref={rightElementRef}>
                    {rightElement}
                </span>
            )
        );
    };

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
        ...props.style,
        paddingLeft: leftElementWidth,
        paddingRight: rightElementWidth,
    };

    const inputProps = {
        type: "text",
        ...removeNonHTMLProps(props, NON_HTML_PROPS, true),
        "aria-disabled": disabled,
        className: classNames(Classes.INPUT, inputClassName),
        onChange: handleInputChange,
        style,
    } satisfies React.HTMLProps<HTMLInputElement>;

    const inputElement = asyncControl ? (
        <AsyncControllableInput {...inputProps} inputRef={inputRef} />
    ) : (
        <input {...inputProps} ref={inputRef} />
    );

    return React.createElement(
        tagName,
        { className: inputGroupClasses },
        maybeRenderLeftElement(),
        inputElement,
        maybeRenderRightElement(),
    );
};

InputGroup.displayName = `${DISPLAYNAME_PREFIX}.InputGroup`;
