/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export enum RenderMode {
    /**
     * Renders cells in batches across multiple animation frames. This improves
     * performance by spreading out work to keep a high FPS and avoid blocking
     * the UI, but it also introduces a noticeable scan-line rendering artifact
     * as successive batches of cells finish rendering.
     */
    BATCH,

    /**
     * Renders all cells synchronously on initial mount, then renders cells in
     * batches on successive updates (e.g. during scrolling). This helps to
     * remove visual rendering artifacts when the table is first rendered,
     * wihout slowing scrolling performance to a crawl.
     */
    BATCH_ON_UPDATE,

    /**
     * Disables the batch-rendering behavior, rendering all cells synchronously
     * at once. This may result in degraded performance on large tables and/or
     * on tables with complex cells.
     */
    NONE,
}
