/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

export enum RenderMode {
    /**
     * Renders cells in batches across multiple animation frames. This improves
     * performance by spreading out work to keep a high FPS and avoid blocking
     * the UI, but it also introduces a noticeable scan-line rendering artifact
     * as successive batches of cells finish rendering.
     */
    BATCH = "batch",

    /**
     * Renders all cells synchronously on initial mount, then renders cells in
     * batches on successive updates (e.g. during scrolling). This helps to
     * remove visual rendering artifacts when the table is first rendered,
     * wihout slowing scrolling performance to a crawl.
     */
    BATCH_ON_UPDATE = "batch-on-update",

    /**
     * Disables the batch-rendering behavior, rendering all cells synchronously
     * at once. This may result in degraded performance on large tables and/or
     * on tables with complex cells.
     */
    NONE = "none",
}
