/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

/* eslint-disable deprecation/deprecation, @blueprintjs/no-deprecated-components */

import classNames from "classnames";
import * as React from "react";

import { Classes, type DefaultPopoverTargetHTMLProps, mergeRefs, Popover, type PopoverProps } from "@blueprintjs/core";

// Legacy classes from @blueprintjs/popover2 v1.x. Note that these are distinct from the `Classes` aliases in
// "./classes.ts" - those strings will continue to work with Popover in Blueprint v5.x, while these values are
// completely deprecated.
const NS = Classes.getClassNamespace();
const POPOVER2 = `${NS}-popover2`;
const POPOVER2_TARGET = `${NS}-popover2-target`;

/** @deprecated use `{ PopoverProps } from "@blueprintjs/core"` instead */
export interface Popover2Props<TProps extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps>
    extends PopoverProps<TProps> {
    ref?: React.Ref<Popover2<TProps>>;
}

/** @deprecated use `{ Popover } from "blueprintjs/core"` instead */
export class Popover2<
    T extends DefaultPopoverTargetHTMLProps = DefaultPopoverTargetHTMLProps,
> extends React.PureComponent<Popover2Props<T>> {
    private ref = React.createRef<Popover<T>>();

    public render() {
        const { className, popoverClassName, ref, ...props } = this.props;
        // Inject two classes commonly referenced in CSS selectors in user code which was compatible with
        // @blueprintjs/popover2 v1.x. Users should ideally migrate to the "-popover-" classes instead, but we want
        // to allow some of their custom styles to continue working when upgrading from Blueprint v4 -> v5.
        return (
            <Popover
                className={classNames(POPOVER2_TARGET, className)}
                popoverClassName={classNames(POPOVER2, popoverClassName)}
                ref={ref === undefined ? this.ref : mergeRefs(ref as React.Ref<Popover<T>>, this.ref)}
                {...props}
            />
        );
    }

    // Add support for the one public instance method available on the popover component
    public reposition = () => this.ref.current?.reposition();
}
