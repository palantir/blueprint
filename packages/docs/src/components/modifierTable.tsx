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
    <div className="docs-modifiers">
        <table className="pt-table">
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
