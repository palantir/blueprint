/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import {
    HTML_TABLE,
    HTML_TABLE_BORDERED,
    HTML_TABLE_CONDENSED,
    HTML_TABLE_STRIPED,
    INTERACTIVE,
    SMALL,
} from "../../common/classes";
import { IElementRefProps } from "../html/html";

export interface IHTMLTableProps
    extends React.TableHTMLAttributes<HTMLTableElement>,
        IElementRefProps<HTMLTableElement> {
    /** Enables borders between rows and cells. */
    bordered?: boolean;

    /** Use small, condensed appearance. */
    condensed?: boolean;

    /** Enables hover styles on row. */
    interactive?: boolean;

    /**
     * Use small, condensed appearance for this element and all child elements.
     * @deprecated
     */
    small?: boolean;

    /** Use an alternate background color on odd rows. */
    striped?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
export class HTMLTable extends React.PureComponent<IHTMLTableProps> {
    public render() {
        const { bordered, className, condensed, elementRef, interactive, small, striped, ...htmlProps } = this.props;
        const classes = classNames(
            HTML_TABLE,
            {
                [HTML_TABLE_BORDERED]: bordered,
                [HTML_TABLE_CONDENSED]: condensed,
                [HTML_TABLE_STRIPED]: striped,
                [INTERACTIVE]: interactive,
                [SMALL]: small,
            },
            className,
        );
        // tslint:disable-next-line:blueprint-html-components
        return <table {...htmlProps} ref={elementRef} className={classes} />;
    }
}
