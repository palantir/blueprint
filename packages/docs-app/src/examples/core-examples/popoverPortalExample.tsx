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

import * as React from "react";

import { Button, Code, H5, IPopoverProps, Popover, Position, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export interface IPopoverPortalExampleState {
    isOpen: boolean;
}

export class PopoverPortalExample extends React.PureComponent<IExampleProps, IPopoverPortalExampleState> {
    public state: IPopoverPortalExampleState = {
        isOpen: true,
    };

    private scrollContainerLeftRef: HTMLDivElement;
    private scrollContainerRightRef: HTMLDivElement;
    private refHandlers = {
        scrollContainerLeft: (ref: HTMLDivElement) => (this.scrollContainerLeftRef = ref),
        scrollContainerRight: (ref: HTMLDivElement) => (this.scrollContainerRightRef = ref),
    };

    public componentDidMount() {
        requestAnimationFrame(this.recenter);
    }

    public render() {
        const { isOpen } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Open" checked={isOpen} onChange={this.handleOpen} />
                <H5>Example</H5>
                <Button text="Re-center" icon="alignment-vertical-center" onClick={this.recenter} />
            </>
        );

        return (
            <Example className="docs-popover-portal-example" options={options} {...this.props}>
                <div
                    className="docs-popover-portal-example-scroll-container"
                    ref={this.refHandlers.scrollContainerLeft}
                    onScroll={this.syncScrollLeft}
                >
                    <div className="docs-popover-portal-example-scroll-content">
                        <Popover
                            {...POPOVER_PROPS}
                            content="I am in a Portal (default)."
                            isOpen={isOpen}
                            usePortal={true}
                        >
                            <Code>{`usePortal={true}`}</Code>
                        </Popover>
                    </div>
                </div>
                <div
                    className="docs-popover-portal-example-scroll-container"
                    ref={this.refHandlers.scrollContainerRight}
                    onScroll={this.syncScrollRight}
                >
                    <div className="docs-popover-portal-example-scroll-content">
                        <Popover {...POPOVER_PROPS} content="I am an inline popover." isOpen={isOpen} usePortal={false}>
                            <Code>{`usePortal={false}`}</Code>
                        </Popover>
                    </div>
                </div>
                <em style={{ textAlign: "center", width: "100%" }}>
                    Scroll either container and notice what happens when the <Code>Popover</Code> tries to leave.
                </em>
            </Example>
        );
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
    autoFocus: false,
    boundary: "window",
    enforceFocus: false,
    popoverClassName: "docs-popover-portal-example-popover",
    position: Position.BOTTOM,
};
