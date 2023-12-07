/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { Classes, DISPLAYNAME_PREFIX, type HTMLInputProps } from "../../common";

export type Ref = HTMLInputElement;

export const ResizableInput = React.forwardRef<Ref, HTMLInputProps>(function ResizableInput(props, ref) {
    const [content, setContent] = React.useState("");
    const [width, setWidth] = React.useState(0);
    const span = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
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
