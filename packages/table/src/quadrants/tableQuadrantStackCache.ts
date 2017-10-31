/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export type ScrollKey = "scrollLeft" | "scrollTop";

export class TableQuadrantStackCache {
    private cachedRowHeaderWidth: number;
    private cachedColumnHeaderHeight: number;
    private cachedScrollLeft: number;
    private cachedScrollTop: number;
    private cachedScrollContainerClientWidth: number;
    private cachedScrollContainerClientHeight: number;

    public constructor() {
        this.reset();
    }

    public reset() {
        this.cachedRowHeaderWidth = 0;
        this.cachedColumnHeaderHeight = 0;
        this.cachedScrollLeft = 0;
        this.cachedScrollTop = 0;
    }

    // Getters
    // =======

    public getScrollOffset(scrollKey: ScrollKey) {
        return scrollKey === "scrollLeft" ? this.cachedScrollLeft : this.cachedScrollTop;
    }

    public getRowHeaderWidth() {
        return this.cachedRowHeaderWidth;
    }

    public getColumnHeaderHeight() {
        return this.cachedColumnHeaderHeight;
    }

    public getScrollContainerClientWidth() {
        return this.cachedScrollContainerClientWidth;
    }

    public getScrollContainerClientHeight() {
        return this.cachedScrollContainerClientHeight;
    }

    // Setters
    // =======

    public setColumnHeaderHeight(height: number) {
        this.cachedColumnHeaderHeight = height;
    }

    public setRowHeaderWidth(width: number) {
        this.cachedRowHeaderWidth = width;
    }

    public setScrollOffset(scrollKey: ScrollKey, offset: number) {
        if (scrollKey === "scrollLeft") {
            this.cachedScrollLeft = offset;
        } else {
            this.cachedScrollTop = offset;
        }
    }

    public setScrollContainerClientWidth(clientWidth: number | undefined) {
        this.cachedScrollContainerClientWidth = clientWidth;
    }

    public setScrollContainerClientHeight(clientHeight: number | undefined) {
        this.cachedScrollContainerClientHeight = clientHeight;
    }
}
