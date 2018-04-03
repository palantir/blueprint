/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 */

/** Interface for individual icon modules. */
export interface IconModule {
    iconName: string;
    displayName: string;
    svgPaths16: string[];
    svgPaths20: string[];
}
