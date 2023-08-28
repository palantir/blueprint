/* !
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { DISPLAYNAME_PREFIX } from "../../common";
import { useAsyncControllableValue } from "../../hooks/useAsyncControllableValue";

export type AsyncControllableTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * A wrapper around the low-level <textarea> component which works around a React bug
 * the same way <AsyncControllableInput> does.
 */
export const AsyncControllableTextArea = React.forwardRef<HTMLTextAreaElement, AsyncControllableTextAreaProps>(
    function _AsyncControllableTextArea(props, ref) {
        const {
            value: parentValue,
            onChange: parentOnChange,
            onCompositionStart: parentOnCompositionStart,
            onCompositionEnd: parentOnCompositionEnd,
            ...restProps
        } = props;

        const { value, onChange, onCompositionStart, onCompositionEnd } = useAsyncControllableValue({
            onChange: parentOnChange,
            onCompositionEnd: parentOnCompositionEnd,
            onCompositionStart: parentOnCompositionStart,
            value: parentValue,
        });

        return (
            <textarea
                {...restProps}
                value={value}
                onChange={onChange}
                onCompositionStart={onCompositionStart}
                onCompositionEnd={onCompositionEnd}
                ref={ref}
            />
        );
    },
);
AsyncControllableTextArea.displayName = `${DISPLAYNAME_PREFIX}.AsyncControllableTextArea`;
