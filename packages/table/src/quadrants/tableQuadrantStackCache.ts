/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { QuadrantType } from "./tableQuadrant";

export interface IScrollOffsetMap {
    scrollLeft: number;
    scrollTop: number;
}

export class TableQuadrantStackCache {
    private cachedRowHeaderWidth: number;
    private cachedColumnHeaderHeight: number;
    private cachedMainQuadrantScrollOffsets: IScrollOffsetMap;
    private cachedTopQuadrantScrollOffsets: IScrollOffsetMap;
    private cachedLeftQuadrantScrollOffsets: IScrollOffsetMap;
    private cachedTopLeftQuadrantScrollOffsets: IScrollOffsetMap;

    public constructor() {
        this.reset();
    }

    public reset() {
        this.cachedRowHeaderWidth = 0;
        this.cachedColumnHeaderHeight = 0;

        this.cachedMainQuadrantScrollOffsets = this.createScrollOffsetMap();
        this.cachedTopQuadrantScrollOffsets = this.createScrollOffsetMap();
        this.cachedLeftQuadrantScrollOffsets = this.createScrollOffsetMap();
        this.cachedTopLeftQuadrantScrollOffsets = this.createScrollOffsetMap();
    }

    // Getters
    // =======

    public getQuadrantScrollOffset(quadrantType: QuadrantType, scrollKey: keyof IScrollOffsetMap) {
        return this.getQuadrantScrollOffsetMap(quadrantType)[scrollKey];
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

    public setQuadrantScrollOffset(quadrantType: QuadrantType, scrollKey: keyof IScrollOffsetMap, offset: number) {
        this.getQuadrantScrollOffsetMap(quadrantType)[scrollKey] = offset;
    }

    // Helpers
    // =======

    private createScrollOffsetMap() {
        return { scrollLeft: 0, scrollTop: 0 };
    }

    private getQuadrantScrollOffsetMap(quadrantType: QuadrantType) {
        switch (quadrantType) {
            case QuadrantType.MAIN:
                return this.cachedMainQuadrantScrollOffsets;
            case QuadrantType.TOP:
                return this.cachedTopQuadrantScrollOffsets;
            case QuadrantType.LEFT:
                return this.cachedLeftQuadrantScrollOffsets;
            default:
                // i.e. case QuadrantType.TOP_LEFT:
                return this.cachedTopLeftQuadrantScrollOffsets;
        }
    }
}
