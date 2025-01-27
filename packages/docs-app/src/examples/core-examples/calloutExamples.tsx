/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { Callout } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const CalloutBasicExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Callout title="Callout Title">This is some descriptive content.</Callout>`;
    return (
        <CodeExample code={code} {...props}>
            <Callout title="Callout Title">This is some descriptive content.</Callout>
        </CodeExample>
    );
};

export const CalloutIntentExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Callout intent="primary">This is a primary Callout</Callout>
        <Callout intent="success">This is a success Callout</Callout>
        <Callout intent="warning">This is a warning Callout</Callout>
        <Callout intent="danger">This is a danger Callout</Callout>`;
    return (
        <CodeExample code={code} {...props}>
            <Callout intent="primary">This is a primary Callout</Callout>
            <Callout intent="success">This is a success Callout</Callout>
            <Callout intent="warning">This is a warning Callout</Callout>
            <Callout intent="danger">This is a danger Callout</Callout>
        </CodeExample>
    );
};

export const CalloutIconExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Callout icon="clean" intent="primary">
            This is a Callout with a custom icon.
        </Callout>
        <Callout icon={false} intent="primary">
            This is a Callout with no icon.
        </Callout>`;
    return (
        <CodeExample code={code} {...props}>
            <Callout icon="clean" intent="primary">
                This is a Callout with a custom icon.
            </Callout>
            <Callout icon={false} intent="primary">
                This is a Callout with no icon.
            </Callout>
        </CodeExample>
    );
};

export const CalloutCompactExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <Callout>This is a Callout with default padding.</Callout>
        <Callout compact={true}>This Callout is more compact.</Callout>`;
    return (
        <CodeExample code={code} {...props}>
            <Callout>This is a Callout with default padding.</Callout>
            <Callout compact={true}>This Callout is more compact.</Callout>
        </CodeExample>
    );
};
