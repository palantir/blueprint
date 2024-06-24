/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import type * as React from "react";

/**
 * Generic options interface for Blueprint APIs which imperatively mount a React component to the
 * DOM using `"react-dom"`: `OverlayToaster.create`, `showContextMenu`, etc.
 *
 * The `domRenderer` currently defaults to React 16's `ReactDOM.render()`; a future version of Blueprint
 * will default to using React 18's `createRoot()` instead, but it's possible to configure this
 * function to use the newer API by overriding the default.
 */
export interface DOMMountOptions<P> {
    /**
     * A new DOM element will be created and appended to this container.
     *
     * @default document.body
     */
    container?: HTMLElement;

    /**
     * A function to render the React component onto a newly created DOM element.
     *
     * @default ReactDOM.render
     */
    domRenderer?: (
        element: React.ReactElement<P>,
        container: Element | DocumentFragment,
    ) => React.Component<P, any> | Element | void;

    /**
     * A function to unmount the React component from its DOM element.
     *
     * @default ReactDOM.unmountComponentAtNode
     */
    domUnmounter?: (container: Element | DocumentFragment) => void;
}
