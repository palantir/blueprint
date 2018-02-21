/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

export interface IModifierTableProps {
    title: string;
}

export const ModifierTable: React.SFC<IModifierTableProps> = ({ children, title }) =>
    React.Children.count(children) > 0 ? (
        <div className="docs-modifiers">
            <table className="pt-table">
                <thead>
                    <tr>
                        <th>{title}</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    ) : null;
