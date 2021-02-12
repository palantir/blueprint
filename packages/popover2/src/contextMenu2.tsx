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

import classNames from "classnames";
import React from "react";

import { Classes as CoreClasses, IOverlayLifecycleProps, Utils as CoreUtils, mergeRefs } from "@blueprintjs/core";

import * as Classes from "./classes";
import { IPopover2Props, Popover2 } from "./popover2";
import { IPopover2TargetProps } from "./popover2SharedProps";

type Offset = {
    left: number;
    top: number;
};

export interface ContextMenu2RenderProps {
    isOpen: boolean;
    targetOffset: Offset;
}

export interface ContextMenu2Props extends IOverlayLifecycleProps, Pick<IPopover2Props, "transitionDuration"> {
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

export const ContextMenu2: React.FC<ContextMenu2Props> = ({
    content,
    children,
    transitionDuration = 100,
    ...restProps
}) => {
    const [targetOffset, setTargetOffset] = React.useState<Offset>({ left: 0, top: 0 });
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const handleContextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // support nested menus (inner menu target would have called preventDefault())
        if (e.defaultPrevented) {
            return;
        }

        e.preventDefault();
        const newTargetOffset = { left: e.clientX, top: e.clientY };
        setTargetOffset(newTargetOffset);
        setIsOpen(true);
    }, []);

    const cancelContextMenu = React.useCallback((e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault(), []);

    const handlePopoverInteraction = React.useCallback((nextOpenState: boolean) => {
        if (!nextOpenState) {
            setIsOpen(false);
        }
    }, []);

    const targetRef = React.useRef<HTMLDivElement>();
    const renderTarget = React.useCallback(
        ({ ref }: IPopover2TargetProps) => (
            <div
                className={Classes.CONTEXT_MENU2_POPOVER_TARGET}
                style={targetOffset}
                ref={mergeRefs(ref, targetRef)}
            />
        ),
        [targetOffset],
    );
    const isDarkTheme = React.useMemo(() => CoreUtils.isDarkTheme(targetRef?.current), [targetRef.current]);

    // Generate key based on offset so a new Popover instance is created
    // when offset changes, to force recomputing position.
    const key = `${targetOffset.left}x${targetOffset.top}`;
    const renderProps: ContextMenu2RenderProps = { isOpen, targetOffset };

    return (
        <div className={Classes.CONTEXT_MENU2} onContextMenu={handleContextMenu}>
            <Popover2
                {...restProps}
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
                popoverClassName={classNames({ [CoreClasses.DARK]: isDarkTheme })}
                placement="right-start"
                rootBoundary="viewport"
                renderTarget={renderTarget}
                transitionDuration={transitionDuration}
            />
            {CoreUtils.isFunction(children) ? children(renderProps) : children}
        </div>
    );
};
ContextMenu2.displayName = "Blueprint.ContextMenu2";
