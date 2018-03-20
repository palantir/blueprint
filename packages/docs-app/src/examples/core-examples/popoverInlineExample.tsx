/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, IPopoverProps, Popover, Position, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

export interface IPopoverInlineExampleState {
    isOpen: boolean;
}

export class PopoverInlineExample extends BaseExample<IPopoverInlineExampleState> {
    public state: IPopoverInlineExampleState = {
        isOpen: false,
    };

    protected className = "docs-popover-inline-example";

    private scrollContainerLeftRef: HTMLDivElement;
    private scrollContainerRightRef: HTMLDivElement;
    private refHandlers = {
        scrollContainerLeft: (ref: HTMLDivElement) => (this.scrollContainerLeftRef = ref),
        scrollContainerRight: (ref: HTMLDivElement) => (this.scrollContainerRightRef = ref),
    };

    public componentDidMount() {
        this.recenter();
    }

    protected renderExample() {
        const { isOpen } = this.state;
        return (
            <div className="docs-popover-inline-example-content">
                <div
                    className="docs-popover-inline-example-scroll-container"
                    ref={this.refHandlers.scrollContainerLeft}
                    onScroll={this.syncScrollLeft}
                >
                    <div className="docs-popover-inline-example-scroll-content">
                        <Popover
                            {...POPOVER_PROPS}
                            content="I am in a Portal (default)."
                            isOpen={isOpen}
                            usePortal={true}
                        >
                            <code>{`usePortal={true}`}</code>
                        </Popover>
                    </div>
                </div>
                <div
                    className="docs-popover-inline-example-scroll-container"
                    ref={this.refHandlers.scrollContainerRight}
                    onScroll={this.syncScrollRight}
                >
                    <div className="docs-popover-inline-example-scroll-content">
                        <Popover {...POPOVER_PROPS} content="I am an inline popover." isOpen={isOpen} usePortal={false}>
                            <code>{`usePortal={false}`}</code>
                        </Popover>
                    </div>
                </div>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch key="open" checked={this.state.isOpen} label="Open" onChange={this.handleOpen} />,
                <Button key="recenter" text="Re-center" icon="alignment-vertical-center" onClick={this.recenter} />,
            ],
        ];
    }

    private handleOpen = () => this.setState({ isOpen: !this.state.isOpen });

    private recenter = () => {
        this.scrollToCenter(this.scrollContainerLeftRef);
        this.scrollToCenter(this.scrollContainerRightRef);
    };

    private scrollToCenter = (scrollContainer?: HTMLDivElement) => {
        if (scrollContainer != null) {
            const contentWidth = scrollContainer.children[0].clientWidth;
            scrollContainer.scrollLeft = contentWidth / 4;
        }
    };

    private syncScrollLeft = () => {
        // use rAF to throttle scroll-sync calculations; otherwise, scrolling is noticeably choppy.
        return requestAnimationFrame(() => this.syncScroll(this.scrollContainerLeftRef, this.scrollContainerRightRef));
    };

    private syncScrollRight = () => {
        return requestAnimationFrame(() => this.syncScroll(this.scrollContainerRightRef, this.scrollContainerLeftRef));
    };

    private syncScroll(sourceContainer: HTMLDivElement, otherContainer: HTMLDivElement) {
        if (sourceContainer != null && otherContainer != null) {
            otherContainer.scrollLeft = sourceContainer.scrollLeft;
        }
    }
}

const POPOVER_PROPS: IPopoverProps = {
    enforceFocus: false,
    // not relevant to this example, but required in order for default
    // modifiers to work (e.g. `hide`).
    modifiers: { preventOverflow: { boundariesElement: "window" } },
    popoverClassName: "docs-popover-inline-example-popover",
    position: Position.BOTTOM,
};
