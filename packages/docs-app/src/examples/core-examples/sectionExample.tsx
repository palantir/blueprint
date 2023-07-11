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

import { Button, Classes, H5, Intent, Section, SectionContent, Switch, Text } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

export interface SectionExampleState {
    hasIcon: boolean;
    hasDescription: boolean;
    hasRightElement: boolean;
    hasMultipleSectionContent: boolean;
    isCompact: boolean;
    collapsible: boolean;
}

export class SectionExample extends React.PureComponent<ExampleProps, SectionExampleState> {
    public state: SectionExampleState = {
        collapsible: false,
        hasDescription: false,
        hasIcon: false,
        hasMultipleSectionContent: false,
        hasRightElement: true,
        isCompact: false,
    };

    public render() {
        const { collapsible, hasDescription, hasIcon, hasRightElement, hasMultipleSectionContent, isCompact } =
            this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={isCompact} label="Compact" onChange={this.handleSmallChange} />
                <Switch checked={hasIcon} label="Icon" onChange={this.handleIconChange} />
                <Switch checked={hasDescription} label="Description" onChange={this.handleDescriptionChange} />
                <Switch checked={hasRightElement} label="Right element" onChange={this.handleRightElementChange} />
                <Switch checked={collapsible} label="Collapsible" onChange={this.handleCollapsibleChange} />

                <H5>Children</H5>
                <Switch
                    checked={hasMultipleSectionContent}
                    label="Multiple section content"
                    onChange={this.handleMultipleSectionContentChange}
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
                    <SectionContent>{descriptionContent}</SectionContent>

                    {hasMultipleSectionContent && <SectionContent>{metadataContent}</SectionContent>}
                </Section>
            </Example>
        );
    }

    private handleSmallChange = () => this.setState({ isCompact: !this.state.isCompact });

    private handleIconChange = () => this.setState({ hasIcon: !this.state.hasIcon });

    private handleDescriptionChange = () => this.setState({ hasDescription: !this.state.hasDescription });

    private handleRightElementChange = () => this.setState({ hasRightElement: !this.state.hasRightElement });

    private handleMultipleSectionContentChange = () =>
        this.setState({ hasMultipleSectionContent: !this.state.hasMultipleSectionContent });

    private handleCollapsibleChange = () => this.setState({ collapsible: !this.state.collapsible });
}
