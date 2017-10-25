/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Classes, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export class SwitchExample extends BaseExample<{}> {
    protected renderExample() {
        return (
            <div>
                <label className={Classes.LABEL}>Privacy setting</label>
                <Switch labelElement={<strong>Enabled</strong>} />
                <Switch labelElement={<em>Public</em>} />
                <Switch labelElement={<u>Cooperative</u>} defaultChecked={true} />
                <small>
                    This example uses <code>labelElement</code> to demonstrate JSX labels.
                </small>
            </div>
        );
    }
}
