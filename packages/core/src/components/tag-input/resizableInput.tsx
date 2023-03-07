/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import React, { forwardRef, useEffect, useRef, useState } from "react";

import { Classes, DISPLAYNAME_PREFIX, HTMLInputProps } from "../../common";

export type Ref = HTMLInputElement;

export const ResizableInput = forwardRef<Ref, HTMLInputProps>(function ResizableInput(props, ref) {
    const [content, setContent] = useState("");
    const [width, setWidth] = useState(0);
    const span = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (span.current != null) {
            setWidth(span.current.offsetWidth);
        }
    }, [content]);

    const { onChange, style, ...otherProps } = props;

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
        onChange?.(evt);
        setContent(evt?.target?.value ?? "");
    };

    return (
        <>
            <span ref={span} className={Classes.RESIZABLE_INPUT_SPAN} aria-hidden={true}>
                {/* Need to replace spaces with the html character for them to be preserved */}
                {content.replace(/ /g, "\u00a0")}
            </span>
            <input {...otherProps} type="text" style={{ ...style, width }} onChange={handleInputChange} ref={ref} />
        </>
    );
});
ResizableInput.displayName = `${DISPLAYNAME_PREFIX}.ResizableInput`;
