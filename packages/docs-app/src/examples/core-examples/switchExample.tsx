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

import { Code, Label, Switch } from "@blueprintjs/core";
import { CheckboxExample } from "./checkboxExample";

export class SwitchExample extends CheckboxExample {
    // See CheckboxExample for options
    protected renderExample() {
        return (
            <>
                <div>
                    <Label>Privacy setting</Label>
                    <Switch {...this.state} labelElement={<strong>Enabled</strong>} />
                    <Switch {...this.state} labelElement={<em>Public</em>} />
                    <Switch {...this.state} labelElement={<u>Cooperative</u>} defaultChecked={true} />
                    <Switch {...this.state} labelElement={"Containing Text"} innerLabelChecked="on" innerLabel="off" />
                </div>
                <small style={{ width: "100%", textAlign: "center" }}>
                    This example uses <Code>labelElement</Code> to demonstrate JSX labels.
                </small>
            </>
        );
    }
}
