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

import { Checkbox, Radio } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export class CheckboxRadioExample extends React.PureComponent {
    public render() {
        return (
            <div className="example-row">
                <ExampleCard label="Checkbox" width={200}>
                    <Checkbox checked={false} label="Unchecked" />
                    <Checkbox indeterminate={true} label="Indeterminate" />
                    <Checkbox checked={true} label="Checked" />
                    <Checkbox disabled={true} checked={false} label="(Disabled) Unchecked" />
                    <Checkbox disabled={true} checked={true} label="(Disabled) Checked" />
                </ExampleCard>
                <ExampleCard label="Radio" width={200}>
                    <Radio checked={false} label="Unchecked" />
                    <Radio checked={true} label="Checked" />
                    <Radio disabled={true} checked={false} label="(Disabled) Unchecked" />
                    <Radio disabled={true} checked={true} label="(Disabled) Checked" />
                </ExampleCard>
            </div>
        );
    }
}
