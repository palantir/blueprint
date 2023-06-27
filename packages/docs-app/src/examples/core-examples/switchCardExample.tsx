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

export interface SwitchCardExampleState {
    switchChecked: boolean[];
}

export class SwitchCardExample extends React.PureComponent<ExampleProps, SwitchCardExampleState> {
    public state: SwitchCardExampleState = {
        switchChecked: [false, true, false, true, true, false],
    };

    public render() {
        const { switchChecked } = this.state;

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
                    <SwitchCard onChange={this.getSwitchChangeHandler(0)} checked={switchChecked[0]}>
                        Wifi
                    </SwitchCard>
                    <SwitchCard onChange={this.getSwitchChangeHandler(1)} checked={switchChecked[1]}>
                        Bluetooth
                    </SwitchCard>
                    <SwitchCard onChange={this.getSwitchChangeHandler(2)} checked={switchChecked[2]}>
                        NFC
                    </SwitchCard>
                </div>

                <CardList>
                    <SwitchCard onChange={this.getSwitchChangeHandler(3)} checked={switchChecked[3]}>
                        Wifi
                    </SwitchCard>
                    <SwitchCard onChange={this.getSwitchChangeHandler(4)} checked={switchChecked[4]}>
                        Bluetooth
                    </SwitchCard>
                    <SwitchCard onChange={this.getSwitchChangeHandler(5)} checked={switchChecked[5]}>
                        NFC
                    </SwitchCard>
                </CardList>
            </Example>
        );
    }

    private getSwitchChangeHandler = (index: number) => () => {
        const switchChecked = [...this.state.switchChecked];
        switchChecked[index] = !this.state.switchChecked[index];

        this.setState({ switchChecked });
    };
}
