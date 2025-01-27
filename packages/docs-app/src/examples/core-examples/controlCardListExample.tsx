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

import {
    CardList,
    Classes,
    H5,
    Section,
    SectionCard,
    Switch,
    SwitchCard,
    type SwitchCardProps,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Cog, Moon, PageLayout } from "@blueprintjs/icons";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

export const ControlCardListExample: React.FC<ExampleProps> = props => {
    const [compact, setCompact] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [showAsSelectedWhenChecked, setShowAsSelectedWhenChecked] = React.useState(true);

    const options = (
        <>
            <H5>Section & CardList Props</H5>
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
            <H5>SwitchCard Props</H5>
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
        </>
    );

    const switchCardProps: SwitchCardProps = { disabled, showAsSelectedWhenChecked };

    return (
        <Example options={options} {...props}>
            <Section title="System settings" subtitle="Appearance" compact={compact}>
                <SectionCard padded={false}>
                    <CardList compact={compact} bordered={false}>
                        <SwitchCard {...switchCardProps}>
                            <Moon className={Classes.TEXT_MUTED} />
                            Dark theme
                        </SwitchCard>
                        <SwitchCard {...switchCardProps}>
                            <PageLayout className={Classes.TEXT_MUTED} />
                            Show scrollbars
                        </SwitchCard>
                        <SwitchCard {...switchCardProps}>
                            <Cog className={Classes.TEXT_MUTED} />
                            Developer mode
                        </SwitchCard>
                    </CardList>
                </SectionCard>
            </Section>
        </Example>
    );
};
