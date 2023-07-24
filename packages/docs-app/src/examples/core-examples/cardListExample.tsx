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

import { Button, Card, CardList, Classes, Code, H5, Section, SectionCard, Switch } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { ChevronRight } from "@blueprintjs/icons";

export interface CardListExampleState {
    isCompact: boolean;
    useInteractiveCards: boolean;
    useSectionContainer: boolean;
}

export class CardListExample extends React.PureComponent<ExampleProps, CardListExampleState> {
    public state: CardListExampleState = {
        isCompact: false,
        useInteractiveCards: true,
        useSectionContainer: false,
    };

    public render() {
        const { isCompact, useInteractiveCards, useSectionContainer } = this.state;

        const options = (
            <>
                <H5>Layout</H5>
                <Switch
                    checked={useSectionContainer}
                    labelElement={
                        <span>
                            Use <Code>Section</Code> container
                        </span>
                    }
                    onChange={this.toggleUseSectionContainer}
                />
                <H5>CardList Props</H5>
                <Switch checked={isCompact} label="Compact" onChange={this.toggleIsCompact} />
                <H5>Card Props</H5>
                <Switch checked={useInteractiveCards} label="Interactive" onChange={this.toggleUseInteractiveCards} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                {useSectionContainer ? (
                    <Section title="Ingredients" compact={isCompact}>
                        <SectionCard padded={false}>{this.renderList()}</SectionCard>
                    </Section>
                ) : (
                    this.renderList()
                )}
            </Example>
        );
    }

    private renderList() {
        const { isCompact, useInteractiveCards, useSectionContainer } = this.state;
        const ingredients: string[] = ["Olive oil", "Ground black pepper", "Carrots", "Onions"];

        return (
            <CardList contained={useSectionContainer} compact={isCompact}>
                {ingredients.map(ingredient => (
                    <Card interactive={useInteractiveCards} key={ingredient}>
                        <span>{ingredient}</span>
                        {useInteractiveCards ? (
                            <ChevronRight className={Classes.TEXT_MUTED} />
                        ) : (
                            <Button minimal={true} intent="primary" small={isCompact} text="Add" />
                        )}
                    </Card>
                ))}
            </CardList>
        );
    }

    private toggleIsCompact = () => this.setState({ isCompact: !this.state.isCompact });

    private toggleUseInteractiveCards = () => this.setState({ useInteractiveCards: !this.state.useInteractiveCards });

    private toggleUseSectionContainer = () => this.setState({ useSectionContainer: !this.state.useSectionContainer });
}
