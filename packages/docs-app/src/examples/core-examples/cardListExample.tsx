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

import { Button, Card, CardList, Classes, Code, H5, Section, SectionCard, Switch } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { ChevronRight } from "@blueprintjs/icons";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

const ingredients = ["Basil", "Olive oil", "Kosher salt", "Garlic", "Pine nuts", "Parmigiano Reggiano"];

export const CardListExample: React.FC<ExampleProps> = props => {
    const [bordered, setBordered] = React.useState(true);
    const [compact, setCompact] = React.useState(false);
    const [interactive, setInteractive] = React.useState(true);
    const [padded, setPadded] = React.useState(false);
    const [useScrollableContainer, setUseScrollableContainer] = React.useState(false);
    const [useSectionContainer, setUseSectionContainer] = React.useState(false);

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
                    checked={bordered || useSectionContainer}
                    disabled={useSectionContainer}
                    label="Bordered"
                    onChange={handleBooleanChange(setBordered)}
                />
            </PropCodeTooltip>
            <Switch checked={compact} label="Compact" onChange={handleBooleanChange(setCompact)} />
            <H5>Card Props</H5>
            <Switch checked={interactive} label="Interactive" onChange={handleBooleanChange(setInteractive)} />
            <H5>Layout</H5>
            <Switch
                checked={useSectionContainer}
                labelElement={
                    <span>
                        Use <Code>Section</Code> container
                    </span>
                }
                onChange={handleBooleanChange(setUseSectionContainer)}
            />
            <H5 className={classNames({ [Classes.TEXT_MUTED]: !useSectionContainer })}>SectionCard</H5>
            <Switch
                disabled={!useSectionContainer}
                checked={padded}
                label="Use padding"
                onChange={handleBooleanChange(setPadded)}
            />
            <Switch
                disabled={!useSectionContainer}
                checked={useScrollableContainer}
                label="Use scrollable container"
                onChange={handleBooleanChange(setUseScrollableContainer)}
            />
        </>
    );

    const list = (
        <CardList bordered={bordered} compact={compact}>
            {ingredients.map(ingredient => (
                <Card interactive={interactive} key={ingredient}>
                    <span>{ingredient}</span>
                    {interactive ? (
                        <ChevronRight className={Classes.TEXT_MUTED} />
                    ) : (
                        <Button minimal={true} intent="primary" small={compact} text="Add" />
                    )}
                </Card>
            ))}
        </CardList>
    );

    const sectionCardClasses = classNames("docs-section-card", {
        "docs-section-card-limited-height": useScrollableContainer,
    });

    return (
        <Example options={options} {...props}>
            <div>
                {useSectionContainer ? (
                    <Section title="Traditional pesto" subtitle="Ingredients" compact={compact}>
                        <SectionCard className={sectionCardClasses} padded={padded}>
                            {list}
                        </SectionCard>
                    </Section>
                ) : (
                    list
                )}
            </div>
        </Example>
    );
};
