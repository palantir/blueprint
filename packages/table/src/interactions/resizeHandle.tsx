/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
import { type KeyboardEvent, PureComponent } from "react";

import type { Props } from "@blueprintjs/core";

import * as Classes from "../common/classes";

import { Draggable } from "./draggable";
import type { CoordinateData } from "./dragTypes";

export enum Orientation {
    HORIZONTAL = 1,
    VERTICAL = 0,
}

export interface LockableLayout {
    onLayoutLock: (isLayoutLocked?: boolean) => void;
}

export interface ResizeHandleProps extends Props, LockableLayout {
    /**
     * A callback that is called while the user is dragging the resize
     * handle.
     *
     * @param offset is the difference between the initial and current coordinates
     * @param delta is the difference between this and the previous offset
     */
    onResizeMove?: (offset: number, delta: number) => void;

    /**
     * A callback that is called when the user is done dragging the resize
     * handle.
     *
     * @param offset is the difference between the initial and final coordinates
     */
    onResizeEnd?: (offset: number) => void;

    /**
     * A callback that is called when the user double clicks the resize handle
     */
    onDoubleClick?: () => void;

    /**
     * An enum value to indicate the orientation of the resize handle.
     */
    orientation: Orientation;

    /**
     * Accessible name for the handle, e.g. "Resize column Title".
     */
    ariaLabel?: string;

    /**
     * The current size in pixels of the resized element, exposed as `aria-valuenow`
     * and used as the base for keyboard resizing.
     */
    size?: number;

    /**
     * The minimum size in pixels, exposed as `aria-valuemin`.
     */
    minSize?: number;

    /**
     * The maximum size in pixels, exposed as `aria-valuemax`.
     */
    maxSize?: number;

    /**
     * A callback that is called when the user resizes via the keyboard while the handle is focused.
     * When provided, the handle becomes a focusable separator.
     *
     * @param size is the requested (unclamped) size
     */
    onKeyboardResize?: (size: number) => void;
}

/**
 * The number of pixels an arrow key press grows or shrinks the resized element by. The WAI-ARIA window
 * splitter pattern does not specify a step, so this is an arbitrary value.
 */
const RESIZE_HANDLE_KEYBOARD_STEP = 10;

export interface ResizeHandleState {
    /**
     * A boolean that is true while the user is dragging the resize handle
     */
    isDragging: boolean;
}

export class ResizeHandle extends PureComponent<ResizeHandleProps, ResizeHandleState> {
    public state: ResizeHandleState = {
        isDragging: false,
    };

    public render() {
        const {
            ariaLabel,
            maxSize,
            minSize,
            onKeyboardResize,
            onResizeMove,
            onResizeEnd,
            onDoubleClick,
            orientation,
            size,
        } = this.props;
        if (onResizeMove == null && onResizeEnd == null && onDoubleClick == null) {
            return undefined;
        }

        const targetClasses = classNames(
            Classes.TABLE_RESIZE_HANDLE_TARGET,
            {
                [Classes.TABLE_DRAGGING]: this.state.isDragging,
                [Classes.TABLE_RESIZE_HORIZONTAL]: orientation === Orientation.HORIZONTAL,
                [Classes.TABLE_RESIZE_VERTICAL]: orientation === Orientation.VERTICAL,
            },
            this.props.className,
        );

        const handleClasses = classNames(Classes.TABLE_RESIZE_HANDLE, {
            [Classes.TABLE_DRAGGING]: this.state.isDragging,
        });

        const separatorProps =
            onKeyboardResize == null
                ? {}
                : ({
                      "aria-label": ariaLabel,
                      "aria-orientation": orientation === Orientation.VERTICAL ? "vertical" : "horizontal",
                      "aria-valuemax": maxSize,
                      "aria-valuemin": minSize,
                      "aria-valuenow": size,
                      onKeyDown: this.handleKeyDown,
                      role: "separator",
                      tabIndex: 0,
                  } as const);

        return (
            <Draggable
                onActivate={this.handleActivate}
                onClick={this.handleClick}
                onDoubleClick={this.handleDoubleClick}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove}
                // N.B. no need to specify targetRef since the child is a native DOM element that accepts ref injection
            >
                <div className={targetClasses} {...separatorProps}>
                    <div className={handleClasses} />
                </div>
            </Draggable>
        );
    }

    /**
     * Arrow keys follow the WAI-ARIA window splitter pattern:
     * https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/#keyboardinteraction
     */
    private handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const targetSize = this.getKeyboardTargetSize(event.key);
        if (targetSize === undefined) {
            return;
        }
        this.props.onKeyboardResize?.(targetSize);
        // keep handled keys from reaching the table's own keyboard navigation
        event.preventDefault();
        event.stopPropagation();
    };

    /**
     * Maps a key to the size it requests, or `undefined` if the key does not resize.
     * Column handles (VERTICAL) use ArrowLeft/ArrowRight; row handles (HORIZONTAL) use ArrowUp/ArrowDown.
     */
    private getKeyboardTargetSize(key: string): number | undefined {
        const { orientation, size } = this.props;
        if (size === undefined) {
            return undefined;
        }
        const isVertical = orientation === Orientation.VERTICAL;
        switch (key) {
            case "ArrowLeft":
                return isVertical ? size - RESIZE_HANDLE_KEYBOARD_STEP : undefined;
            case "ArrowRight":
                return isVertical ? size + RESIZE_HANDLE_KEYBOARD_STEP : undefined;
            case "ArrowUp":
                return isVertical ? undefined : size - RESIZE_HANDLE_KEYBOARD_STEP;
            case "ArrowDown":
                return isVertical ? undefined : size + RESIZE_HANDLE_KEYBOARD_STEP;
            default:
                return undefined;
        }
    }

    private handleActivate = (event: MouseEvent) => {
        this.setState({ isDragging: true });
        this.props.onLayoutLock(true);

        event.stopPropagation();
        event.stopImmediatePropagation();
        return true;
    };

    private handleDragMove = (_event: MouseEvent, coords: CoordinateData) => {
        const orientationIndex = this.props.orientation as number;
        if (this.props.onResizeMove != null) {
            this.props.onResizeMove(coords.offset[orientationIndex], coords.delta[orientationIndex]);
        }
    };

    private handleDragEnd = (_event: MouseEvent, coords: CoordinateData) => {
        const orientationIndex = this.props.orientation as number;
        this.setState({ isDragging: false });
        this.props.onLayoutLock(false);

        if (this.props.onResizeMove != null) {
            this.props.onResizeMove(coords.offset[orientationIndex], coords.delta[orientationIndex]);
        }
        if (this.props.onResizeEnd != null) {
            this.props.onResizeEnd(coords.offset[orientationIndex]);
        }
    };

    private handleClick = (_event: MouseEvent) => {
        this.setState({ isDragging: false });
        this.props.onLayoutLock(false);
    };

    private handleDoubleClick = (_event: MouseEvent) => {
        this.setState({ isDragging: false });
        this.props.onLayoutLock(false);

        if (this.props.onDoubleClick != null) {
            this.props.onDoubleClick();
        }
    };
}
