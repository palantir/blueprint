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

import { Alignment, Card, Code, FormGroup, H5, Switch, type SwitchProps } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { AlignmentSelect } from "./common/alignmentSelect";

export const SwitchExample: React.FC<ExampleProps> = props => {
    const [alignIndicator, setAlignIndicator] = React.useState<Alignment>(Alignment.LEFT);
    const [disabled, setDisabled] = React.useState(false);
    const [inline, setInline] = React.useState(false);
    const [large, setLarge] = React.useState(false);

    const options = (
        <>
            <H5>Props</H5>
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch checked={inline} label="Inline" onChange={handleBooleanChange(setInline)} />
            <Switch checked={large} label="Large" onChange={handleBooleanChange(setLarge)} />
            <AlignmentSelect
                align={alignIndicator}
                allowCenter={false}
                label="Align indicator"
                onChange={setAlignIndicator}
            />
        </>
    );

    const switchProps: SwitchProps = { alignIndicator, disabled, inline, large };

    return (
        <Example options={options} {...props}>
            <Card>
                <FormGroup label="Privacy setting">
                    <Switch {...switchProps} labelElement={<strong>Enabled</strong>} />
                    <Switch {...switchProps} labelElement={<em>Public</em>} />
                    <Switch {...switchProps} labelElement={<u>Cooperative</u>} defaultChecked={true} />
                    <Switch {...switchProps} labelElement={"Containing Text"} innerLabelChecked="on" innerLabel="off" />
                </FormGroup>
                <small style={{ textAlign: "center", width: "100%" }}>
                    This example uses <Code>labelElement</Code> to demonstrate JSX labels.
                </small>
            </Card>
        </Example>
    );
};
