/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { IProps } from "../../common/props";

export interface IOverflowEllipsisState {
    content?: string;
}

@PureRender
export class OverflowEllipsis extends React.Component<IProps, IOverflowEllipsisState> {
    public state: IOverflowEllipsisState = {};

    private rootRef: HTMLElement;

    public componentDidMount() {
        this.updateContent();
    }

    public componentDidUpdate() {
        this.updateContent();
    }

    public render() {
        return (
            <div
                className={classNames(this.props.className, "pt-text-overflow-ellipsis")}
                ref={this.storeRootRef}
                title={this.state.content}
            >
                {this.props.children}
            </div>
        );
    }

    private storeRootRef = (ref: HTMLElement) => {
        this.rootRef = ref;
    }

    private updateContent() {
        this.setState({ content: this.rootRef.textContent });
    }
}
