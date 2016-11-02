/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

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
            <div className="bp-table-rounded-layout" ref={this.setContainerRef}>
                <div className="bp-table-no-layout" ref={this.setInternalRef}>
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
