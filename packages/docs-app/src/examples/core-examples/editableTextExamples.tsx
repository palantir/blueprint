/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import * as React from "react";

import { EditableText, Intent, OverlayToaster } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

const toaster = OverlayToaster.createAsync();

export const EditableTextBasicExample: React.FC<ExampleProps> = props => {
    const code = `<EditableText placeholder="Click to edit..." onConfirm={...} onCancel={...} />`;

    const handleConfirm = async (value: string) =>
        (await toaster).show({ message: `Confirmed: ${value}`, intent: Intent.SUCCESS });

    const handleCancel = async () => (await toaster).show({ message: "Edit canceled" });

    return (
        <CodeExample code={code} {...props}>
            <EditableText placeholder="Click to edit..." onConfirm={handleConfirm} onCancel={handleCancel} />
        </CodeExample>
    );
};

export const EditableTextMultilineExample: React.FC<ExampleProps> = props => {
    const code = `<EditableText multiline={true} minLines={3} maxLines={5} placeholder="Click to edit multiple lines..." />`;
    return (
        <CodeExample code={code} {...props}>
            <EditableText multiline={true} minLines={3} maxLines={5} placeholder="Click to edit multiple lines..." />
        </CodeExample>
    );
};

export const EditableTextIntentExample: React.FC<ExampleProps> = props => {
    const code = dedent`
        <EditableText intent="primary" placeholder="Primary editable text..." />
        <EditableText intent="success" placeholder="Success editable text..." />
        <EditableText intent="warning" placeholder="Warning editable text..." />
        <EditableText intent="danger" placeholder="Danger editable text..." />`;
    return (
        <CodeExample code={code} {...props}>
            <EditableText intent="primary" placeholder="Primary editable text..." />
            <EditableText intent="success" placeholder="Success editable text..." />
            <EditableText intent="warning" placeholder="Warning editable text..." />
            <EditableText intent="danger" placeholder="Danger editable text..." />
        </CodeExample>
    );
};

export const EditableTextSelectExample: React.FC<ExampleProps> = props => {
    const code = `<EditableText selectAllOnFocus={true} value="Click to select this text." />`;
    return (
        <CodeExample code={code} {...props}>
            <EditableText selectAllOnFocus={true} value="Click to select this text." />
        </CodeExample>
    );
};
