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

import { CardList, SwitchCard } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

export class SwitchCardExample extends React.PureComponent<ExampleProps> {
    public render() {
        return (
            <Example {...this.props}>
                <div
                    style={{
                        display: "grid",
                        gap: "20px",
                        gridTemplateColumns: "repeat(auto-fit, minMax(200px, 1fr))",
                        width: "100%",
                    }}
                >
                    <SwitchCard checked={true}>Wifi</SwitchCard>
                    <SwitchCard checked={true}>Bluetooth</SwitchCard>
                    <SwitchCard checked={true}>NFC</SwitchCard>
                </div>

                <CardList>
                    <SwitchCard checked={true}>Wifi</SwitchCard>
                    <SwitchCard checked={true}>Bluetooth</SwitchCard>
                    <SwitchCard checked={true}>NFC</SwitchCard>
                </CardList>
            </Example>
        );
    }
}
