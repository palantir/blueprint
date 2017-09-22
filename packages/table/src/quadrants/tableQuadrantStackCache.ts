/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

export type ScrollKey = "scrollLeft" | "scrollTop";

export class TableQuadrantStackCache {
    private cachedRowHeaderWidth: number;
    private cachedColumnHeaderHeight: number;
    private cachedScrollLeft: number;
    private cachedScrollTop: number;

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

    public getScrollTop() {
        return this.cachedScrollTop;
    }

    public getRowHeaderWidth() {
        return this.cachedRowHeaderWidth;
    }

    public getColumnHeaderHeight() {
        return this.cachedColumnHeaderHeight;
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
}
