/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import { ITruncatedFormatProps, TruncatedFormat } from "./truncatedFormat";

/* istanbul ignore next */
export interface IJSONFormatProps extends ITruncatedFormatProps {
    children?: any;

    /**
     * By default we omit stringifying native javascript strings since
     * `JSON.stringify` awkwardly adds double-quotes to the display value.
     * This behavior can be turned off by setting this boolean to false.
     * @default true
     */
    omitQuotesOnStrings?: boolean;

    /**
     * Optionally specify the stringify method. Default is `JSON.stringify`
     * with 2 space indentation.
     */
    stringify?: (obj: any) => string;
}

@PureRender
export class JSONFormat extends React.Component<IJSONFormatProps, {}> {
    public static defaultProps: IJSONFormatProps = {
        omitQuotesOnStrings: true,
        stringify: (obj: any) => (JSON.stringify(obj, null, 2)),
    };

    public render() {
        const { children, omitQuotesOnStrings, stringify } = this.props;
        const className = classNames(this.props.className, {
          "bp-table-null": children === undefined || children === null,
        });
        let displayValue = "";
        if (omitQuotesOnStrings && typeof children === "string") {
            displayValue = children;
        } else {
            displayValue = stringify(children);
        }
        return <TruncatedFormat {...this.props} className={className}>{displayValue}</TruncatedFormat>;
    }
}
