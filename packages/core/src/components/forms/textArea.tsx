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

import { Classes, setRef } from "../../common";
import { DISPLAYNAME_PREFIX, type IntentProps, type Props } from "../../common/props";

import { AsyncControllableTextArea } from "./asyncControllableTextArea";

export interface TextAreaProps extends IntentProps, Props, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /**
     * Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.
     * These may occur if you do not immediately call setState in a parent component with the value from
     * the `onChange` handler, or if working with certain libraries like __redux-form__.
     *
     * @default false
     */
    asyncControl?: boolean;

    /**
     * Whether the component should automatically resize vertically as a user types in the text input.
     * This will disable manual resizing in the vertical dimension.
     *
     * @default false
     */
    autoResize?: boolean;

    /**
     * Whether the text area should take up the full width of its container.
     *
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the text area should automatically grow vertically to accomodate content.
     *
     * @deprecated use the `autoResize` prop instead.
     */
    growVertically?: boolean;

    /**
     * Ref handler that receives HTML `<textarea>` element backing this component.
     */
    inputRef?: React.Ref<HTMLTextAreaElement>;

    /**
     * Whether the text area should appear with large styling.
     *
     * @default false
     */
    large?: boolean;

    /**
     * Whether the text area should appear with small styling.
     *
     * @default false
     */
    small?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
/**
 * Text area component.
 *
 * @see https://blueprintjs.com/docs/#core/components/text-area
 */
export const TextArea: React.FC<TextAreaProps> = ({
    asyncControl = false,
    autoResize = false,
    className,
    fill = false,
    growVertically = false,
    inputRef,
    intent,
    large = false,
    small = false,
    style,
    ...htmlProps
}) => {
    const [height, setHeight] = React.useState<number>();
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const maybeSyncHeightToScrollHeight = React.useCallback(() => {
        if (textareaRef.current != null) {
            const { scrollHeight } = textareaRef.current;

            if (autoResize) {
                // set height to 0 to force scrollHeight to be the minimum height to fit
                // the content of the textarea
                textareaRef.current.style.height = "0px";
                textareaRef.current.style.height = `${scrollHeight}px`;
                setHeight(scrollHeight);
            } else if (growVertically && scrollHeight > 0) {
                // N.B. this code path will be deleted in Blueprint v6.0 when `growVertically` is removed
                setHeight(scrollHeight);
            }
        }

        if (autoResize && textareaRef.current != null) {
            // set height to 0 to force scrollHeight to be the minimum height to fit
            // the content of the textarea
            textareaRef.current.style.height = "0px";

            const { scrollHeight } = textareaRef.current;
            textareaRef.current.style.height = scrollHeight.toString() + "px";
            setHeight(scrollHeight);
        }
    }, [autoResize, growVertically]);

    React.useEffect(() => {
        maybeSyncHeightToScrollHeight();
    }, [maybeSyncHeightToScrollHeight, htmlProps.value, style]);

    React.useEffect(() => {
        setRef(inputRef, textareaRef.current);
    }, [inputRef]);

    const rootClasses = classNames(
        Classes.INPUT,
        Classes.TEXT_AREA,
        Classes.intentClass(intent),
        {
            [Classes.FILL]: fill,
            [Classes.LARGE]: large,
            [Classes.SMALL]: small,
            [Classes.TEXT_AREA_AUTO_RESIZE]: autoResize,
        },
        className,
    );

    // add explicit height style while preserving user-supplied styles if they exist
    if ((autoResize || growVertically) && height != null) {
        // this style object becomes non-extensible when mounted (at least in the enzyme renderer),
        // so we make a new one to add a property
        style = {
            ...style,
            height: `${height}px`,
        };
    }

    const TextAreaComponent = asyncControl ? AsyncControllableTextArea : "textarea";

    return (
        <TextAreaComponent
            {...htmlProps}
            className={rootClasses}
            onChange={handleChange}
            style={style}
            ref={inputRef}
        />
    );

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (autoResize || growVertically) {
            // set height to 0 to force scrollHeight to be the minimum height to fit
            // the content of the textarea
            e.target.style.height = "0px";

            const { scrollHeight } = e.target;
            e.target.style.height = scrollHeight.toString() + "px";
        }

        htmlProps.onChange?.(e);
    }
};

TextArea.displayName = `${DISPLAYNAME_PREFIX}.TextArea`;
