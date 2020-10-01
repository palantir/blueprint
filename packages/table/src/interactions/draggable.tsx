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

import { IProps, Utils as CoreUtils } from "@blueprintjs/core";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { DragEvents } from "./dragEvents";
import { IDragHandler } from "./dragTypes";

export interface IDraggableProps extends IProps, IDragHandler {}

const REATTACH_PROPS_KEYS = ["stopPropagation", "preventDefault"] as Array<keyof IDraggableProps>;

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
export class Draggable extends React.PureComponent<IDraggableProps> {
    public static defaultProps = {
        preventDefault: true,
        stopPropagation: false,
    };

    private element: HTMLElement | null = null;
    private handleRef = (el: HTMLElement | null) => (this.element = el);
    private events?: DragEvents;

    public render() {
        const singleChild = React.Children.only(this.props.children);
        if (!React.isValidElement(singleChild)) {
            return singleChild;
        }

        return React.cloneElement(singleChild, { ref: this.handleRef });
    }

    public componentDidUpdate(prevProps: IDraggableProps) {
        const propsWhitelist = { include: REATTACH_PROPS_KEYS };
        if (
            this.element != null &&
            this.events !== undefined &&
            !CoreUtils.shallowCompareKeys(prevProps, this.props, propsWhitelist)
        ) {
            this.events.attach(this.element, this.props);
        }
    }

    public componentDidMount() {
        this.events = new DragEvents();
        if (this.element != null) {
            this.events.attach(this.element, this.props);
        }
    }

    public componentWillUnmount() {
        this.events.detach();
        delete this.events;
    }
}
