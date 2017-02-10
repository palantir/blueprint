/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { ITruncatedFormatProps, TruncatedFormat, TruncatedPopoverMode } from "./truncatedFormat";

/* istanbul ignore next */
export interface IJSONFormatProps extends ITruncatedFormatProps {
    children?: any;

    /**
     * By default, we omit stringifying native JavaScript strings since
     * `JSON.stringify` awkwardly adds double-quotes to the display value.
     * This behavior can be turned off by setting this boolean to `false`.
     * @default true
     */
    omitQuotesOnStrings?: boolean;

    /**
     * Optionally specify the stringify method. Default is `JSON.stringify`
     * with 2-space indentation.
     */
    stringify?: (obj: any) => string;
}

@PureRender
export class JSONFormat extends React.Component<IJSONFormatProps, {}> {
    public static defaultProps: IJSONFormatProps = {
        omitQuotesOnStrings: true,
        showPopover: TruncatedPopoverMode.ALWAYS,
        stringify: (obj: any) => (JSON.stringify(obj, null, 2)),
    };

    public render() {
        const { children, omitQuotesOnStrings, stringify } = this.props;
        let { showPopover } = this.props;

        // Change style and hide popover if value is nully
        const isNully = children == null;
        if (isNully) {
            showPopover = TruncatedPopoverMode.NEVER;
        }
        const className = classNames(this.props.className, {
          "bp-table-null": isNully,
        });

        let displayValue = "";
        if (omitQuotesOnStrings && typeof children === "string") {
            displayValue = children;
        } else {
            displayValue = stringify(children);
        }

        return (
            <TruncatedFormat
                {...this.props}
                className={className}
                showPopover={showPopover}
            >
                {displayValue}
            </TruncatedFormat>
        );
    }
}
