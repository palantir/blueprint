/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, Intent, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export class MenuExample extends React.PureComponent {
    public render() {
        return (
            <div className="example-row">
                <ExampleCard label="Menu" subLabel="Default" width={250}>
                    <Menu className={Classes.ELEVATION_1}>
                        {Object.values(Intent).map(intent => (
                            <div key={`${intent}-menu-item`}>
                                <MenuItem intent={intent} icon="applications" text="Item" label="⌘M" />
                                {intent !== "danger" && <MenuDivider />}
                            </div>
                        ))}
                    </Menu>
                </ExampleCard>
                <ExampleCard label="Menu" subLabel="Disabled" width={250}>
                    <Menu className={Classes.ELEVATION_1}>
                        {Object.values(Intent).map(intent => (
                            <div key={`${intent}-menu-item`}>
                                <MenuItem disabled={true} intent={intent} icon="applications" text="Item" label="⌘M" />
                                {intent !== "danger" && <MenuDivider />}
                            </div>
                        ))}
                    </Menu>
                </ExampleCard>
            </div>
        );
    }
}
