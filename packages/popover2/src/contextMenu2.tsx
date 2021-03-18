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
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Classes as CoreClasses, OverlayLifecycleProps, Props, Utils as CoreUtils, mergeRefs } from "@blueprintjs/core";

import * as Classes from "./classes";
import { Popover2Props, Popover2 } from "./popover2";
import { Popover2TargetProps } from "./popover2SharedProps";

type Offset = {
    left: number;
    top: number;
};

export interface ContextMenu2RenderProps {
    /** Whether the context menu is currently open */
    isOpen: boolean;

    /** The computed target offset (x, y) coordinates for the context menu click event */
    targetOffset: Offset;

    /** The context menu click event. If isOpen is false, this will be undefined. */
    mouseEvent: React.MouseEvent<HTMLDivElement> | undefined;
}

export interface ContextMenu2Props
    extends OverlayLifecycleProps,
        Pick<Popover2Props, "popoverClassName" | "transitionDuration">,
        Props {
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

    /**
     * Whether the context menu is disabled.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * An optional context menu event handler. This can be useful if you want to do something with the
     * mouse event unrelated to rendering the context menu itself, especially if that involves setting
     * React state (which is an error to do in the render code path of this component).
     */
    onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

export const ContextMenu2: React.FC<ContextMenu2Props> = ({
    className,
    children,
    content,
    disabled = false,
    transitionDuration = 100,
    onContextMenu,
    popoverClassName,
    ...restProps
}) => {
    const [targetOffset, setTargetOffset] = useState<Offset>({ left: 0, top: 0 });
    const [mouseEvent, setMouseEvent] = useState<React.MouseEvent<HTMLDivElement>>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // If disabled prop is changed, we don't want our old context menu to stick around.
    // If it has just been enabled (disabled = false), then the menu ought to be opened by
    // a new mouse event. Users should not be updating this prop in the onContextMenu callback
    // for this component (that will lead to unpredictable behavior).
    useEffect(() => {
        setIsOpen(false);
    }, [disabled]);

    const cancelContextMenu = useCallback((e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault(), []);

    const handlePopoverInteraction = useCallback((nextOpenState: boolean) => {
        if (!nextOpenState) {
            setIsOpen(false);
            setMouseEvent(undefined);
        }
    }, []);

    const targetRef = useRef<HTMLDivElement>(null);
    const renderTarget = useCallback(
        ({ ref }: Popover2TargetProps) => (
            <div
                className={Classes.CONTEXT_MENU2_POPOVER2_TARGET}
                style={targetOffset}
                ref={mergeRefs(ref, targetRef)}
            />
        ),
        [targetOffset],
    );
    const isDarkTheme = useMemo(() => CoreUtils.isDarkTheme(targetRef.current), [targetRef.current]);

    const renderProps: ContextMenu2RenderProps = { isOpen, mouseEvent, targetOffset };

    // only render the popover if there is content in the context menu;
    // this avoid doing unnecessary rendering & computation
    const menu = disabled ? undefined : CoreUtils.isFunction(content) ? content(renderProps) : content;
    const maybePopover =
        menu === undefined ? undefined : (
            <Popover2
                {...restProps}
                content={
                    // this prevents right-clicking inside our context menu
                    <div onContextMenu={cancelContextMenu}>{menu}</div>
                }
                enforceFocus={false}
                // Generate key based on offset so a new Popover instance is created
                // when offset changes, to force recomputing position.
                key={`${targetOffset.left}x${targetOffset.top}`}
                hasBackdrop={true}
                isOpen={isOpen}
                minimal={true}
                onInteraction={handlePopoverInteraction}
                popoverClassName={classNames(popoverClassName, { [CoreClasses.DARK]: isDarkTheme })}
                placement="right-start"
                positioningStrategy="fixed"
                rootBoundary="viewport"
                renderTarget={renderTarget}
                transitionDuration={transitionDuration}
            />
        );

    const handleContextMenu = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            // support nested menus (inner menu target would have called preventDefault())
            if (e.defaultPrevented) {
                return;
            }

            if (!disabled) {
                e.preventDefault();
                e.persist();
                setMouseEvent(e);
                const { left, top } = getContainingBlockOffset(containerRef.current);
                setTargetOffset({ left: e.clientX - left, top: e.clientY - top });
                setIsOpen(true);
            }

            onContextMenu?.(e);
        },
        [containerRef.current, onContextMenu, disabled],
    );

    return (
        <div
            className={classNames(className, Classes.CONTEXT_MENU2)}
            ref={containerRef}
            onContextMenu={handleContextMenu}
        >
            {maybePopover}
            {CoreUtils.isFunction(children) ? children(renderProps) : children}
        </div>
    );
};
ContextMenu2.displayName = "Blueprint.ContextMenu2";

function getContainingBlockOffset(targetElement: HTMLElement | null | undefined): { left: number; top: number } {
    if (targetElement != null) {
        const containingBlock = targetElement.closest(`.${CoreClasses.FIXED_POSITIONING_CONTAINING_BLOCK}`);
        if (containingBlock != null) {
            return containingBlock.getBoundingClientRect();
        }
    }
    return { left: 0, top: 0 };
}
