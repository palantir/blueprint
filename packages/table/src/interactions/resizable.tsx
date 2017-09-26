/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps } from "@blueprintjs/core";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { Utils } from "../common/index";
import { ILockableLayout, Orientation, ResizeHandle } from "./resizeHandle";

export type IIndexedResizeCallback = (index: number, size: number) => void;

export interface IResizableProps extends IProps, ILockableLayout {
    /**
     * Enables/disables the resize interaction for the column.
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
    size?: number;

    /**
     * The dimensional size, ignoring minimum and maximum constraints.
     */
    unclampedSize?: number;
}

@PureRender
export class Resizable extends React.Component<IResizableProps, IResizeableState> {
    public static defaultProps = {
        isResizable: true,
        minSize: 0,
    };

    public constructor(props: IResizableProps, context?: any) {
        super(props, context);
        const { size } = props;
        this.state = {
            size,
            unclampedSize: size,
        };
    }

    public componentWillReceiveProps(nextProps: IResizableProps) {
        const { size } = nextProps;
        this.setState({
            size,
            unclampedSize: size,
        });
    }

    public render() {
        const child = React.Children.only(this.props.children);
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
        if (this.props.onSizeChanged != null) {
            this.props.onSizeChanged(this.state.size);
        }
    };

    private onResizeEnd = (_offset: number) => {
        // reset "unclamped" size on end
        this.setState({ unclampedSize: this.state.size });

        if (this.props.onResizeEnd != null) {
            this.props.onResizeEnd(this.state.size);
        }
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
