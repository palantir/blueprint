/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import React from "react";
import { HTML_TABLE, HTML_TABLE_BORDERED, HTML_TABLE_STRIPED, INTERACTIVE, SMALL } from "../../common/classes";
import { IElementRefProps } from "../html/html";

export interface ITableHtmlProps extends React.HTMLAttributes<HTMLTableElement>, IElementRefProps<HTMLTableElement> {
    /** Enables borders between rows and cells. */
    bordered?: boolean;

    /** Enables hover styles on row. */
    interactive?: boolean;

    /** Use small, condensed appearance. */
    small?: boolean;

    /** Use an alternate background color on odd rows. */
    striped?: boolean;
}

export class Table extends React.PureComponent<ITableHtmlProps> {
    public render() {
        const { bordered, className, elementRef, interactive, small, striped, ...htmlProps } = this.props;
        const classes = classNames(
            HTML_TABLE,
            {
                [HTML_TABLE_BORDERED]: bordered,
                [HTML_TABLE_STRIPED]: striped,
                [INTERACTIVE]: interactive,
                [SMALL]: small,
            },
            className,
        );
        return <table {...htmlProps} ref={elementRef} className={classes} />;
    }
}
