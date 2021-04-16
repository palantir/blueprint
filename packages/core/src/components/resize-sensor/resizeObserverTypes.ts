/* !
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

/** This file contains types duplicated from resize-observer-polyfill which are not exported in a consumer-friendly way. */

// eslint-disable-next-line deprecation/deprecation
export type ResizeEntry = IResizeEntry;

/**
 * Equivalent to `ResizeObserverEntry`
 *
 * @deprecated use ResizeEntry
 */
export interface IResizeEntry {
    /** Measured dimensions of the target. */
    readonly contentRect: DOMRectReadOnly;

    /** The resized element. */
    readonly target: Element;
}

// eslint-disable-next-line deprecation/deprecation
export type DOMRectReadOnly = IDOMRectReadOnly;
/** @deprecated use DOMRectReadOnly */
interface IDOMRectReadOnly {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
}
