/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
import * as React from "react";
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Classes, IElementRefProps } from "../../common";

// eslint-disable-next-line deprecation/deprecation
export type HTMLTableProps = IHTMLTableProps;
/** @deprecated use HTMLTableProps */
export interface IHTMLTableProps
    extends React.TableHTMLAttributes<HTMLTableElement>,
        // eslint-disable-next-line deprecation/deprecation
        IElementRefProps<HTMLTableElement> {
    /** Enables borders between rows and cells. */
    bordered?: boolean;

    /** Use small, condensed appearance. */
    condensed?: boolean;

    /** Enables hover styles on row. */
    interactive?: boolean;

    /**
     * Use small, condensed appearance for this element and all child elements.
     *
     * @deprecated
     */
    small?: boolean;

    /** Use an alternate background color on odd rows. */
    striped?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
@polyfill
export class HTMLTable extends AbstractPureComponent2<HTMLTableProps> {
    public render() {
        // eslint-disable-next-line deprecation/deprecation
        const { bordered, className, condensed, elementRef, interactive, small, striped, ...htmlProps } = this.props;
        const classes = classNames(
            Classes.HTML_TABLE,
            {
                [Classes.HTML_TABLE_BORDERED]: bordered,
                [Classes.HTML_TABLE_CONDENSED]: condensed,
                [Classes.HTML_TABLE_STRIPED]: striped,
                [Classes.INTERACTIVE]: interactive,
                [Classes.SMALL]: small,
            },
            className,
        );
        // eslint-disable-next-line @blueprintjs/html-components
        return <table {...htmlProps} ref={elementRef} className={classes} />;
    }
}
