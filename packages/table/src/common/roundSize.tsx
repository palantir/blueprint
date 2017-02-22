/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";
import * as Classes from "./classes";

/**
 * A React component that measures and rounds the size of its only child. This
 * is necessary due to a Chrome bug that prevents scrolling when the size is
 * changed to a fractional value. See this JSFiddle for a repro of the issue:
 * https://jsfiddle.net/2rmz7p1d/5/
 */
export class RoundSize extends React.Component<{}, {}> {
    private internalElement: HTMLElement;
    private containerElement: HTMLElement;

    public render() {
        return (
            <div className={Classes.TABLE_ROUNDED_LAYOUT} ref={this.setContainerRef}>
                <div className={Classes.TABLE_NO_LAYOUT} ref={this.setInternalRef}>
                    {React.Children.only(this.props.children)}
                </div>
            </div>
        );
    }

    public componentDidMount() {
        this.copyRoundedSize();
    }

    public componentDidUpdate() {
        this.copyRoundedSize();
    }

    private copyRoundedSize() {
        if (this.internalElement == null || this.containerElement == null) {
            return;
        }

        // measure the size of the internal children
        const width = `${Math.round(this.internalElement.clientWidth)}px`;
        const height = `${Math.round(this.internalElement.clientHeight)}px`;

        // set the size of the container element with rounded values
        this.containerElement.style.width = width;
        this.containerElement.style.height = height;
    }

    private setInternalRef = (ref: HTMLElement) => this.internalElement = ref;
    private setContainerRef = (ref: HTMLElement) => this.containerElement = ref;
}
