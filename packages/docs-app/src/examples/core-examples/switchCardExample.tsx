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

import { type Alignment, FormGroup, H5, Switch, SwitchCard, type SwitchCardProps } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { AlignmentSelect } from "./common/alignmentSelect";

type SwitchCardExampleState = Pick<
    SwitchCardProps,
    "alignIndicator" | "compact" | "disabled" | "showAsSelectedWhenChecked"
>;

export class SwitchCardExample extends React.PureComponent<ExampleProps, SwitchCardExampleState> {
    public state: SwitchCardExampleState = {
        alignIndicator: "right",
        compact: false,
        disabled: false,
        showAsSelectedWhenChecked: true,
    };

    public render() {
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <FormGroup className="docs-control-card-group" label={<H5>Communication Settings</H5>}>
                    <SwitchCard {...this.state}>Wifi</SwitchCard>
                    <SwitchCard {...this.state}>Bluetooth</SwitchCard>
                    <SwitchCard {...this.state}>VPN</SwitchCard>
                </FormGroup>
            </Example>
        );
    }

    private renderOptions() {
        const { alignIndicator, compact, disabled, showAsSelectedWhenChecked } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch checked={compact} label="Compact" onChange={this.toggleCompact} />
                <Switch checked={disabled} label="Disabled" onChange={this.toggleDisabled} />
                <PropCodeTooltip snippet={`showAsSelectedWhenChecked={${showAsSelectedWhenChecked}}`}>
                    <Switch
                        checked={showAsSelectedWhenChecked}
                        labelElement={
                            <span>
                                Show as selected <br />
                                when checked
                            </span>
                        }
                        onChange={this.toggleShowAsSelected}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`alignIndicator={${alignIndicator}}`}>
                    <AlignmentSelect
                        align={alignIndicator}
                        allowCenter={false}
                        label="Align control indicator"
                        onChange={this.handleAlignChange}
                    />
                </PropCodeTooltip>
            </>
        );
    }

    private handleAlignChange = (alignIndicator: Alignment) => this.setState({ alignIndicator });

    private toggleCompact = handleBooleanChange(compact => this.setState({ compact }));

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleShowAsSelected = handleBooleanChange(showAsSelectedWhenChecked =>
        this.setState({ showAsSelectedWhenChecked }),
    );
}
