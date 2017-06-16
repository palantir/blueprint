/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Classes as CoreClasses, IProps } from "@blueprintjs/core";
// import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import * as Classes from "../common/classes";
import { Draggable, ICoordinateData } from "./draggable";
import { Orientation } from "./orientation";
import { IReorderableProps } from "./reorderable";

export interface IReorderHandleProps extends IProps, IReorderableProps {
    /* Empty */
}

export interface IReorderHandleState {
    /**
     * A boolean that is true while the user is dragging the resize handle
     */
    isDragging: boolean;
}

// support only vertical mode (for use in column headers) for now
const ORIENTATION_INDEX = Orientation.VERTICAL as number;

@PureRender
export class ReorderHandle extends React.Component<IReorderHandleProps, IReorderHandleState> {
    public state: IReorderHandleState = {
        isDragging: false,
    };

    public render() {
        const { onReordering, onReordered, onSelection } = this.props;
        if (onReordering == null && onReordered == null && onSelection == null) {
            return undefined;
        }

        // const targetClasses = classNames(Classes.TABLE_RESIZE_HANDLE_TARGET, {
        //     [Classes.TABLE_DRAGGING]: this.state.isDragging,
        //     [Classes.TABLE_RESIZE_HORIZONTAL] : orientation === Orientation.HORIZONTAL,
        //     [Classes.TABLE_RESIZE_VERTICAL] : orientation === Orientation.VERTICAL,
        // });

        // const handleClasses = classNames(Classes.TABLE_RESIZE_HANDLE, {
        //     [Classes.TABLE_DRAGGING]: this.state.isDragging,
        // });

        return (
            <Draggable
                onActivate={this.handleActivate}
                onClick={this.handleClick}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove}
            >
                <div className={Classes.TABLE_REORDER_HANDLE_TARGET}>
                    <div className={Classes.TABLE_REORDER_HANDLE}>
                        <span className={CoreClasses.iconClass("drag-handle-vertical")} />
                    </div>
                </div>
            </Draggable>
        );
    }

    private handleActivate = (event: MouseEvent) => {
        this.setState({ isDragging: true });
        event.stopPropagation();
        event.stopImmediatePropagation();
        return true;
    }

    private handleDragMove = (_event: MouseEvent, coords: ICoordinateData) => {
        if (this.props.onReordering != null) {
            this.props.onReordering(coords.offset[ORIENTATION_INDEX], coords.delta[ORIENTATION_INDEX], 1);
        }
    }

    private handleDragEnd = (_event: MouseEvent, coords: ICoordinateData) => {
        this.setState({ isDragging: false });

        if (this.props.onReordering != null) {
            this.props.onReordering(coords.offset[ORIENTATION_INDEX], coords.delta[ORIENTATION_INDEX], 1);
        }
        if (this.props.onReordered != null) {
            this.props.onReordered(coords.offset[ORIENTATION_INDEX], coords.delta[ORIENTATION_INDEX], 1);
        }
    }

    private handleClick = () => {
        this.setState({ isDragging: false });
    }
}
