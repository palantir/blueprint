/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { IProps } from "@blueprintjs/core";

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

export class DragEvents {
    public static DOUBLE_CLICK_TIMEOUT_MSEC = 500;

    public static isAdditive(event: MouseEvent) {
        return event.ctrlKey || event.metaKey;
    }

    private handler: IDragHandler;
    private element: HTMLElement;

    private activationCoordinates: IClientCoordinates;
    private doubleClickTimeoutToken: number;
    private isActivated: boolean;
    private isDragging: boolean;
    private lastCoordinates: IClientCoordinates;

    public attach(element: HTMLElement, handler: IDragHandler) {
        this.detach();
        this.handler = handler;
        this.element = element;

        if (this.isValidDragHandler(handler)) {
            this.element.addEventListener("mousedown", this.handleMouseDown);
        }
        return this;
    }

    public detach() {
        if (this.element != null) {
            this.element.removeEventListener("mousedown", this.handleMouseDown);
            this.detachDocumentEventListeners();
        }
    }

    private isValidDragHandler(handler: IDragHandler) {
        return handler != null && (handler.onActivate != null
            || handler.onDragMove != null
            || handler.onDragEnd != null
            || handler.onClick != null
            || handler.onDoubleClick != null);
    }

    private attachDocumentEventListeners() {
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    private detachDocumentEventListeners() {
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    private initCoordinateData(event: MouseEvent) {
        this.activationCoordinates = [event.clientX, event.clientY];
        this.lastCoordinates = this.activationCoordinates;
    }

    private updateCoordinateData(event: MouseEvent) {
        const currentCoordinates = [event.clientX, event.clientY];
        const deltaCoordinates = [
            currentCoordinates[0] - this.lastCoordinates[0],
            currentCoordinates[1] - this.lastCoordinates[1],
        ];
        const offsetCoordinates = [
            currentCoordinates[0] - this.activationCoordinates[0],
            currentCoordinates[1] - this.activationCoordinates[1],
        ];
        const data = {
            activation: this.activationCoordinates,
            current: currentCoordinates,
            delta: deltaCoordinates,
            last: this.lastCoordinates,
            offset: offsetCoordinates,
        } as ICoordinateData;
        this.lastCoordinates = [event.clientX, event.clientY];
        return data;
    }

    private handleMouseDown = (event: MouseEvent) => {

        this.initCoordinateData(event);

        if (this.handler != null && this.handler.onActivate != null) {
            const exitCode = this.handler.onActivate(event);
            if (exitCode === false) {
                return;
            }
        }

        this.isActivated = true;
        event.preventDefault();
        this.attachDocumentEventListeners();
    }

    private handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();

        if (this.isActivated) {
            this.isDragging = true;
        }

        if (this.isDragging) {
            const coords = this.updateCoordinateData(event);

            if (this.handler != null && this.handler.onDragMove != null) {
                this.handler.onDragMove(event, coords);
            }
        }
    }

    private handleMouseUp = (event: MouseEvent) => {
        event.preventDefault();

        if (this.handler != null) {
            if (this.isDragging) {
                const coords = this.updateCoordinateData(event);

                if (this.handler.onDragMove != null) {
                    this.handler.onDragMove(event, coords);
                }

                if (this.handler.onDragEnd != null) {
                    this.handler.onDragEnd(event, coords);
                }
            } else if (this.isActivated) {
                if (this.handler.onDoubleClick != null) {

                    if (this.doubleClickTimeoutToken == null) {
                        // if this the first click of a possible double-click,
                        // we delay the firing of the click event by the
                        // timeout.
                        this.doubleClickTimeoutToken = setTimeout(() => {
                            delete this.doubleClickTimeoutToken;
                            if (this.handler.onClick != null) {
                                this.handler.onClick(event);
                            }
                        }, DragEvents.DOUBLE_CLICK_TIMEOUT_MSEC);
                    } else {
                        // otherwise, this is the second click in the double-
                        // click so we cancel the single-click timeout and
                        // fire the double-click event.
                        clearTimeout(this.doubleClickTimeoutToken);
                        delete this.doubleClickTimeoutToken;
                        this.handler.onDoubleClick(event);
                    }

                } else if (this.handler.onClick != null) {
                    this.handler.onClick(event);
                }
            }
         }

        this.isActivated = false;
        this.isDragging = false;
        this.detachDocumentEventListeners();
    }
}
