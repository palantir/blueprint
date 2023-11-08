/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, DISPLAYNAME_PREFIX } from "../../common";
import { Popover } from "../popover/popover";
import type { PopoverTargetProps } from "../popover/popoverSharedProps";
import { Portal } from "../portal/portal";
import type { ContextMenuPopoverOptions, Offset } from "./contextMenuShared";

export interface ContextMenuPopoverProps extends ContextMenuPopoverOptions {
    isOpen: boolean;
    isDarkTheme?: boolean;
    content: JSX.Element;
    onClose?: () => void;
    targetOffset: Offset | undefined;
}

/**
 * A floating popover which is positioned at a given target offset inside its parent element container.
 * Used to display context menus. Note that this behaves differently from other popover components like
 * Popover and Tooltip, which wrap their children with interaction handlers -- if you're looking for the whole
 * interaction package, use ContextMenu instead.
 *
 * @see https://blueprintjs.com/docs/#core/components/context-menu-popover
 */
export const ContextMenuPopover = React.memo(function _ContextMenuPopover(props: ContextMenuPopoverProps) {
    const {
        content,
        popoverClassName,
        onClose,
        isDarkTheme = false,
        rootBoundary = "viewport",
        targetOffset,
        transitionDuration = 100,
        ...popoverProps
    } = props;
    const cancelContextMenu = React.useCallback((e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault(), []);

    // Popover should attach its ref to the virtual target we render inside a Portal, not the "inline" child target
    const renderTarget = React.useCallback(
        ({ ref }: PopoverTargetProps) => (
            <Portal>
                <div className={Classes.CONTEXT_MENU_VIRTUAL_TARGET} style={targetOffset} ref={ref} />
            </Portal>
        ),
        [targetOffset],
    );

    const handleInteraction = React.useCallback((nextOpenState: boolean) => {
        if (!nextOpenState) {
            onClose?.();
        }
    }, []);

    return (
        <Popover
            placement="right-start"
            rootBoundary={rootBoundary}
            transitionDuration={transitionDuration}
            {...popoverProps}
            content={
                // this prevents right-clicking inside our context menu
                <div onContextMenu={cancelContextMenu}>{content}</div>
            }
            enforceFocus={false}
            // Generate key based on offset so that a new Popover instance is created
            // when offset changes, to force recomputing position.
            key={getPopoverKey(targetOffset)}
            hasBackdrop={true}
            backdropProps={{ className: Classes.CONTEXT_MENU_BACKDROP }}
            minimal={true}
            onInteraction={handleInteraction}
            popoverClassName={classNames(Classes.CONTEXT_MENU_POPOVER, popoverClassName, {
                [Classes.DARK]: isDarkTheme,
            })}
            positioningStrategy="fixed"
            renderTarget={renderTarget}
        />
    );
});
ContextMenuPopover.displayName = `${DISPLAYNAME_PREFIX}.ContextMenuPopover`;

function getPopoverKey(targetOffset: Offset | undefined) {
    return targetOffset === undefined ? "default" : `${targetOffset.left}x${targetOffset.top}`;
}
