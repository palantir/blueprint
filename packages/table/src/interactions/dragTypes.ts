/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

export type IClientCoordinates = [number, number];
export type ClientCoordinates = IClientCoordinates;

export type CoordinateData = ICoordinateData;
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

export type DragHandler = IDragHandler;
export interface IDragHandler {
    /**
     * Called when the mouse is pressed down. Drag and click operations may
     * be cancelled at this point by returning false from this method.
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

    /**
     * This prevents mouse events from performing their default operation such
     * as text selection.
     *
     * @default true
     */
    preventDefault?: boolean;

    /**
     * This prevents the event from propagating up to parent elements.
     *
     * @default false
     */
    stopPropagation?: boolean;
}
