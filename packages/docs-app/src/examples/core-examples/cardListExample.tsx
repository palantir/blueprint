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

import { Button, Card, CardList, Classes, H5, Icon, Intent, Section, SectionPanel, Switch } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

export interface CardListExampleState {
    isContained: boolean;
    hasInteractiveCards: boolean;
    isCompact: boolean;
}

export class CardListExample extends React.PureComponent<ExampleProps> {
    public state: CardListExampleState = {
        hasInteractiveCards: true,
        isCompact: false,
        isContained: false,
    };

    public render() {
        const { isContained, hasInteractiveCards, isCompact } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={isContained} label="Contained" onChange={this.handleContainedChange} />
                <Switch checked={isCompact} label="Compact" onChange={this.handleSmallChange} />
                <H5>Example</H5>
                <Switch
                    checked={hasInteractiveCards}
                    label="Interactive cards"
                    onChange={this.handleInteractiveCardsChange}
                />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                {isContained ? (
                    <Section title="Ingredients" compact={isCompact}>
                        <SectionPanel padded={false}>{this.renderList()}</SectionPanel>
                    </Section>
                ) : (
                    this.renderList()
                )}
            </Example>
        );
    }

    private renderList() {
        const { hasInteractiveCards, isContained, isCompact } = this.state;
        const ingredients: string[] = ["Olive oil", "Ground black pepper", "Carrots", "Onions"];

        return (
            <CardList contained={isContained} compact={isCompact}>
                {ingredients.map(ingredient => (
                    <Card
                        style={{ justifyContent: "space-between" }}
                        interactive={hasInteractiveCards}
                        key={ingredient}
                    >
                        <span>{ingredient}</span>
                        {hasInteractiveCards ? (
                            <Icon icon={IconNames.CHEVRON_RIGHT} className={Classes.TEXT_MUTED} />
                        ) : (
                            <Button minimal={true} intent={Intent.PRIMARY} small={isCompact}>
                                Add
                            </Button>
                        )}
                    </Card>
                ))}
            </CardList>
        );
    }

    private handleSmallChange = () => this.setState({ isCompact: !this.state.isCompact });

    private handleContainedChange = () => this.setState({ isContained: !this.state.isContained });

    private handleInteractiveCardsChange = () =>
        this.setState({ hasInteractiveCards: !this.state.hasInteractiveCards });
}
