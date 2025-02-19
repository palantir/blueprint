/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { Button, ButtonGroup } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

/* eslint-disable @typescript-eslint/no-deprecated */

export const ButtonGroupBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <ButtonGroup>
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>`;
    return (
        <CodeExample code={code} {...props}>
            <ButtonGroup>
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
        </CodeExample>
    );
};

export const ButtonGroupIntentExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <ButtonGroup>
            <Button intent="primary" text="One" />
            <Button intent="primary" text="Two" />
            <Button intent="primary" text="Three" />
        </ButtonGroup>`;
    return (
        <CodeExample code={code} {...props}>
            <ButtonGroup>
                <Button intent="primary" text="One" />
                <Button intent="primary" text="Two" />
                <Button intent="primary" text="Three" />
            </ButtonGroup>
        </CodeExample>
    );
};

export const ButtonGroupVariantExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <ButtonGroup variant="outlined">
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>
        <ButtonGroup variant="minimal">
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>`;
    return (
        <CodeExample code={code} {...props}>
            <ButtonGroup variant="outlined">
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
            <ButtonGroup variant="minimal">
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
        </CodeExample>
    );
};

export const ButtonGroupOutlinedMinimalExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <ButtonGroup outlined={true}>
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>
        <ButtonGroup minimal={true}>
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>`;
    return (
        <CodeExample code={code} {...props}>
            <ButtonGroup outlined={true}>
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
            <ButtonGroup minimal={true}>
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
        </CodeExample>
    );
};

export const ButtonGroupSizeExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <ButtonGroup size="small">
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>
        <ButtonGroup size="medium">
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>
        <ButtonGroup size="large">
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>`;
    return (
        <CodeExample code={code} {...props}>
            <ButtonGroup size="small">
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
            <ButtonGroup size="medium">
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
            <ButtonGroup size="large">
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
        </CodeExample>
    );
};

export const ButtonGroupFlexExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <ButtonGroup fill={true}>
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>
        <ButtonGroup fill={true}>
            <Button fill={true} intent="primary" text="Select one" />
            <Button icon="caret-down" intent="primary" aria-label="More" />
        </ButtonGroup>`;
    return (
        <CodeExample code={code} {...props}>
            <ButtonGroup fill={true}>
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
            <ButtonGroup fill={true}>
                <Button fill={true} intent="primary" text="Select one" />
                <Button icon="caret-down" intent="primary" aria-label="More" />
            </ButtonGroup>
        </CodeExample>
    );
};

export const ButtonGroupVerticalExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <ButtonGroup vertical={true}>
            <Button text="One" />
            <Button text="Two" />
            <Button text="Three" />
        </ButtonGroup>
        <ButtonGroup outlined={true} vertical={true}>
            <Button alignText="start" icon="align-left" text="Start" />
            <Button alignText="center" icon="align-center" text="Center" />
            <Button alignText="end" rightIcon="align-right" text="End" />
        </ButtonGroup>`;
    return (
        <CodeExample code={code} {...props}>
            <ButtonGroup vertical={true}>
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
            <ButtonGroup variant="outlined" vertical={true}>
                <Button alignText="start" icon="align-left" text="Start" />
                <Button alignText="center" icon="align-center" text="Center" />
                <Button alignText="end" rightIcon="align-right" text="End" />
            </ButtonGroup>
        </CodeExample>
    );
};
