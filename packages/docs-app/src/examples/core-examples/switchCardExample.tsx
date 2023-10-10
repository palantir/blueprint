/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import { H5, Switch, SwitchCard, SwitchCardProps } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

type SwitchCardExampleState = Pick<SwitchCardProps, "compact" | "disabled">;

export class SwitchCardExample extends React.PureComponent<ExampleProps, SwitchCardExampleState> {
    public state: SwitchCardExampleState = {
        compact: false,
        disabled: false,
    };

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <div className="docs-control-card-grid">
                    <SwitchCard {...this.state}>Wifi</SwitchCard>
                    <SwitchCard {...this.state}>Bluetooth</SwitchCard>
                    <SwitchCard {...this.state}>NFC</SwitchCard>
                </div>
            </Example>
        );
    }

    private renderOptions() {
        const { compact, disabled } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch checked={compact} label="Compact" onChange={this.toggleCompact} />
                <Switch checked={disabled} label="Disabled" onChange={this.toggleDisabled} />
            </>
        );
    }

    private toggleCompact = handleBooleanChange(compact => this.setState({ compact }));

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));
}
