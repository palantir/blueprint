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

import { Switch } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export class SwitchExample extends React.PureComponent {
    public render() {
        return (
            <ExampleCard label="Switch" width={250} horizontal={true}>
                <div>
                    <Switch />
                    <Switch innerLabel="Off" innerLabelChecked="On" />
                </div>
                <div>
                    <Switch disabled={true} checked={false} />
                    <Switch disabled={true} checked={true} />
                    <Switch disabled={true} checked={false} innerLabel="Off" />
                    <Switch disabled={true} checked={true} innerLabel="On" />
                </div>
            </ExampleCard>
        );
    }
}
