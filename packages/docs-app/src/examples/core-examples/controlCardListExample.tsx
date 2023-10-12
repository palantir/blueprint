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

import {
    CardList,
    Classes,
    H5,
    Section,
    SectionCard,
    SectionProps,
    Switch,
    SwitchCard,
    SwitchCardProps,
} from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Cog, Moon, PageLayout } from "@blueprintjs/icons";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

type ControlCardListExampleState = Pick<SectionProps, "compact"> &
    Pick<SwitchCardProps, "disabled" | "showAsSelectedWhenChecked">;

export class ControlCardListExample extends React.PureComponent<ExampleProps, ControlCardListExampleState> {
    public state: ControlCardListExampleState = {
        compact: false,
        disabled: false,
        showAsSelectedWhenChecked: true,
    };

    public render() {
        const { compact, ...switchCardProps } = this.state;

        return (
            <Example options={this.renderOptions()} {...this.props}>
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
    }

    private renderOptions() {
        const { compact, disabled, showAsSelectedWhenChecked } = this.state;
        return (
            <>
                <H5>Section & CardList Props</H5>
                <Switch checked={compact} label="Compact" onChange={this.toggleCompact} />
                <H5>SwitchCard Props</H5>
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
            </>
        );
    }

    private toggleCompact = handleBooleanChange(compact => this.setState({ compact }));

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleShowAsSelected = handleBooleanChange(showAsSelectedWhenChecked =>
        this.setState({ showAsSelectedWhenChecked }),
    );
}
