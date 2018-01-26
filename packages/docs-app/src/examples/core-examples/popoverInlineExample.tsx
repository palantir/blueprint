/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, IPopoverProps, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

export interface IPopoverInlineExampleState {
    hasMounted?: boolean;
}

export class PopoverInlineExample extends BaseExample<IPopoverInlineExampleState> {
    public state: IPopoverInlineExampleState = {
        hasMounted: false,
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
        this.setState({ hasMounted: true });
    }

    protected renderExample() {
        const popoverBaseProps: IPopoverProps = {
            enforceFocus: false,
            // set to true after the initial mount, because Popper.js's
            // `keepTogether` functionality apparently doesn't work once you
            // render an open popover in a portal on mount.
            isOpen: this.state.hasMounted ? true : false,
            // not relevant to this example, but required in order for default
            // modifiers to work (e.g. `hide`).
            modifiers: { preventOverflow: { boundariesElement: "window" } },
            popoverClassName: "docs-popover-inline-example-popover",
            position: Position.BOTTOM,
        };

        return (
            <div className="docs-popover-inline-example-content">
                <div
                    className="docs-popover-inline-example-scroll-container"
                    ref={this.refHandlers.scrollContainerLeft}
                    onScroll={this.syncScrollLeft}
                >
                    <div className="docs-popover-inline-example-scroll-content">
                        <Popover {...popoverBaseProps} content="I am a default popover." usePortal={false}>
                            <Button>
                                <code>{`usePortal={false}`}</code>
                            </Button>
                        </Popover>
                    </div>
                </div>
                <div
                    className="docs-popover-inline-example-scroll-container"
                    ref={this.refHandlers.scrollContainerRight}
                    onScroll={this.syncScrollRight}
                >
                    <div className="docs-popover-inline-example-scroll-content">
                        <Popover {...popoverBaseProps} content="I am in a Portal." usePortal={true}>
                            <Button>
                                <code>{`usePortal={true}`}</code>
                            </Button>
                        </Popover>
                    </div>
                </div>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Button
                    key="recenter"
                    text="Re-center"
                    iconName="pt-icon-alignment-vertical-center"
                    onClick={this.recenter}
                />,
            ],
        ];
    }

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
