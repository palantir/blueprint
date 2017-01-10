/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

export interface ILoadable {
    /**
     * Show an animated loading animation.
     * @default false
     */
    isLoading?: boolean;
}

export function renderLoadingSkeleton(baseClassName: string) {
    const width = Math.floor(Math.random() * 4) * 5;
    const skeletonClassName = `${baseClassName}-skeleton`;
    return (
        <div className={`${skeletonClassName} ${skeletonClassName}-${width}`} />
    );
}
