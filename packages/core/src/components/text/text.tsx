/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";

export interface ITextProps extends IProps {
    /**
     * Indicates that this component should be truncated with an ellipsis if it overflows its container.
     * The `title` attribute will also be added when content overflows to show the full text of the children on hover.
     * @default false
     */
    ellipsize?: boolean;

    /**
     * HTML tag name to use for rendered element.
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;
}

export interface ITextState {
    textContent: string;
    isContentOverflowing: boolean;
}

export class Text extends React.PureComponent<ITextProps, ITextState> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Text`;

    public state: ITextState = {
        isContentOverflowing: false,
        textContent: "",
    };

    private textRef: HTMLElement | null = null;

    public componentDidMount() {
        this.update();
    }

    public componentDidUpdate() {
        this.update();
    }

    public render() {
        const classes = classNames(
            {
                [Classes.TEXT_OVERFLOW_ELLIPSIS]: this.props.ellipsize,
            },
            this.props.className,
        );
        const { tagName: TagName = "div" } = this.props;
        return (
            <TagName
                className={classes}
                ref={(ref: HTMLElement | null) => (this.textRef = ref)}
                title={this.state.isContentOverflowing ? this.state.textContent : undefined}
            >
                {this.props.children}
            </TagName>
        );
    }

    private update() {
        if (this.textRef == null) {
            return;
        }
        const newState = {
            isContentOverflowing: this.props.ellipsize && this.textRef.scrollWidth > this.textRef.clientWidth,
            textContent: this.textRef.textContent,
        };
        this.setState(newState);
    }
}
