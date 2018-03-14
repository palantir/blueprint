/// <reference types="react" />
import * as React from "react";
import { IProps } from "@blueprintjs/core";
export interface IClickToCopyProps extends IProps, React.HTMLProps<HTMLDivElement> {
    /**
     * Additional class names to apply after value has been copied
     * @default "docs-clipboard-copied"
     */
    copiedClassName?: string;
    /** Value to copy when clicked */
    value: string;
}
export interface IClickToCopyState {
    hasCopied?: boolean;
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
export declare class ClickToCopy extends React.PureComponent<IClickToCopyProps, IClickToCopyState> {
    static defaultProps: IClickToCopyProps;
    state: IClickToCopyState;
    private inputElement;
    private refHandlers;
    render(): JSX.Element;
    private handleClickEvent;
    private handleKeyDown;
    private handleMouseLeave;
}
