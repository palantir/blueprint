/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { Button, Card, Elevation, H3 } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const CardBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Card>
            <H3>Adventure Awaits</H3>
            <p>Embark on an epic journey across uncharted lands. This card outlines your mission.</p>
            <Button intent="primary">Start Journey</Button>
        </Card>`;
    return (
        <CodeExample code={code} {...props}>
            <Card>
                <H3>Adventure Awaits</H3>
                <p>Embark on an epic journey across uncharted lands. This card outlines your mission.</p>
                <Button intent="primary">Start Journey</Button>
            </Card>
        </CodeExample>
    );
};

export const CardInteractiveExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Card interactive={true} onClick={...}>
            This card is interactive. Hover and click it.
        </Card>
        <Card interactive={true} selected={true}>
            This card is selected.
        </Card>`;
    return (
        <CodeExample code={code} {...props}>
            {/* eslint-disable-next-line no-console */}
            <Card interactive={true} onClick={() => console.log("clicked card")}>
                This card is interactive. Hover and click it.
            </Card>
            <Card interactive={true} selected={true}>
                This card is selected.
            </Card>
        </CodeExample>
    );
};

export const CardCompactExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Card>This card has default padding.</Card>
        <Card compact={true}>This card is more compact.</Card>`;
    return (
        <CodeExample code={code} {...props}>
            <Card>This card has default padding.</Card>
            <Card compact={true}>This card is more compact.</Card>
        </CodeExample>
    );
};

export const CardElevationExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Card elevation={Elevation.ZERO}>0</Card>
        <Card elevation={Elevation.ONE}>1</Card>
        <Card elevation={Elevation.TWO}>2</Card>
        <Card elevation={Elevation.THREE}>3</Card>
        <Card elevation={Elevation.FOUR}>4</Card>`;
    return (
        <CodeExample code={code} {...props}>
            <Card elevation={Elevation.ZERO}>0</Card>
            <Card elevation={Elevation.ONE}>1</Card>
            <Card elevation={Elevation.TWO}>2</Card>
            <Card elevation={Elevation.THREE}>3</Card>
            <Card elevation={Elevation.FOUR}>4</Card>
        </CodeExample>
    );
};
