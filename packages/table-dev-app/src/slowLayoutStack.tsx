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

import { Utils } from "@blueprintjs/table/src";
import * as React from "react";

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
