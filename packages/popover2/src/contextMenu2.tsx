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
import * as React from "react";

import {
    Classes as CoreClasses,
    IOverlayLifecycleProps,
    IProps,
    Utils as CoreUtils,
    mergeRefs,
} from "@blueprintjs/core";

import * as Classes from "./classes";
import { IPopover2Props, Popover2 } from "./popover2";
import { IPopover2TargetProps } from "./popover2SharedProps";

type Offset = {
    left: number;
    top: number;
};

/**
 * Render props relevant to the _content_ of a context menu (rendered as the underlying Popover's content).
 */
export interface ContextMenu2ContentProps {
    /** Whether the context menu is currently open */
    isOpen: boolean;

    /** The computed target offset (x, y) coordinates for the context menu click event */
    targetOffset: Offset;

    /** The context menu click event. If isOpen is false, this will be undefined. */
    mouseEvent: React.MouseEvent<HTMLElement> | undefined;
}

/** @deprecated use ContextMenu2ContentProps */
export type ContextMenu2RenderProps = ContextMenu2ContentProps;

/**
 * Render props for advanced usage of ContextMenu.
 */
export interface ContextMenu2ChildrenProps {
    /** Context menu container element class */
    className: string;

    /** Render props relevant to the content of this context menu */
    contentProps: ContextMenu2ContentProps;

    /** Context menu handler which implements the custom context menu interaction */
    onContextMenu: React.MouseEventHandler<HTMLElement>;

    /** Popover element rendered by ContextMenu, used to establish a click target to position the menu */
    popover: JSX.Element | undefined;

    /** DOM ref for the context menu target, used to calculate menu position on the page */
    ref: React.Ref<any>;
}

export interface ContextMenu2Props
    extends IOverlayLifecycleProps,
        Pick<IPopover2Props, "popoverClassName" | "transitionDuration">,
        IProps {
    /**
     * Menu content. This will usually be a Blueprint `<Menu>` component.
     * This optionally functions as a render prop so you can use component state to render content.
     */
    content: JSX.Element | ((props: ContextMenu2ContentProps) => JSX.Element);

    /**
     * The context menu target. This may optionally be a render function so you can use
     * component state to render the target.
     */
    children: React.ReactNode | ((props: ContextMenu2ChildrenProps) => React.ReactElement);

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
    onContextMenu?: React.MouseEventHandler<HTMLElement>;
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
    const [targetOffset, setTargetOffset] = React.useState<Offset>({ left: 0, top: 0 });
    const [mouseEvent, setMouseEvent] = React.useState<React.MouseEvent<HTMLElement>>();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // If disabled prop is changed, we don't want our old context menu to stick around.
    // If it has just been enabled (disabled = false), then the menu ought to be opened by
    // a new mouse event. Users should not be updating this prop in the onContextMenu callback
    // for this component (that will lead to unpredictable behavior).
    React.useEffect(() => {
        setIsOpen(false);
    }, [disabled]);

    const cancelContextMenu = React.useCallback((e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault(), []);

    const handlePopoverInteraction = React.useCallback((nextOpenState: boolean) => {
        if (!nextOpenState) {
            setIsOpen(false);
            setMouseEvent(undefined);
        }
    }, []);

    const targetRef = React.useRef<HTMLDivElement>(null);
    const renderTarget = React.useCallback(
        ({ ref }: IPopover2TargetProps) => (
            <div
                className={Classes.CONTEXT_MENU2_POPOVER2_TARGET}
                style={targetOffset}
                ref={mergeRefs(ref, targetRef)}
            />
        ),
        [targetOffset],
    );
    const isDarkTheme = React.useMemo(() => CoreUtils.isDarkTheme(targetRef.current), [targetRef.current]);

    const contentProps: ContextMenu2ContentProps = { isOpen, mouseEvent, targetOffset };

    // only render the popover if there is content in the context menu;
    // this avoid doing unnecessary rendering & computation
    const menu = disabled ? undefined : CoreUtils.isFunction(content) ? content(contentProps) : content;
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

    const handleContextMenu = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
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

    const containerClassName = classNames(className, Classes.CONTEXT_MENU2);

    if (CoreUtils.isFunction(children)) {
        return children({
            className: containerClassName,
            contentProps,
            onContextMenu: handleContextMenu,
            popover: maybePopover,
            ref: containerRef,
        });
    } else {
        return (
            <div className={containerClassName} ref={containerRef} onContextMenu={handleContextMenu}>
                {maybePopover}
                {children}
            </div>
        );
    }
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
