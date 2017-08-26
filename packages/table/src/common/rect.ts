/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

export type AnyRect = Rect | ClientRect;

// HACKHACK: workaround for https://github.com/palantir/tslint/issues/1768
// tslint:disable adjacent-overload-signatures

/**
 * A simple object for storing the client bounds of HTMLElements. Since
 * ClientRects are immutable, this object enables editing and some simple
 * manipulation methods.
 */
export class Rect {
    public static ORIGIN = new Rect(0, 0, 0, 0);

    /**
     * Returns the smallest Rect that entirely contains the supplied rects
     */
    public static union(anyRect0: AnyRect, anyRect1: AnyRect) {
        const rect0 = Rect.wrap(anyRect0);
        const rect1 = Rect.wrap(anyRect1);

        const top = Math.min(rect0.top, rect1.top);
        const left = Math.min(rect0.left, rect1.left);
        const bottom = Math.max(rect0.top + rect0.height, rect1.top + rect1.height);
        const right = Math.max(rect0.left + rect0.width, rect1.left + rect1.width);
        const height = bottom - top;
        const width = right - left;
        return new Rect(left, top, width, height);
    }

    /**
     * Returns a new Rect that subtracts the origin of the second argument
     * from the first.
     */
    public static subtractOrigin(anyRect0: AnyRect, anyRect1: AnyRect) {
        const rect0 = Rect.wrap(anyRect0);
        const rect1 = Rect.wrap(anyRect1);

        return new Rect(
            rect0.left - rect1.left,
            rect0.top - rect1.top,
            rect0.width,
            rect0.height,
        );
    }

    /**
     * Returns the CSS properties representing the absolute positioning of
     * this Rect.
     */
    public static style(rect: AnyRect): React.CSSProperties {
        return {
            height: `${rect.height}px`,
            left: `${rect.left}px`,
            position: "absolute",
            top: `${rect.top}px`,
            width: `${rect.width}px`,
        };
    }

    /**
     * Given a ClientRect or Rect object, returns a Rect object.
     */
    public static wrap(rect: AnyRect): Rect {
        if (rect instanceof Rect) {
            return rect;
        } else {
            return new Rect(rect.left, rect.top, rect.width, rect.height);
        }
    }

    public constructor(
        public left: number,
        public top: number,
        public width: number,
        public height: number,
    ) {
    }

    public subtractOrigin(anyRect: AnyRect) {
        return Rect.subtractOrigin(this, anyRect);
    }

    public union(anyRect: AnyRect) {
        return Rect.union(this, anyRect);
    }

    public style() {
        return Rect.style(this);
    }

    public sizeStyle(): React.CSSProperties {
        return {
            height: `${this.height}px`,
            width: `${this.width}px`,
        };
    }

    public containsX(clientX: number) {
        return clientX >= this.left && clientX <= this.left + this.width;
    }

    public containsY(clientY: number) {
        return clientY >= this.top && clientY <= this.top + this.height;
    }

    public equals(rect: Rect) {
        return this.left === rect.left
            && this.top === rect.top
            && this.width === rect.width
            && this.height === rect.height;
    }
}
