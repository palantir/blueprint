/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export class PopoverInlineExample extends BaseExample<{}> {
    protected className = "docs-popover-inline-example";

    private scrollContainer1Ref: HTMLDivElement;
    private scrollContainer2Ref: HTMLDivElement;
    private refHandlers = {
        scrollContainer1: (ref: HTMLDivElement) => (this.scrollContainer1Ref = ref),
        scrollContainer2: (ref: HTMLDivElement) => (this.scrollContainer2Ref = ref),
    };

    public componentDidMount() {
        this.recenter();
    }

    protected renderExample() {
        return (
            <div className="docs-popover-inline-example-content">
                <div className="docs-popover-inline-example-scroll-container" ref={this.refHandlers.scrollContainer1}>
                    <div className="docs-popover-inline-example-scroll-content">
                        <Popover
                            content="I am a default popover."
                            inline={false}
                            isOpen={true}
                            modifiers={{ preventOverflow: { boundariesElement: "window" } }}
                            popoverClassName="docs-popover-inline-example-popover"
                            position={Position.BOTTOM}
                        >
                            <Button>
                                <code>{`inline={false}`}</code>
                            </Button>
                        </Popover>
                    </div>
                </div>
                <div className="docs-popover-inline-example-scroll-container" ref={this.refHandlers.scrollContainer2}>
                    <div className="docs-popover-inline-example-scroll-content">
                        <Popover
                            content="I am an inline popover."
                            inline={true}
                            isOpen={true}
                            modifiers={{ preventOverflow: { boundariesElement: "window" } }}
                            popoverClassName="docs-popover-inline-example-popover"
                            position={Position.BOTTOM}
                        >
                            <Button>
                                <code>{`inline={true}`}</code>
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
        this.scrollToCenter(this.scrollContainer1Ref);
        this.scrollToCenter(this.scrollContainer2Ref);
    };

    private scrollToCenter = (scrollContainer?: HTMLDivElement) => {
        if (scrollContainer != null) {
            const contentWidth = scrollContainer.children[0].clientWidth;
            scrollContainer.scrollLeft = contentWidth / 4;
        }
    };
}
