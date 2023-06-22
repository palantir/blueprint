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

import { Classes, DISPLAYNAME_PREFIX } from "../../common";

export interface HTMLTableProps
    extends React.TableHTMLAttributes<HTMLTableElement>,
        React.RefAttributes<HTMLTableElement> {
    /** Enable borders between rows and cells. */
    bordered?: boolean;

    /** Use compact appearance with less padding. */
    compact?: boolean;

    /** Enable hover styles on rows. */
    interactive?: boolean;

    /** Use an alternate background color on odd-numbered rows. */
    striped?: boolean;
}

// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
/**
 * HTML table component.
 *
 * @see https://blueprintjs.com/docs/#core/components/html-table
 */
export const HTMLTable: React.FC<HTMLTableProps> = React.forwardRef((props, ref) => {
    const { bordered, className, compact, interactive, striped, ...htmlProps } = props;
    const classes = classNames(
        Classes.HTML_TABLE,
        {
            [Classes.COMPACT]: compact,
            [Classes.HTML_TABLE_BORDERED]: bordered,
            [Classes.HTML_TABLE_STRIPED]: striped,
            [Classes.INTERACTIVE]: interactive,
        },
        className,
    );
    // eslint-disable-next-line @blueprintjs/html-components
    return <table {...htmlProps} ref={ref} className={classes} />;
});
HTMLTable.displayName = `${DISPLAYNAME_PREFIX}.HTMLTable`;
