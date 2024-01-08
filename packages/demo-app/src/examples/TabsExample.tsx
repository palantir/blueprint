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

import { Tab, Tabs } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export class TabsExample extends React.PureComponent {
    public render() {
        return (
            <ExampleCard label="Tabs">
                <Tabs>
                    <Tab id="1" title="Tab" />
                    <Tab id="2" title="Tab" />
                    <Tab id="3" title="Tab" disabled={true} />
                </Tabs>
            </ExampleCard>
        );
    }
}
