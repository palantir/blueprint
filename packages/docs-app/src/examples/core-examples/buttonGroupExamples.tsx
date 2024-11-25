/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { Button, ButtonGroup } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

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

export const ButtonGroupVariantsExample: React.FC<ExampleProps> = props => {
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
            <Button alignText="left" icon="align-left" text="Left" />
            <Button alignText="center" icon="align-center" text="Center" />
            <Button alignText="right" rightIcon="align-right" text="Right" />
        </ButtonGroup>`;
    return (
        <CodeExample code={code} {...props}>
            <ButtonGroup vertical={true}>
                <Button text="One" />
                <Button text="Two" />
                <Button text="Three" />
            </ButtonGroup>
            <ButtonGroup outlined={true} vertical={true}>
                <Button alignText="left" icon="align-left" text="Left" />
                <Button alignText="center" icon="align-center" text="Center" />
                <Button alignText="right" rightIcon="align-right" text="Right" />
            </ButtonGroup>
        </CodeExample>
    );
};
