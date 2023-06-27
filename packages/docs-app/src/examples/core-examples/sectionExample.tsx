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

import { Button, Classes, H5, Intent, Section, SectionContent, Switch, TabProps, Text } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

export interface SectionExampleState {
    hasIcon: boolean;
    hasDescription: boolean;
    hasRightItem: boolean;
    hasMultipleSectionContent: boolean;
    isSmall: boolean;
    showTabs: boolean;
}

export class SectionExample extends React.PureComponent<ExampleProps, SectionExampleState> {
    public state: SectionExampleState = {
        hasDescription: false,
        hasIcon: false,
        hasMultipleSectionContent: false,
        hasRightItem: true,
        isSmall: false,
        showTabs: false,
    };

    public render() {
        const { hasDescription, hasIcon, hasRightItem, hasMultipleSectionContent, showTabs, isSmall } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={isSmall} label="Small" onChange={this.handleSmallChange} />
                <Switch checked={hasIcon} label="Icon" onChange={this.handleIconChange} />
                <Switch checked={hasDescription} label="Description" onChange={this.handleDescriptionChange} />
                <Switch checked={hasRightItem} label="Right item" onChange={this.handleRightItemChange} />
                <Switch checked={showTabs} label="Tabs" onChange={this.handleShowTabsChange} />

                <H5>Example</H5>
                <Switch
                    checked={hasMultipleSectionContent}
                    label="Multiple section content"
                    onChange={this.handleMultpleSectionContentChange}
                />
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
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className={Classes.TEXT_MUTED}>Kingdom</span>Plantae
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className={Classes.TEXT_MUTED}>Clade</span>Tracheophytes
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className={Classes.TEXT_MUTED}>Family</span>Lamiaceae
                </div>
            </div>
        );

        const tabDefinitions: TabProps[] = [
            {
                id: "description",
                panel: <SectionContent>{descriptionContent}</SectionContent>,
                title: "Description",
            },
            {
                id: "metadata",
                panel: <SectionContent>{metadataContent}</SectionContent>,
                title: "Metadata",
            },
        ];

        return (
            <Example options={options} {...this.props}>
                <Section
                    small={isSmall}
                    title="Basil"
                    subtitle={hasDescription ? "Ocimum basilicum" : undefined}
                    icon={hasIcon ? IconNames.BOOK : undefined}
                    rightItem={
                        hasRightItem ? (
                            <Button minimal={true} intent={Intent.PRIMARY}>
                                Edit
                            </Button>
                        ) : undefined
                    }
                    tabDefinitions={showTabs ? tabDefinitions : undefined}
                >
                    <SectionContent>{descriptionContent}</SectionContent>

                    {hasMultipleSectionContent && <SectionContent>{metadataContent}</SectionContent>}
                </Section>
            </Example>
        );
    }

    private handleSmallChange = () => this.setState({ isSmall: !this.state.isSmall });

    private handleIconChange = () => this.setState({ hasIcon: !this.state.hasIcon });

    private handleDescriptionChange = () => this.setState({ hasDescription: !this.state.hasDescription });

    private handleRightItemChange = () => this.setState({ hasRightItem: !this.state.hasRightItem });

    private handleMultpleSectionContentChange = () =>
        this.setState({ hasMultipleSectionContent: !this.state.hasMultipleSectionContent });

    private handleShowTabsChange = () => this.setState({ showTabs: !this.state.showTabs });
}
