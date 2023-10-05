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

import { H5, Switch, SwitchCard } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

interface SwitchCardExampleState {
    // TODO: add compact option
    // compact: boolean;
    disabled: boolean;
}

export class SwitchCardExample extends React.PureComponent<ExampleProps, SwitchCardExampleState> {
    public state: SwitchCardExampleState = {
        // TODO: add compact option
        // compact: false,
        disabled: false,
    };

    public render() {
        const { disabled } = this.state;
        const sharedProps = { disabled };

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <div className="docs-control-card-grid">
                    <SwitchCard {...sharedProps}>Wifi</SwitchCard>
                    <SwitchCard {...sharedProps}>Bluetooth</SwitchCard>
                    <SwitchCard {...sharedProps}>NFC</SwitchCard>
                </div>
            </Example>
        );
    }

    private renderOptions() {
        const { disabled } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch checked={disabled} label="Disabled" onChange={this.toggleDisabled} />
            </>
        );
    }

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));
}
