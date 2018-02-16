/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { IKssModifier } from "documentalist/dist/client";

function renderModifier(modifier: IKssModifier, index: number) {
    return (
        <tr key={index}>
            <td data-modifier={modifier.name}>
                <code>{modifier.name}</code>
            </td>
            <td dangerouslySetInnerHTML={{ __html: modifier.documentation }} />
        </tr>
    );
}

export const ModifierTable: React.SFC<{ modifiers: IKssModifier[] }> = ({ modifiers }) => (
    <div className="docs-modifiers pt-running-text-small">
        <table className="pt-html-table">
            <thead>
                <tr>
                    <th>Modifier</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>{modifiers.map(renderModifier)}</tbody>
        </table>
    </div>
);
