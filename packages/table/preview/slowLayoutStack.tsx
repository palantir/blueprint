/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";
import { Utils } from "../src/index";

export interface ISlowLayoutStackProps {
    /**
     * The number of levels in the stack
     */
    depth: number;

    /**
     * A switch to turn on/off the stack. If disabled this components children
     * will be added to a single `<div>` with the `rootClassName` class.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * The classname applied to the top `<div>` of the stack
     */
    rootClassName?: string;

    /**
     * The classname applied to each branch `<div>` below the root in the stack
     */
    branchClassName?: string;
}

/**
 * Wraps children in a stack of `<div>`s.
 *
 * For example:
 * ```
 * <SlowLayoutStack depth={3}>Hello!</SlowLayoutStack>
 * ```
 * becomes:
 * ```
 * <div>
 *    <div>
 *      <div>
 *          Hello!
 *      </div>
 *    </div>
 * </div>
 * ```
 *
 * This is useful for performance testing since adding a very deep stack can
 * make native browser layout and reflow extremely slow. This mimics a variety
 * of real world performance issues in a controllable way.
 *
 * In order to ensure slowness, the classes in the stack should not create
 * non-static roots or layout boundaries. See:
 * http://wilsonpage.co.uk/introducing-layout-boundaries/
 *
 * To mimic slowness in the native "Update Layer Tree", try: `overflow: auto`.
 */
export class SlowLayoutStack extends React.Component<ISlowLayoutStackProps, {}> {
    public render() {
        const { children, depth, enabled, rootClassName, branchClassName } = this.props;
        let elements = children;
        if (enabled) {
            Utils.times(depth, (i: number) => {
                elements = [
                    <div key={i} className={branchClassName}>
                        {elements}
                    </div>,
                ];
            });
        }
        return <div className={rootClassName}>{elements}</div>;
    }
}
