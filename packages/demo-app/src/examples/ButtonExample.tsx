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

import { Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { ExampleCard } from "./ExampleCard";

const WIDTH = 150;
export class ButtonExample extends React.PureComponent {
    public render() {
        return (
            <div className="example-row">
                <ExampleCard label="Button" subLabel="Default" width={WIDTH}>
                    {Object.values(Intent).map(intent => (
                        <Button key={`${intent}-button`} intent={intent as Intent} text="Button" icon="add" />
                    ))}
                </ExampleCard>
                <ExampleCard label="Button" subLabel="Disabled" width={WIDTH}>
                    {Object.values(Intent).map(intent => (
                        <Button
                            disabled={true}
                            key={`${intent}-button`}
                            intent={intent as Intent}
                            text="Button"
                            // this kind of `IconNames` reference is discouraged (we prefer the plain string literal instead),
                            // but we keep it here to test the type of `IconNames` at compile time
                            icon={IconNames.ADD}
                        />
                    ))}
                </ExampleCard>
                <ExampleCard label="Button" subLabel="Minimal" width={WIDTH}>
                    {Object.values(Intent).map(intent => (
                        <Button
                            minimal={true}
                            key={`${intent}-button`}
                            intent={intent as Intent}
                            text="Button"
                            icon="add"
                        />
                    ))}
                </ExampleCard>
                <ExampleCard label="Button" subLabel="Minimal, Disabled" width={WIDTH}>
                    {Object.values(Intent).map(intent => (
                        <Button
                            disabled={true}
                            minimal={true}
                            key={`${intent}-button`}
                            intent={intent as Intent}
                            text="Button"
                            icon="add"
                        />
                    ))}
                </ExampleCard>
            </div>
        );
    }
}
