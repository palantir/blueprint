/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import React from "react";

import { DISPLAYNAME_PREFIX } from "@blueprintjs/core";

import * as Classes from "../../common/classes";
import { TruncatedFormatProps, TruncatedFormat, TruncatedPopoverMode } from "./truncatedFormat";

export interface JSONFormatProps extends TruncatedFormatProps {
    children?: any;

    /**
     * By default, we omit stringifying native JavaScript strings since
     * `JSON.stringify` awkwardly adds double-quotes to the display value.
     * This behavior can be turned off by setting this boolean to `false`.
     *
     * @default true
     */
    omitQuotesOnStrings?: boolean;

    /**
     * Optionally specify the stringify method. Default is `JSON.stringify`
     * with 2-space indentation.
     */
    stringify?: (obj: any) => string;
}

/* istanbul ignore next */
export class JSONFormat extends React.Component<JSONFormatProps> {
    public static displayName = `${DISPLAYNAME_PREFIX}.JSONFormat`;

    public static defaultProps: JSONFormatProps = {
        omitQuotesOnStrings: true,
        stringify: (obj: any) => JSON.stringify(obj, null, 2),
    };

    public render() {
        const { children, omitQuotesOnStrings, stringify } = this.props;
        let { showPopover } = this.props;

        // always hide popover if value is nully
        const isNully = children == null;
        if (isNully) {
            showPopover = TruncatedPopoverMode.NEVER;
        }
        const className = classNames(this.props.className, {
            [Classes.TABLE_NULL]: isNully,
        });

        let displayValue = "";
        if (omitQuotesOnStrings && typeof children === "string") {
            displayValue = children;
        } else {
            displayValue = stringify(children);
        }

        return (
            <TruncatedFormat {...this.props} className={className} showPopover={showPopover}>
                {displayValue}
            </TruncatedFormat>
        );
    }
}
