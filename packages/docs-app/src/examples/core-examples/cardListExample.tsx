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

import classNames from "classnames";
import * as React from "react";

import { Button, Card, CardList, Classes, Code, H5, Section, SectionCard, Switch } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { ChevronRight } from "@blueprintjs/icons";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

export interface CardListExampleState {
    isBordered: boolean;
    isCompact: boolean;
    useInteractiveCards: boolean;
    useScrollableContainer: boolean;
    useSectionCardPadding: boolean;
    useSectionContainer: boolean;
}

export class CardListExample extends React.PureComponent<ExampleProps, CardListExampleState> {
    public state: CardListExampleState = {
        isBordered: true,
        isCompact: false,
        useInteractiveCards: true,
        useScrollableContainer: false,
        useSectionCardPadding: false,
        useSectionContainer: false,
    };

    private get isBordered() {
        return this.state.useSectionContainer ? this.state.useSectionCardPadding : this.state.isBordered;
    }

    public render() {
        const { isCompact, useInteractiveCards, useScrollableContainer, useSectionCardPadding, useSectionContainer } =
            this.state;

        const options = (
            <>
                <H5>CardList Props</H5>
                <PropCodeTooltip
                    disabled={!useSectionContainer}
                    content={
                        <span>
                            This example overrides <Code>isBordered</Code> when using a <Code>Section</Code> container
                        </span>
                    }
                >
                    <Switch
                        checked={this.isBordered}
                        disabled={useSectionContainer}
                        label="Bordered"
                        onChange={this.toggleIsBordered}
                    />
                </PropCodeTooltip>
                <Switch checked={isCompact} label="Compact" onChange={this.toggleIsCompact} />
                <H5>Card Props</H5>
                <Switch checked={useInteractiveCards} label="Interactive" onChange={this.toggleUseInteractiveCards} />
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
                <H5 className={classNames({ [Classes.TEXT_MUTED]: !useSectionContainer })}>SectionCard</H5>
                <Switch
                    disabled={!useSectionContainer}
                    checked={useSectionCardPadding}
                    label="Use padding"
                    onChange={this.toggleUseSectionCardPadding}
                />
                <Switch
                    disabled={!useSectionContainer}
                    checked={useScrollableContainer}
                    label="Use scrollable container"
                    onChange={this.toggleUseScrollableContainer}
                />
            </>
        );

        const sectionCardClasses = classNames("docs-section-card", {
            "docs-section-card-limited-height": useScrollableContainer,
        });

        return (
            <Example options={options} {...this.props}>
                <div>
                    {useSectionContainer ? (
                        <Section title="Traditional pesto" subtitle="Ingredients" compact={isCompact}>
                            <SectionCard className={sectionCardClasses} padded={useSectionCardPadding}>
                                {this.renderList()}
                            </SectionCard>
                        </Section>
                    ) : (
                        this.renderList()
                    )}
                </div>
            </Example>
        );
    }

    private renderList() {
        const { isCompact, useInteractiveCards } = this.state;
        const ingredients = ["Basil", "Olive oil", "Kosher salt", "Garlic", "Pine nuts", "Parmigiano Reggiano"];

        return (
            <CardList bordered={this.isBordered} compact={isCompact}>
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

    private toggleIsBordered = handleBooleanChange(isBordered => this.setState({ isBordered }));

    private toggleIsCompact = handleBooleanChange(isCompact => this.setState({ isCompact }));

    private toggleUseInteractiveCards = handleBooleanChange(useInteractiveCards =>
        this.setState({ useInteractiveCards }),
    );

    private toggleUseScrollableContainer = handleBooleanChange(useScrollableContainer =>
        this.setState({ useScrollableContainer }),
    );

    private toggleUseSectionCardPadding = handleBooleanChange(useSectionCardPadding =>
        this.setState({ useSectionCardPadding }),
    );

    private toggleUseSectionContainer = handleBooleanChange(useSectionContainer =>
        this.setState({ useSectionContainer }),
    );
}
