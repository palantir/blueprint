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

import { ResizeObserver, ResizeObserverEntry } from "@juggle/resize-observer";
import * as React from "react";

import { AbstractPureComponent2, DISPLAYNAME_PREFIX } from "@blueprintjs/core";

/** `ResizeSensor2` requires a single DOM element child and will error otherwise. */
export interface ResizeSensor2Props {
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
    targetRef?: React.Ref<any>;
}

export class ResizeSensor2 extends AbstractPureComponent2<ResizeSensor2Props> {
    public static displayName = `${DISPLAYNAME_PREFIX}.ResizeSensor2`;

    private targetRef = React.createRef<HTMLElement>();

    private prevElement: HTMLElement | undefined = undefined;

    private observer = new ResizeObserver(entries => this.props.onResize?.(entries));

    public render() {
        const onlyChild = React.Children.only(this.props.children);

        // if we're provided a ref to the child already, we don't need to attach one ourselves
        if (this.props.targetRef !== undefined) {
            return onlyChild;
        }

        return React.cloneElement(onlyChild, { ref: this.targetRef });
    }

    public componentDidMount() {
        this.observeElement();
    }

    public componentDidUpdate(prevProps: ResizeSensor2Props) {
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
