/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IProps } from "@blueprintjs/core";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { DragEvents } from "./dragEvents";

export type IClientCoordinates = [number, number];

/**
 * Various useful coordinate values are pre-computed for you and supplied to
 * onDragMove and onDragEnd callbacks.
 */
export interface ICoordinateData {
    /**
     * The client coordinates where the interaction was activated.
     */
    activation: IClientCoordinates;

    /**
     * The client coordinates of the current mouse event.
     */
    current: IClientCoordinates;

    /**
     * The difference between current and last client coordinates.
     */
    delta: IClientCoordinates;

    /**
     * The client coordinates of the previous mouse event.
     */
    last: IClientCoordinates;

    /**
     * The difference between current and activation client coordinates.
     */
    offset: IClientCoordinates;
}

export interface IDragHandler {
    /**
     * Called when the mouse is pressed down. Drag and click operations may
     * be cancelled at this point by returning false from this method.
     * Otherwise, `stopPropagation` is called on the event.
     */
    onActivate?: (event: MouseEvent) => boolean;

    /**
     * Called every time the mouse is moved after activation and before the
     * mouse is released. This method is also called on the last even when the
     * mouse is released.
     */
    onDragMove?: (event: MouseEvent, coords: ICoordinateData) => void;

    /**
     * Called when the mouse is released iff the mouse was dragged after
     * activation.
     */
    onDragEnd?: (event: MouseEvent, coords: ICoordinateData) => void;

    /**
     * Called when the mouse is released iff the mouse was NOT dragged after
     * activation.
     *
     * This will be called asynchronously if `onDoubleClick` is defined. See
     * that callback for more details.
     */
    onClick?: (event: MouseEvent) => void;

    /**
     * Called iff there are two click events within the timeout
     * `DragEvents.DOUBLE_CLICK_TIMEOUT_MSEC`, which defaults to 500 msec.
     *
     * NOTE: Defining this callback requires that we wait to invoke the
     * `onClick` callback until the timeout has expired and we are certain the
     * interaction was only a single click. If this callback is not defined,
     * the `onClick` callback will be invoked synchronously with the mouseup
     * event.
     */
    onDoubleClick?: (event: MouseEvent) => void;
}

export interface IDraggableProps extends IProps, IDragHandler {
}

/**
 * This component provides a simple interface for combined drag and/or click
 * events.
 *
 * Since the mouse interactions for drag and click are overloaded, here are
 * the events that will fire in these cases:
 *
 * A Click Interaction
 * 1. The user presses down on the render element, triggering the onActivate
 *    callback.
 * 2. The user releases the mouse button without moving it, triggering the
 *    onClick callback.
 *
 * A Drag Interaction
 * 1. The user presses down on the render element, triggering the onActivate
 *    callback.
 * 2. The user moves the mouse, triggering the onDragMove callback.
 * 3. The user moves the mouse, triggering the onDragMove callback.
 * 4. The user moves the mouse, triggering the onDragMove callback.
 * 5. The user releases the mouse button, triggering a final onDragMove
 *    callback as well as an onDragEnd callback.
 *
 * If `false` is returned from the onActivate callback, no further events
 * will be fired until the next activation.
 */
@PureRender
export class Draggable extends React.Component<IDraggableProps, {}> {
    private events: DragEvents;

    public render() {
        return React.Children.only(this.props.children);
    }

    public componentDidMount() {
        this.events = new DragEvents();
        this.events.attach(ReactDOM.findDOMNode(this) as HTMLElement, this.props);
    }

    public componentWillUnmount() {
        this.events.detach();
        delete this.events;
    }
}
