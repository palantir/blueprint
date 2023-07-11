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

import { Button, Classes, H5, Intent, Section, SectionPanel, Switch, Text } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

export interface SectionExampleState {
    collapsible: boolean;
    hasDescription: boolean;
    hasIcon: boolean;
    hasMultiplePanels: boolean;
    hasRightElement: boolean;
    isCompact: boolean;
    panelIsPadded: boolean;
}

export class SectionExample extends React.PureComponent<ExampleProps, SectionExampleState> {
    public state: SectionExampleState = {
        collapsible: false,
        hasDescription: false,
        hasIcon: false,
        hasMultiplePanels: false,
        hasRightElement: true,
        isCompact: false,
        panelIsPadded: true,
    };

    public render() {
        const { collapsible, hasDescription, hasIcon, hasRightElement, hasMultiplePanels, isCompact, panelIsPadded } =
            this.state;

        const options = (
            <>
                <H5>Section Props</H5>
                <Switch checked={isCompact} label="Compact" onChange={this.toggleIsCompact} />
                <Switch checked={hasIcon} label="Icon" onChange={this.toggleHasIcon} />
                <Switch checked={hasDescription} label="Description" onChange={this.toggleHasDescription} />
                <Switch checked={hasRightElement} label="Right element" onChange={this.toggleHasRightElement} />
                <Switch checked={collapsible} label="Collapsible" onChange={this.toggleCollapsible} />

                <H5>Children</H5>
                <Switch
                    checked={hasMultiplePanels}
                    label="Multiple section panels"
                    onChange={this.toggleMultiplePanels}
                />

                <H5>SectionPanel Props</H5>
                <Switch checked={panelIsPadded} label="Padded" onChange={this.togglePanelIsPadded} />
            </>
        );

        const descriptionContent = (
            <Text>
                Basil; Ocimum basilicum, also called great basil, is a culinary herb of the family Lamiaceae (mints). It
                is a tender plant, and is used in cuisines worldwide. In Western cuisine, the generic term "basil"
                refers to the variety also known as sweet basil or Genovese basil. Basil is native to tropical regions
                from Central Africa to Southeast Asia.
            </Text>
        );

        const metadataContent = (
            <div className="metadata-panel">
                <div>
                    <span className={Classes.TEXT_MUTED}>Kingdom</span>Plantae
                </div>
                <div>
                    <span className={Classes.TEXT_MUTED}>Clade</span>Tracheophytes
                </div>
                <div>
                    <span className={Classes.TEXT_MUTED}>Family</span>Lamiaceae
                </div>
            </div>
        );

        return (
            <Example options={options} {...this.props}>
                <Section
                    compact={isCompact}
                    title="Basil"
                    subtitle={hasDescription ? "Ocimum basilicum" : undefined}
                    icon={hasIcon ? IconNames.BOOK : undefined}
                    rightElement={
                        hasRightElement ? (
                            <Button minimal={true} intent={Intent.PRIMARY}>
                                Edit
                            </Button>
                        ) : undefined
                    }
                    collapsible={collapsible}
                >
                    <SectionPanel padded={panelIsPadded}>{descriptionContent}</SectionPanel>

                    {hasMultiplePanels && <SectionPanel padded={panelIsPadded}>{metadataContent}</SectionPanel>}
                </Section>
            </Example>
        );
    }

    private toggleIsCompact = () => this.setState({ isCompact: !this.state.isCompact });

    private toggleHasIcon = () => this.setState({ hasIcon: !this.state.hasIcon });

    private toggleHasDescription = () => this.setState({ hasDescription: !this.state.hasDescription });

    private toggleHasRightElement = () => this.setState({ hasRightElement: !this.state.hasRightElement });

    private toggleMultiplePanels = () => this.setState({ hasMultiplePanels: !this.state.hasMultiplePanels });

    private toggleCollapsible = () => this.setState({ collapsible: !this.state.collapsible });

    private togglePanelIsPadded = () => this.setState({ panelIsPadded: !this.state.panelIsPadded });
}
