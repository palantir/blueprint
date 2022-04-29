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
import * as React from "react";

import { HTMLDivProps, Keys, Props, removeNonHTMLProps } from "@blueprintjs/core";
import { createKeyEventHandler } from "@blueprintjs/docs-theme";

export interface IClickToCopyProps extends Props, HTMLDivProps {
    children?: React.ReactNode;

    /**
     * Additional class names to apply after value has been copied
     *
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
export class ClickToCopy extends React.PureComponent<IClickToCopyProps, IClickToCopyState> {
    public static defaultProps: IClickToCopyProps = {
        copiedClassName: "docs-clipboard-copied",
        value: "",
    };

    public state: IClickToCopyState = {
        hasCopied: false,
    };

    private inputElement: HTMLInputElement;

    private refHandlers = {
        input: (input: HTMLInputElement) => (this.inputElement = input),
    };

    public render() {
        const { className, children, copiedClassName, value } = this.props;
        return (
            <div
                {...removeNonHTMLProps(this.props, ["copiedClassName", "value"], true)}
                className={classNames("docs-clipboard", className, {
                    [copiedClassName!]: this.state.hasCopied,
                })}
                onClick={this.handleClick}
                onMouseLeave={this.handleMouseLeave}
            >
                <input
                    onBlur={this.handleInputBlur}
                    onKeyDown={this.handleKeyDown}
                    readOnly={true}
                    ref={this.refHandlers.input}
                    value={value}
                />
                {children}
            </div>
        );
    }

    private copy = async () => {
        this.inputElement.select();
        await navigator.clipboard.writeText(this.inputElement.value);
        this.setState({ hasCopied: true });
    };

    private handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
        await this.copy();
        this.props.onClick?.(e);
    };

    private handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        this.setState({ hasCopied: false });
        this.props.onMouseLeave?.(e);
    };

    private handleInputBlur = () => {
        this.setState({ hasCopied: false });
    };

    // eslint-disable-line @typescript-eslint/member-ordering
    private handleKeyDown = createKeyEventHandler(
        {
            all: this.props.onKeyDown,
            [Keys.SPACE]: this.copy,
            [Keys.ENTER]: this.copy,
        },
        true,
    );
}
