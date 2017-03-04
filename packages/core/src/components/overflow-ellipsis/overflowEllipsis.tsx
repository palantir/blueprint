/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IProps } from "../../common/props";

export interface IOverflowEllipsisState {
    textContent?: string;
}

@PureRender
export class OverflowEllipsis extends React.Component<IProps, IOverflowEllipsisState> {
    public state: IOverflowEllipsisState = {};

    private overflowRef: HTMLDivElement;
    private refHandlers = {
        root: (overflowElement: HTMLDivElement) => this.overflowRef = overflowElement,
    };

    public componentDidMount() {
        this.updateContent();
    }

    public componentDidUpdate() {
        this.updateContent();
    }

    public render() {
        return (
            <div
                className={classNames(Classes.TEXT_OVERFLOW_ELLIPSIS, this.props.className)}
                ref={this.refHandlers.root}
                title={this.state.textContent}
            >
                {this.props.children}
            </div>
        );
    }

    private updateContent() {
        this.setState({ textContent: this.overflowRef.textContent });
    }
}
