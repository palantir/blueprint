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

/** @fileoverview types re-exported from the resize observer polyfill library, will be removed in v4.0 */

import type { ResizeObserverEntry } from "@juggle/resize-observer";
// tslint:disable-next-line no-submodule-imports
import type { DOMRectReadOnly } from "@juggle/resize-observer/lib/DOMRectReadOnly";

/* eslint-disable deprecation/deprecation */

/** @deprecated use { ResizeObserverEntry } from "@juggle/resize-observer" */
export type IResizeEntry = ResizeObserverEntry;

/** @deprecated use { ResizeObserverEntry } from "@juggle/resize-observer" */
export type ResizeEntry = IResizeEntry;

/** @deprecated */
export type IDOMRectReadOnly = DOMRectReadOnly;

/** @deprecated */
export { DOMRectReadOnly };
