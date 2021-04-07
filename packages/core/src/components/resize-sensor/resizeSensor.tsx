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

import React, { cloneElement, useEffect, useMemo, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";

import { DISPLAYNAME_PREFIX } from "../../common/props";
import { ResizeEntry } from "./resizeObserverTypes";

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
    onResize: (entries: ResizeEntry[]) => void;

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
}

export const ResizeSensor: React.FC<ResizeSensorProps> = props => {
    const observer = useMemo(
        () =>
            new ResizeObserver(entries => {
                props.onResize?.(entries);
            }),
        [props.children, props.onResize],
    );
    const elementRef = useRef<HTMLElement>();

    // effect to observe this element
    useEffect(() => {
        if (elementRef.current instanceof Element) {
            // N.B. observer callback is invoked immediately when observing new elements
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [observer, elementRef.current]);

    // effect to observe parents
    useEffect(() => {
        if (props.observeParents && elementRef.current instanceof Element) {
            let parent = elementRef.current.parentElement;
            while (parent != null) {
                observer.observe(parent);
                parent = parent.parentElement;
            }
        }

        // this is probably redundant with the first effect defined above, but do it anyway just in case
        return () => observer.disconnect();
    }, [observer, props.observeParents]);

    const onlyChild = React.Children.only(props.children);
    return cloneElement(onlyChild, { ref: elementRef });
};
ResizeSensor.displayName = `${DISPLAYNAME_PREFIX}.ResizeSensor`;
