/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import React, { forwardRef, useEffect, useRef, useState } from "react";

import { HTMLInputProps } from "../../common";

type ResizableInputProps = HTMLInputProps;
export type Ref = HTMLInputElement;

export const ResizableInput = forwardRef<Ref, ResizableInputProps>(function ResizableInput(props, ref) {
    const [content, setContent] = useState("");
    const [width, setWidth] = useState(0);
    const span = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (span.current != null) {
            setWidth(span.current.offsetWidth);
        }
    }, [content]);

    const { onChange, ...otherProps } = props;

    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = evt => {
        onChange?.(evt);
        setContent(evt?.target?.value ?? "");
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
            <input {...otherProps} type="text" style={{ width }} onChange={changeHandler} ref={ref} />
        </span>
    );
});
