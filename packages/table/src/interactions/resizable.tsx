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

import * as React from "react";

import { AbstractPureComponent2, Props } from "@blueprintjs/core";

import { Utils } from "../common/index";
import { ILockableLayout, Orientation, ResizeHandle } from "./resizeHandle";

export type IIndexedResizeCallback = (index: number, size: number) => void;
export type IndexedResizeCallback = IIndexedResizeCallback;

export interface IResizableProps extends Props, ILockableLayout {
    /** Element to resize. */
    children: React.ReactNode;

    /**
     * Enables/disables the resize interaction for the column.
     *
     * @default true
     */
    isResizable?: boolean;

    /**
     * The optional maximum width of the column.
     */
    maxSize?: number;

    /**
     * The optional minimum width of the column.
     */
    minSize?: number;

    /**
     * A callback that is called while the user is dragging the resize
     * handle.
     *
     * @param size is the resized size
     */
    onSizeChanged?: (size: number) => void;

    /**
     * A callback that is called when the user is done dragging the resize
     * handle.
     *
     * @param size is the final resized size
     */
    onResizeEnd?: (size: number) => void;

    /**
     * A callback that is called when the user double clicks the resize handle
     */
    onDoubleClick?: () => void;

    /**
     * Determines how the resize handle is oriented in the resizable child.
     */
    orientation: Orientation;

    /**
     * The initial dimensional size.
     */
    size: number;
}

export interface IResizeableState {
    /**
     * The dimensional size, respecting minimum and maximum constraints.
     */
    size: number;

    /**
     * The dimensional size, ignoring minimum and maximum constraints.
     */
    unclampedSize: number;
}

export class Resizable extends AbstractPureComponent2<IResizableProps, IResizeableState> {
    public static defaultProps = {
        isResizable: true,
        minSize: 0,
    };

    public static getDerivedStateFromProps({ size }: IResizableProps, prevState: IResizeableState | null) {
        if (prevState == null) {
            return {
                size,
                unclampedSize: size,
            };
        }

        return null;
    }

    public state: IResizeableState = {
        size: this.props.size,
        unclampedSize: this.props.size,
    };

    public componentDidUpdate(prevProps: IResizableProps) {
        if (prevProps.size !== this.props.size) {
            this.setState(Resizable.getDerivedStateFromProps(this.props, null));
        }
    }

    public render() {
        const child = React.Children.only(this.props.children) as React.ReactElement;
        const style = { ...child.props.style, ...this.getStyle() };

        if (this.props.isResizable === false) {
            return React.cloneElement(child, { style });
        }

        const resizeHandle = this.renderResizeHandle();
        return React.cloneElement(child, { style, resizeHandle });
    }

    private renderResizeHandle() {
        const { onLayoutLock, onDoubleClick, orientation } = this.props;

        return (
            <ResizeHandle
                key="resize-handle"
                onDoubleClick={onDoubleClick}
                onLayoutLock={onLayoutLock}
                onResizeEnd={this.onResizeEnd}
                onResizeMove={this.onResizeMove}
                orientation={orientation}
            />
        );
    }

    private onResizeMove = (_offset: number, delta: number) => {
        this.offsetSize(delta);
        this.props.onSizeChanged?.(this.state.size);
    };

    private onResizeEnd = (_offset: number) => {
        // reset "unclamped" size on end
        this.setState({ unclampedSize: this.state.size });
        this.props.onResizeEnd?.(this.state.size);
    };

    /**
     * Returns the CSS style to apply to the child element given the state's
     * size value.
     */
    private getStyle(): React.CSSProperties {
        if (this.props.orientation === Orientation.VERTICAL) {
            return {
                flexBasis: `${this.state.size}px`,
                minWidth: "0px",
                width: `${this.state.size}px`,
            };
        } else {
            return {
                flexBasis: `${this.state.size}px`,
                height: `${this.state.size}px`,
                minHeight: "0px",
            };
        }
    }

    private offsetSize(offset: number) {
        const unclampedSize = this.state.unclampedSize + offset;
        this.setState({
            size: Utils.clamp(unclampedSize, this.props.minSize, this.props.maxSize),
            unclampedSize,
        });
    }
}
