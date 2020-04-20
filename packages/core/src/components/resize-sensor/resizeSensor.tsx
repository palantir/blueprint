/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
import { findDOMNode } from "react-dom";
import { polyfill } from "react-lifecycles-compat";
import ResizeObserver from "resize-observer-polyfill";
import { AbstractPureComponent2 } from "../../common";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { safeInvoke } from "../../common/utils";

/** A parallel type to `ResizeObserverEntry` (from resize-observer-polyfill). */
export interface IResizeEntry {
    /** Measured dimensions of the target. */
    contentRect: DOMRectReadOnly;

    /** The resized element. */
    target: Element;
}

/** `ResizeSensor` requires a single DOM element child and will error otherwise. */
export interface IResizeSensorProps {
    /**
     * Callback invoked when the wrapped element resizes.
     *
     * The `entries` array contains an entry for each observed element. In the
     * default case (no `observeParents`), the array will contain only one
     * element: the single child of the `ResizeSensor`.
     *
     * Note that this method is called _asynchronously_ after a resize is
     * detected and typically it will be called no more than once per frame.
     */
    onResize: (entries: IResizeEntry[]) => void;

    /**
     * If `true`, all parent DOM elements of the container will also be
     * observed for size changes. The array of entries passed to `onResize`
     * will now contain an entry for each parent element up to the root of the
     * document.
     *
     * Only enable this prop if a parent element resizes in a way that does
     * not also cause the child element to resize.
     * @default false
     */
    observeParents?: boolean;
}

@polyfill
export class ResizeSensor extends AbstractPureComponent2<IResizeSensorProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.ResizeSensor`;

    private element: Element | null = null;
    private observer = new ResizeObserver(entries => safeInvoke(this.props.onResize, entries));

    public render() {
        // pass-through render of single child
        return React.Children.only(this.props.children);
    }

    public componentDidMount() {
        this.observeElement();
    }

    public componentDidUpdate(prevProps: IResizeSensorProps) {
        this.observeElement(this.props.observeParents !== prevProps.observeParents);
    }

    public componentWillUnmount() {
        this.observer.disconnect();
    }

    /**
     * Observe the DOM element, if defined and different from the currently
     * observed element. Pass `force` argument to skip element checks and always
     * re-observe.
     */
    private observeElement(force = false) {
        const element = this.getElement();
        if (!(element instanceof Element)) {
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

    private getElement() {
        try {
            // using findDOMNode for two reasons:
            // 1. cloning to insert a ref is unwieldy and not performant.
            // 2. ensure that we resolve to an actual DOM node (instead of any JSX ref instance).
            return findDOMNode(this);
        } catch {
            // swallow error if findDOMNode is run on unmounted component.
            return null;
        }
    }
}
