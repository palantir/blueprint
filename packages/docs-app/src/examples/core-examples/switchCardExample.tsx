/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { Alignment, Divider, FormGroup, H5, Switch, SwitchCard, type SwitchCardProps } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { AlignmentSelect } from "./common/alignmentSelect";

export const SwitchCardExample: React.FC<ExampleProps> = props => {
    const [alignIndicator, setAlignIndicator] = React.useState<Alignment>(Alignment.RIGHT);
    const [compact, setCompact] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [showAsSelectedWhenChecked, setShowAsSelectedWhenChecked] = React.useState(true);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <PropCodeTooltip snippet={`showAsSelectedWhenChecked={${showAsSelectedWhenChecked}}`}>
                <Switch
                    checked={showAsSelectedWhenChecked}
                    labelElement={
                        <span>
                            Show as selected <br />
                            when checked
                        </span>
                    }
                    onChange={handleBooleanChange(setShowAsSelectedWhenChecked)}
                />
            </PropCodeTooltip>
            <Divider />
            <PropCodeTooltip snippet={`alignIndicator={${alignIndicator}}`}>
                <AlignmentSelect
                    align={alignIndicator}
                    allowCenter={false}
                    label="Align control indicator"
                    onChange={setAlignIndicator}
                />
            </PropCodeTooltip>
        </>
    );

    const switchCardProps: SwitchCardProps = { alignIndicator, compact, disabled, showAsSelectedWhenChecked };

    return (
        <Example options={options} {...props}>
            <FormGroup
                className="docs-control-card-group"
                contentClassName="docs-control-card-group-row"
                label={<H5>Communication Settings</H5>}
            >
                <SwitchCard {...switchCardProps}>Wifi</SwitchCard>
                <SwitchCard {...switchCardProps}>Bluetooth</SwitchCard>
                <SwitchCard {...switchCardProps}>VPN</SwitchCard>
            </FormGroup>
        </Example>
    );
};
