/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
import React, { forwardRef, useCallback, useRef, useState } from "react";

import { HTMLDivProps, Props, Keys, removeNonHTMLProps } from "@blueprintjs/core";
import { createKeyEventHandler } from "@blueprintjs/docs-theme";

export interface ClickToCopyProps extends Props, React.RefAttributes<any>, HTMLDivProps {
    /**
     * Additional class names to apply after value has been copied
     *
     * @default "docs-clipboard-copied"
     */
    copiedClassName?: string;

    /** Value to copy when clicked */
    value: string;
}

/**
 * A handy little component that copies a given value to the clipboard when the user clicks it.
 * Provide a child element `.docs-clipboard-message`; the message will be rendered in an `::after`
 * pseudoelement and will automatically change on hover and after user has copied it.
 * Add the following `data-` attributes to that child element to customize the message:
 *  - `[data-message="<message>"]` will be shown by default, when the element is not interacted with.
 *  - `[data-hover-message="<message>"]` will be shown when the element is hovered.
 *  - `[data-copied-message="<message>"]` will be shown when the element has been copied.
 * The message is reset to default when the user mouses off the element after copying it.
 */
export const ClickToCopy: React.FC<ClickToCopyProps> = forwardRef<any, ClickToCopyProps>((props, ref) => {
    const { className, children, copiedClassName, value } = props;
    const [hasCopied, setHasCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>();

    const copy = useCallback(() => {
        inputRef.current?.select();
        document.execCommand("copy");
        setHasCopied(true);
    }, [inputRef]);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            copy();
            props.onClick?.(e);
        },
        [copy, props.onClick],
    );

    const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            setHasCopied(false);
            props.onMouseLeave?.(e);
        },
        [props.onMouseLeave],
    );

    const handleInputBlur = useCallback(() => {
        setHasCopied(false);
    }, []);

    const handleKeyDown = useCallback(
        createKeyEventHandler(
            {
                all: props.onKeyDown,
                [Keys.SPACE]: copy,
                [Keys.ENTER]: copy,
            },
            true,
        ),
        [copy, props.onKeyDown],
    );

    return (
        <div
            {...removeNonHTMLProps(props, ["copiedClassName", "value"], true)}
            className={classNames("docs-clipboard", className, {
                [copiedClassName!]: hasCopied,
            })}
            onClick={handleClick}
            onMouseLeave={handleMouseLeave}
            ref={ref}
        >
            <input onBlur={handleInputBlur} onKeyDown={handleKeyDown} readOnly={true} ref={inputRef} value={value} />
            {children}
        </div>
    );
});
ClickToCopy.displayName = "ClickToCopy";
ClickToCopy.defaultProps = {
    copiedClassName: "docs-clipboard-copied",
    value: "",
};
