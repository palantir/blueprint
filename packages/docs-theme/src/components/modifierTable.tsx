/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes } from "@blueprintjs/core";
import * as React from "react";

export interface IModifierTableProps {
    /** Message to display when children is empty. */
    emptyMessage?: string;

    /** Title of the first column, describing the type of each row in the table. */
    title: string;
}

export const ModifierTable: React.SFC<IModifierTableProps> = ({ children, emptyMessage, title }) => (
    <div className="docs-modifiers-table">
        <table className="pt-html-table">
            <thead>
                <tr>
                    <th>{title}</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>{isEmpty(children) ? renderEmptyState(emptyMessage) : children}</tbody>
        </table>
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
