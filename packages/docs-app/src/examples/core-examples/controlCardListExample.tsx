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

import { CardList, Classes, H5, Section, SectionCard, Switch, SwitchCard } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Cog, Moon, PageLayout } from "@blueprintjs/icons";

interface ControlCardListExampleState {
    compact: boolean;
    disabled: boolean;
}

export class ControlCardListExample extends React.PureComponent<ExampleProps, ControlCardListExampleState> {
    public state: ControlCardListExampleState = {
        compact: false,
        disabled: false,
    };

    public render() {
        const { compact, disabled } = this.state;
        const sharedProps = { disabled };

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <Section title="System settings" subtitle="Appearance" compact={compact}>
                    <SectionCard padded={false}>
                        <CardList compact={compact} bordered={false}>
                            <SwitchCard {...sharedProps}>
                                <Moon className={Classes.TEXT_MUTED} />
                                Dark theme
                            </SwitchCard>
                            <SwitchCard {...sharedProps}>
                                <PageLayout className={Classes.TEXT_MUTED} />
                                Show scrollbars
                            </SwitchCard>
                            <SwitchCard {...sharedProps}>
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
        const { compact, disabled } = this.state;
        return (
            <>
                <H5>Section & CardList Props</H5>
                <Switch checked={compact} label="Compact" onChange={this.toggleCompact} />
                <H5>SwitchCard Props</H5>
                <Switch checked={disabled} label="Disabled" onChange={this.toggleDisabled} />
            </>
        );
    }

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleCompact = handleBooleanChange(compact => this.setState({ compact }));
}
