/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import React, { forwardRef, useEffect, useRef, useState } from "react";

import { HTMLInputProps } from "../../common";

type ResizeableInputProps = HTMLInputProps;
export type Ref = HTMLInputElement;

export const ResizeableInput = forwardRef<Ref, ResizeableInputProps>(function ResizeableInput(props, ref) {
    const [content, setContent] = useState("");
    const [width, setWidth] = useState(0);
    const span = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (span.current) {
            setWidth(span.current.offsetWidth);
        }
    }, [content]);

    const { onChange, ...otherProps } = props;

    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = evt => {
        setContent(evt.target.value);
        onChange?.(evt);
    };

    return (
        <span>
            <span
                id="hide"
                ref={span}
                style={{
                    maxHeight: "0",
                    maxWidth: "100%",
                    minWidth: "80px",
                    position: "absolute",
                    whiteSpace: "nowrap",
                    zIndex: -100,
                }}
            >
                {/* Need to replace spaces with the html character for them to be preserved */}
                {content.replace(/ /g, "\u00a0")}
            </span>
            <input type="text" style={{ width }} autoFocus={true} onChange={changeHandler} ref={ref} {...otherProps} />
        </span>
    );
});
