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

import classNames from "classnames";
import React from "react";

import { Classes, HTMLTable } from "@blueprintjs/core";

export interface ModifierTableProps {
    /** Message to display when children is empty. */
    emptyMessage?: string;

    /** Title of the first column, describing the type of each row in the table. */
    title: string;

    /** Title of the second column */
    descriptionTitle?: string;
}

export const ModifierTable: React.FunctionComponent<ModifierTableProps> = ({
    children,
    descriptionTitle = "Description",
    emptyMessage,
    title,
}) => (
    <div className={classNames("docs-modifiers-table", Classes.RUNNING_TEXT)}>
        <HTMLTable>
            <thead>
                <tr>
                    <th>{title}</th>
                    <th>{descriptionTitle}</th>
                </tr>
            </thead>
            <tbody>{isEmpty(children) ? renderEmptyState(emptyMessage) : children}</tbody>
        </HTMLTable>
    </div>
);

function isEmpty(children: React.ReactNode) {
    const array = React.Children.toArray(children);
    return array.length === 0 || array.filter(item => !!item).length === 0;
}

function renderEmptyState(message = "Nothing here.") {
    return (
        <tr>
            <td colSpan={2}>
                <em className={Classes.TEXT_MUTED}>{message}</em>
            </td>
        </tr>
    );
}
