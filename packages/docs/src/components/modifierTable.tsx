/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { IKssModifier } from "documentalist/dist/plugins/kss";

function renderModifier(modifier: IKssModifier, index: number) {
    return (
        <tr key={index}>
            <td data-modifier={modifier.name}><code>{modifier.name}</code></td>
            <td dangerouslySetInnerHTML={{ __html: modifier.documentation }} />
        </tr>
    );
}

export const ModifierTable: React.SFC<{ modifiers: IKssModifier[] }> = ({ modifiers }) => (
    <div className="docs-modifiers">
        <table className="pt-table">
            <thead>
                <tr>
                    <th>Modifier</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {modifiers.map(renderModifier)}
            </tbody>
        </table>
    </div>
);
