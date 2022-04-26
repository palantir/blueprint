/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Code, H5, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Popover2, Popover2Props } from "@blueprintjs/popover2";

const POPOVER2_PROPS: Partial<Popover2Props> = {
    autoFocus: false,
    enforceFocus: false,
    modifiers: {
        flip: { options: { rootBoundary: "document" } },
        preventOverflow: { options: { rootBoundary: "document" } },
    },
    placement: "bottom",
    popoverClassName: "docs-popover2-portal-example-popover",
};

export interface IPopover2PortalExampleState {
    isOpen: boolean;
}

export class Popover2PortalExample extends React.PureComponent<IExampleProps, IPopover2PortalExampleState> {
    public static displayName = "Popover2PortalExample";

    public state: IPopover2PortalExampleState = {
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
        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Open" checked={this.state.isOpen} onChange={this.handleOpen} />
                <H5>Example</H5>
                <Button text="Re-center" icon="alignment-vertical-center" onClick={this.recenter} />
            </>
        );

        return (
            <Example className="docs-popover2-portal-example" options={options} {...this.props}>
                <div
                    className="docs-popover2-portal-example-scroll-container"
                    ref={this.refHandlers.scrollContainerLeft}
                    onScroll={this.syncScrollLeft}
                >
                    <div className="docs-popover2-portal-example-scroll-content">
                        <Popover2
                            {...POPOVER2_PROPS}
                            content="I am in a Portal (default)."
                            isOpen={this.state.isOpen}
                            usePortal={true}
                            renderTarget={({ isOpen, ref, ...p }) => (
                                <Code {...p} elementRef={ref}>{`usePortal={true}`}</Code>
                            )}
                        />
                    </div>
                </div>
                <div
                    className="docs-popover2-portal-example-scroll-container"
                    ref={this.refHandlers.scrollContainerRight}
                    onScroll={this.syncScrollRight}
                >
                    <div className="docs-popover2-portal-example-scroll-content">
                        <Popover2
                            {...POPOVER2_PROPS}
                            content="I am an inline popover."
                            isOpen={this.state.isOpen}
                            usePortal={false}
                            modifiers={{
                                preventOverflow: { enabled: false },
                            }}
                            renderTarget={({ isOpen, ref, ...p }) => (
                                <Code {...p} elementRef={ref}>{`usePortal={false}`}</Code>
                            )}
                        />
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
