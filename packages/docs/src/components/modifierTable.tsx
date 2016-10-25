/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import { IStyleguideModifier } from "./styleguide";

function renderModifier(modifier: IStyleguideModifier, index: number) {
    return (
        <tr key={index}>
            <td data-modifier={modifier.name}><code>{modifier.name}</code></td>
            <td dangerouslySetInnerHTML={{ __html: modifier.description }} />
        </tr>
    );
}

export const ModifierTable: React.SFC<{ modifiers: IStyleguideModifier[] }> = ({ modifiers }) => (
    <div className="kss-modifiers">
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
