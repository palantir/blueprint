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

import React from "react";

import { IOverlayLifecycleProps, Utils as CoreUtils } from "@blueprintjs/core";

import * as Classes from "./classes";
import { Popover2 } from "./popover2";
import { IPopover2TargetProps } from "./popover2SharedProps";

type Offset = {
    left: number;
    top: number;
};

export interface ContextMenu2RenderProps {
    isOpen: boolean;
    targetOffset: Offset;
}

interface ContextMenu2Props extends IOverlayLifecycleProps {
    /**
     * Menu content. This will usually be a Blueprint `<Menu>` component.
     * This optionally functions as a render prop so you can use component state to render content.
     */
    content: JSX.Element | ((props: ContextMenu2RenderProps) => JSX.Element);

    /**
     * The context menu target. This may optionally be a render function so you can use
     * component state to render the target.
     */
    children: React.ReactNode | ((props: ContextMenu2RenderProps) => React.ReactNode);
}

const TRANSITION_DURATION = 100;

export const ContextMenu2: React.FC<ContextMenu2Props> = ({ content, children, ...restProps }) => {
    const [targetOffset, setTargetOffset] = React.useState<Offset>({ left: 0, top: 0 });
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const hide = () => setIsOpen(false);

    const handleContextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // support nested menus (inner menu target would have called preventDefault())
        if (e.defaultPrevented) {
            return;
        }

        e.preventDefault();
        setTargetOffset({ left: e.clientX, top: e.clientY });
        setIsOpen(true);
    }, []);

    const cancelContextMenu = React.useCallback((e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault(), []);

    const handleBackdropContextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.persist();
        e.preventDefault();
        // wait for backdrop to disappear so we can find the "real" element at event coordinates.
        // timeout duration is equivalent to transition duration so we know it's animated out.
        setTimeout(() => {
            // retrigger context menu event at the element beneath the backdrop.
            // if it has a `contextmenu` event handler then it'll be invoked.
            // if it doesn't, no native menu will show (at least on OSX) :(
            const newTarget = document.elementFromPoint(e.clientX, e.clientY);
            const { view, ...newEventInit } = e;
            newTarget?.dispatchEvent(new MouseEvent("contextmenu", newEventInit));
        }, TRANSITION_DURATION);
    }, []);

    const handlePopoverInteraction = React.useCallback((nextOpenState: boolean) => {
        if (!nextOpenState) {
            // delay the actual hiding till the event queue clears
            // to avoid flicker of opening twice
            requestAnimationFrame(hide);
        }
    }, []);

    const renderTarget = React.useCallback(
        ({ ref }: IPopover2TargetProps) => (
            <div className={Classes.CONTEXT_MENU2_POPOVER_TARGET} style={targetOffset} ref={ref} />
        ),
        [targetOffset],
    );

    // Generate key based on offset so a new Popover instance is created
    // when offset changes, to force recomputing position.
    const key = `${targetOffset.left}x${targetOffset.top}`;
    const renderProps: ContextMenu2RenderProps = { isOpen, targetOffset };

    return (
        <div className={Classes.CONTEXT_MENU2} onContextMenu={handleContextMenu}>
            <Popover2
                {...restProps}
                backdropProps={{ onContextMenu: handleBackdropContextMenu }}
                content={
                    // prevent right-clicking inside our context menu
                    <div onContextMenu={cancelContextMenu}>
                        {CoreUtils.isFunction(content) ? content(renderProps) : content}
                    </div>
                }
                enforceFocus={false}
                key={key}
                hasBackdrop={true}
                isOpen={isOpen}
                minimal={true}
                onInteraction={handlePopoverInteraction}
                placement="right-start"
                rootBoundary="viewport"
                renderTarget={renderTarget}
                transitionDuration={TRANSITION_DURATION}
            />
            {CoreUtils.isFunction(children) ? children(renderProps) : children}
        </div>
    );
};
ContextMenu2.displayName = "Blueprint.ContextMenu2";
