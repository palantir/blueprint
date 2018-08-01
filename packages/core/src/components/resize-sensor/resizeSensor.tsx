/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";

import { findDOMNode } from "react-dom";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { safeInvoke } from "../../common/utils";

/** A parallel type to `ResizeObserverEntry` (from resize-observer-polyfill). */
export interface IResizeEntry {
    /** Measured dimensions of the target. */
    contentRect: DOMRectReadOnly;

    /** The resized element. */
    target: Element;
}

export interface IResizeSensorProps {
    /**
     * Callback invoked when the wrapped element resizes.
     */
    onResize: (entries: IResizeEntry[]) => void;

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

    private element: Element | null = null;
    private observer = new ResizeObserver(entries => safeInvoke(this.props.onResize, entries));

    public render() {
        // pass-through render of single child
        return React.Children.only(this.props.children);
    }

    public componentDidMount() {
        // using findDOMNode for two reasons:
        // 1. cloning to insert a ref is unwieldy and not performant.
        // 2. ensure that we get an actual DOM node for observing.
        this.observeElement(findDOMNode(this));
    }

    public componentDidUpdate(prevProps: IResizeSensorProps) {
        this.observeElement(findDOMNode(this), this.props.observeParents !== prevProps.observeParents);
    }

    public componentWillUnmount() {
        this.observer.disconnect();
    }

    /**
     * Observe the given element, if defined and different from the currently
     * observed element. Pass `force` argument to skip element checks and always
     * re-observe.
     */
    private observeElement(element: Element | null, force = false) {
        if (element == null) {
            // stop everything if not defined
            this.observer.disconnect();
            return;
        }

        if (element === this.element && !force) {
            // quit if given same element -- nothing to update (unless forced)
            return;
        } else {
            // clear observer list if new element
            this.observer.disconnect();
            // remember element reference for next time
            this.element = element;
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
