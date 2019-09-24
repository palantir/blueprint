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
import { polyfill } from "react-lifecycles-compat";
import { AbstractPureComponent2, Classes } from "../../common";
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

@polyfill
export class Text extends AbstractPureComponent2<ITextProps, ITextState> {
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
        const { children, tagName = "div" } = this.props;

        return React.createElement(
            tagName,
            {
                className: classes,
                ref: (ref: HTMLElement | null) => (this.textRef = ref),
                title: this.state.isContentOverflowing ? this.state.textContent : undefined,
            },
            children,
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
