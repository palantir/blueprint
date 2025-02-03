/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Code, H5, Popover, type PopoverProps, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

const POPOVER_PROPS: Partial<PopoverProps> = {
    autoFocus: false,
    enforceFocus: false,
    modifiers: {
        flip: { options: { rootBoundary: "document" } },
        preventOverflow: { options: { rootBoundary: "document" } },
    },
    placement: "bottom",
    popoverClassName: "docs-popover-portal-example-popover",
};

export const PopoverPortalExample: React.FC<ExampleProps> = props => {
    const [isOpen, setIsOpen] = React.useState(true);

    const scrollContainerLeftRef = React.useRef<HTMLDivElement>(null);
    const scrollContainerRightRef = React.useRef<HTMLDivElement>(null);

    const scrollToCenter = React.useCallback((scrollContainer: HTMLDivElement) => {
        if (scrollContainer != null) {
            const contentWidth = scrollContainer.children[0].clientWidth;
            scrollContainer.scrollLeft = contentWidth / 4;
        }
    }, []);

    const recenter = React.useCallback(() => {
        scrollToCenter(scrollContainerLeftRef.current);
        scrollToCenter(scrollContainerRightRef.current);
    }, [scrollToCenter]);

    const syncScroll = React.useCallback((sourceContainer: HTMLDivElement, otherContainer: HTMLDivElement) => {
        if (sourceContainer != null && otherContainer != null) {
            otherContainer.scrollLeft = sourceContainer.scrollLeft;
        }
    }, []);

    const syncScrollLeft = React.useCallback(() => {
        return requestAnimationFrame(() => syncScroll(scrollContainerLeftRef.current, scrollContainerRightRef.current));
    }, [syncScroll]);

    const syncScrollRight = React.useCallback(() => {
        return requestAnimationFrame(() => syncScroll(scrollContainerRightRef.current, scrollContainerLeftRef.current));
    }, [syncScroll]);

    React.useEffect(() => {
        const checkAndRecenter = () => {
            if (scrollContainerLeftRef.current && scrollContainerRightRef.current) {
                recenter();
            } else {
                requestAnimationFrame(checkAndRecenter);
            }
        };
        checkAndRecenter();
    }, [recenter]);

    const options = (
        <>
            <H5>Props</H5>
            <Switch label="Open" checked={isOpen} onChange={handleBooleanChange(setIsOpen)} />
            <H5>Example</H5>
            <Button text="Re-center" icon="alignment-vertical-center" onClick={recenter} />
        </>
    );

    return (
        <Example className="docs-popover-portal-example" options={options} {...props}>
            <div
                className="docs-popover-portal-example-scroll-container"
                onScroll={syncScrollLeft}
                ref={scrollContainerLeftRef}
            >
                <div className="docs-popover-portal-example-scroll-content">
                    <Popover
                        {...POPOVER_PROPS}
                        content="I am in a Portal (default)."
                        isOpen={isOpen}
                        renderTarget={({ isOpen: targetIsOpen, ...p }) => <Code {...p}>{`usePortal={true}`}</Code>}
                        usePortal={true}
                    />
                </div>
            </div>
            <div
                className="docs-popover-portal-example-scroll-container"
                onScroll={syncScrollRight}
                ref={scrollContainerRightRef}
            >
                <div className="docs-popover-portal-example-scroll-content">
                    <Popover
                        {...POPOVER_PROPS}
                        content="I am an inline popover."
                        isOpen={isOpen}
                        modifiers={{ preventOverflow: { enabled: false } }}
                        renderTarget={({ isOpen: targetIsOpen, ...p }) => <Code {...p}>{`usePortal={false}`}</Code>}
                        usePortal={false}
                    />
                </div>
            </div>
            <em style={{ textAlign: "center", width: "100%" }}>
                Scroll either container and notice what happens when the <Code>Popover</Code> tries to leave.
            </em>
        </Example>
    );
};
