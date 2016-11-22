/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { Draggable, ICoordinateData } from "./draggable";

export enum Orientation {
    HORIZONTAL = 1,
    VERTICAL = 0,
}

export interface ILockableLayout {
    onLayoutLock: (isLayoutLocked?: boolean) => void;
}

export interface IResizeHandleProps extends IProps, ILockableLayout {
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
}

export interface IResizeHandleState {
    /**
     * A boolean that is true while the user is dragging the resize handle
     */
    isDragging: boolean;
}

export class ResizeHandle extends React.Component<IResizeHandleProps, IResizeHandleState> {
    public state: IResizeHandleState = {
        isDragging: false,
    };

    public render() {
        const { onResizeMove, onResizeEnd, onDoubleClick, orientation } = this.props;
        if (onResizeMove == null && onResizeEnd == null && onDoubleClick == null) {
            return undefined;
        }

        const targetClasses = classNames(
            "bp-table-resize-handle-target",
            {
                "bp-table-resize-horizontal" : orientation === Orientation.HORIZONTAL,
                "bp-table-resize-vertical" : orientation === Orientation.VERTICAL,
                "bp-table-dragging": this.state.isDragging,
            },
        );

        const handleClasses = classNames(
            "bp-table-resize-handle",
            {"bp-table-dragging": this.state.isDragging},
        );

        return (
            <Draggable
                onActivate={this.handleActivate}
                onClick={this.handleClick}
                onDoubleClick={this.handleDoubleClick}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove}
            >
                <div className={targetClasses}>
                    <div className={handleClasses} />
                </div>
            </Draggable>
        );
    }

    private handleActivate = (event: MouseEvent) => {
        this.setState({isDragging: true});
        this.props.onLayoutLock(true);

        event.stopPropagation();
        event.stopImmediatePropagation();
        return true;
    }

    private handleDragMove = (_event: MouseEvent, coords: ICoordinateData) => {
        const orientationIndex = this.props.orientation as number;
        if (this.props.onResizeMove != null) {
            this.props.onResizeMove(coords.offset[orientationIndex], coords.delta[orientationIndex]);
        }
    }

    private handleDragEnd = (_event: MouseEvent, coords: ICoordinateData) => {
        const orientationIndex = this.props.orientation as number;
        this.setState({isDragging: false});
        this.props.onLayoutLock(false);

        if (this.props.onResizeMove != null) {
            this.props.onResizeMove(coords.offset[orientationIndex], coords.delta[orientationIndex]);
        }
        if (this.props.onResizeEnd != null) {
            this.props.onResizeEnd(coords.offset[orientationIndex]);
        }
    }

    private handleClick = (_event: MouseEvent) => {
        this.setState({isDragging: false});
        this.props.onLayoutLock(false);
    }

    private handleDoubleClick = (_event: MouseEvent) => {
        this.setState({isDragging: false});
        this.props.onLayoutLock(false);

        if (this.props.onDoubleClick != null) {
            this.props.onDoubleClick();
        }
    }
}
