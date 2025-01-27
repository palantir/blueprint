/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { Card, CardList, Section, SectionCard } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const CardListBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <CardList>
            <Card>Apples</Card>
            <Card>Oranges</Card>
            <Card>Bananas</Card>
        </CardList>`;
    return (
        <CodeExample code={code} {...props}>
            <CardList>
                <Card>Apples</Card>
                <Card>Oranges</Card>
                <Card>Bananas</Card>
            </CardList>
        </CodeExample>
    );
};

export const CardListBorderedExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <CardList bordered={true}>
            <Card>Bread</Card>
            <Card>Cheese</Card>
            <Card>Butter</Card>
        </CardList>
        <CardList bordered={false}>
            <Card>Honey</Card>
            <Card>Jam</Card>
            <Card>Peanut Butter</Card>
        </CardList>`;
    return (
        <CodeExample code={code} {...props}>
            <CardList bordered={true}>
                <Card>Bread</Card>
                <Card>Cheese</Card>
                <Card>Butter</Card>
            </CardList>
            <CardList bordered={false}>
                <Card>Honey</Card>
                <Card>Jam</Card>
                <Card>Peanut Butter</Card>
            </CardList>
        </CodeExample>
    );
};

export const CardListCompactExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <CardList compact={false}>
            <Card>Spaghetti</Card>
            <Card>Lasagna</Card>
            <Card>Ravioli</Card>
        </CardList>
        <CardList compact={true}>
            <Card>Penne</Card>
            <Card>Fettuccine</Card>
            <Card>Rigatoni</Card>
        </CardList>`;
    return (
        <CodeExample code={code} {...props}>
            <CardList compact={false}>
                <Card>Spaghetti</Card>
                <Card>Lasagna</Card>
                <Card>Ravioli</Card>
            </CardList>
            <CardList compact={true}>
                <Card>Penne</Card>
                <Card>Fettuccine</Card>
                <Card>Rigatoni</Card>
            </CardList>
        </CodeExample>
    );
};

export const CardListSectionExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Section title="Fresh Ingredients">
            <SectionCard padded={false}>
                <CardList bordered={false}>
                    <Card>Tomatoes</Card>
                    <Card>Garlic</Card>
                    <Card>Olive Oil</Card>
                    <Card>Basil</Card>
                    <Card>Parmesan</Card>
                    <Card>Pine Nuts</Card>
                </CardList>
            </SectionCard>
        </Section>`;
    return (
        <CodeExample code={code} {...props}>
            <Section title="Fresh Ingredients">
                <SectionCard padded={false}>
                    <CardList bordered={false}>
                        <Card>Tomatoes</Card>
                        <Card>Garlic</Card>
                        <Card>Olive Oil</Card>
                        <Card>Basil</Card>
                        <Card>Parmesan</Card>
                        <Card>Pine Nuts</Card>
                    </CardList>
                </SectionCard>
            </Section>
        </CodeExample>
    );
};
