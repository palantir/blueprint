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

import classNames from "classnames";
import * as React from "react";

import {
    Alignment,
    CheckboxCard,
    type CheckboxCardProps,
    Classes,
    Divider,
    FormGroup,
    H5,
    Switch,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { AlignmentSelect } from "./common/alignmentSelect";

export const CheckboxCardExample: React.FC<ExampleProps> = props => {
    const [alignIndicator, setAlignIndicator] = React.useState<Alignment>(Alignment.LEFT);
    const [compact, setCompact] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [showAsSelectedWhenChecked, setShowAsSelectedWhenChecked] = React.useState(true);
    const [showSubtext, setShowSubtext] = React.useState(true);

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
            <PropCodeTooltip snippet={`alignIndicator="${alignIndicator}"`}>
                <AlignmentSelect
                    align={alignIndicator}
                    allowCenter={false}
                    label="Align control indicator"
                    onChange={setAlignIndicator}
                />
            </PropCodeTooltip>
            <H5>Content</H5>
            <Switch checked={showSubtext} label="Show sub text" onChange={handleBooleanChange(setShowSubtext)} />
        </>
    );

    const checkboxCardProps: CheckboxCardProps = {
        alignIndicator,
        compact,
        disabled,
        showAsSelectedWhenChecked,
    };

    return (
        <Example options={options} {...props}>
            <FormGroup
                className="docs-control-card-group"
                contentClassName="docs-control-card-group-row"
                label={<H5>Lunch Special</H5>}
            >
                <CheckboxCard {...checkboxCardProps}>
                    Soup
                    {showSubtext && <Subtext>Tomato Basil or Broccoli Cheddar</Subtext>}
                </CheckboxCard>
                <CheckboxCard {...checkboxCardProps}>
                    Salad
                    {showSubtext && <Subtext>Caesar, Caprese, or Fresh fruit</Subtext>}
                </CheckboxCard>
                <CheckboxCard {...checkboxCardProps}>
                    Sandwich
                    {showSubtext && <Subtext>Chicken, Turkey, or Vegetable</Subtext>}
                </CheckboxCard>
            </FormGroup>
        </Example>
    );
};

const Subtext = (props: React.PropsWithChildren<object>) => {
    return (
        <>
            <br />
            <span className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>{props.children}</span>
        </>
    );
};
