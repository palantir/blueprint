/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import dedent from "dedent";
import { useCallback, useRef } from "react";

import { EditableText, Intent, OverlayToaster } from "@blueprintjs/core";
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

export const EditableTextBasicExample: React.FC<ExampleProps> = props => {
    const code = `<EditableText placeholder="Click to edit..." onConfirm={...} onCancel={...} />`;
    const toaster = useRef<OverlayToaster>(null);

    const handleConfirm = useCallback(
        (value: string) => toaster.current.show({ intent: Intent.SUCCESS, message: `Confirmed: ${value}` }),
        [],
    );

    const handleCancel = useCallback(() => toaster.current.show({ intent: Intent.DANGER, message: "Canceled" }), []);

    return (
        <CodeExample code={code} {...props}>
            <EditableText placeholder="Click to edit..." onConfirm={handleConfirm} onCancel={handleCancel} />
            <OverlayToaster ref={toaster} />
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
