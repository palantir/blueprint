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

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface ITextProps extends IProps {
    /**
     * Indicates that this component should be truncated with an ellipsis if it overflows its container.
     * The `title` attribute will also be added when content overflows to show the full text of the children on hover.
     * @default false
     */
    ellipsize?: boolean;
}

export interface ITextState {
    textContent: string;
    isContentOverflowing: boolean;
}

@PureRender
export class Text extends React.Component<ITextProps, ITextState> {
    public state: ITextState = {
        isContentOverflowing: false,
        textContent: "",
    };

    private textRef: HTMLDivElement;
    private refHandlers = {
        text: (overflowElement: HTMLDivElement) => (this.textRef = overflowElement),
    };

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
        return (
            <div
                className={classes}
                ref={this.refHandlers.text}
                title={this.state.isContentOverflowing ? this.state.textContent : undefined}
            >
                {this.props.children}
            </div>
        );
    }

    private update() {
        const newState = {
            isContentOverflowing: this.props.ellipsize && this.textRef.scrollWidth > this.textRef.clientWidth,
            textContent: this.textRef.textContent,
        };
        this.setState(newState);
    }
}
