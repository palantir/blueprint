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

import { AbstractPureComponent, DISPLAYNAME_PREFIX } from "../../common";

// backwards-compatible with @blueprintjs/core v4.x
export type ResizeEntry = ResizeObserverEntry;

/** `ResizeSensor` requires a single DOM element child and will error otherwise. */
export interface ResizeSensorProps {
    /**
     * Single child, must be an element and not a string or fragment.
     */
    children: JSX.Element;

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
    onResize: (entries: ResizeObserverEntry[]) => void;

    /**
     * If `true`, all parent DOM elements of the container will also be
     * observed for size changes. The array of entries passed to `onResize`
     * will now contain an entry for each parent element up to the root of the
     * document.
     *
     * Only enable this prop if a parent element resizes in a way that does
     * not also cause the child element to resize.
     *
     * @default false
     */
    observeParents?: boolean;

    /**
     * If you attach a `ref` to the child yourself when rendering it, you must pass the
     * same value here (otherwise, ResizeSensor won't be able to attach its own).
     */
    targetRef?: React.RefObject<HTMLElement>;
}

/**
 * Resize sensor component.
 *
 * It requires a single DOM element child and will error otherwise.
 *
 * @see https://blueprintjs.com/docs/#core/components/resize-sensor
 **/
export class ResizeSensor extends AbstractPureComponent<ResizeSensorProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.ResizeSensor`;

    private targetRef = this.props.targetRef ?? React.createRef<HTMLElement>();

    private prevElement: HTMLElement | undefined = undefined;

    private observer: ResizeObserver | undefined;

    public render(): React.ReactNode {
        const onlyChild = React.Children.only(this.props.children);

        // If we're provided a mutable ref to the child element already, we must re-use that one. This is necessary
        // in cases where the child node is not a native DOM element and does not use `React.forwardRef`, since
        // there's no way for us to know how to attach to the underlying DOM node.
        if (this.props.targetRef !== undefined) {
            return onlyChild;
        }

        return React.cloneElement(onlyChild, { ref: this.targetRef });
    }

    public componentDidMount() {
        // ResizeObserver is available in all modern browsers supported by Blueprint but not in server-side rendering
        // and some test environments like jsdom, so we to do a feature check here.
        this.observer =
            globalThis.ResizeObserver != null
                ? new ResizeObserver(entries => this.props.onResize?.(entries))
                : undefined;
        this.observeElement();
    }

    public componentDidUpdate(prevProps: ResizeSensorProps) {
        this.observeElement(this.props.observeParents !== prevProps.observeParents);
    }

    public componentWillUnmount() {
        this.observer?.disconnect();
        this.prevElement = undefined;
    }

    /**
     * Observe the DOM element, if defined and different from the currently
     * observed element. Pass `force` argument to skip element checks and always
     * re-observe.
     */
    private observeElement(force = false) {
        if (this.observer === undefined) {
            return;
        }

        if (!(this.targetRef.current instanceof Element)) {
            // stop everything if not defined
            this.observer.disconnect();
            return;
        }

        if (this.targetRef.current === this.prevElement && !force) {
            // quit if given same element -- nothing to update (unless forced)
            return;
        } else {
            // clear observer list if new element
            this.observer.disconnect();
            // remember element reference for next time
            this.prevElement = this.targetRef.current;
        }

        // observer callback is invoked immediately when observing new elements
        this.observer.observe(this.targetRef.current);

        if (this.props.observeParents) {
            let parent = this.targetRef.current.parentElement;
            while (parent != null) {
                this.observer.observe(parent);
                parent = parent.parentElement;
            }
        }
    }
}
