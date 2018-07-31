/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";

import { findDOMNode } from "react-dom";
import { DISPLAYNAME_PREFIX } from "../../common/props";

export interface IResizeSensorProps {
    /**
     * Callback invoked when the wrapped element resizes.
     * Resize events are throttled for performance reasons.
     */
    onResize: ResizeObserverCallback;

    /**
     * If `true`, all parent DOM elements of the container will also be
     * observed. If changes to a parent's size is detected, the overflow will be
     * recalculated.
     *
     * Only enable this prop if the overflow should be recalculated when a
     * parent element resizes in a way that does not also cause the
     * `OverflowList` to resize.
     * @default false
     */
    observeParents?: boolean;
}

export class ResizeSensor extends React.PureComponent<IResizeSensorProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Resize`;

    private observer: ResizeObserver;

    constructor(props: IResizeSensorProps, context?: any) {
        super(props, context);
        this.observer = new ResizeObserver(this.props.onResize);
    }

    public render() {
        return React.Children.only(this.props.children);
    }

    public componentDidMount() {
        // using findDOMNode for two reasons:
        // 1. cloning to insert a ref is unwieldy and not performant.
        // 2. ensure that we get an actual DOM node for observing.
        const domNode = findDOMNode(this);
        if (domNode != null) {
            this.observeElement(domNode);
        }
    }

    public componentDidUpdate(prevProps: IResizeSensorProps) {
        const { observeParents, onResize } = this.props;
        if (observeParents !== prevProps.observeParents || onResize !== prevProps.onResize) {
            console.warn("<Resize> does not support changing props.");
        }
    }

    public componentWillUnmount() {
        this.observer.disconnect();
    }

    private observeElement(element: Element | null) {
        if (element == null) {
            this.observer.disconnect();
            return;
        }

        // observer callback is invoked immediately when observing new elements
        this.observer.observe(element);

        if (this.props.observeParents) {
            let parent = element.parentElement;
            while (parent != null) {
                this.observer.observe(parent);
                parent = parent.parentElement;
            }
        }
    }
}
