/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import EditableTextBasic from "./editable-text/EditableTextBasic";
import editableTextBasicPreview from "./editable-text/EditableTextBasic.tsx.preview?raw";
import EditableTextIntent from "./editable-text/EditableTextIntent";
import editableTextIntentPreview from "./editable-text/EditableTextIntent.tsx.preview?raw";
import EditableTextMultiline from "./editable-text/EditableTextMultiline";
import editableTextMultilinePreview from "./editable-text/EditableTextMultiline.tsx.preview?raw";
import EditableTextSelect from "./editable-text/EditableTextSelect";
import editableTextSelectPreview from "./editable-text/EditableTextSelect.tsx.preview?raw";

export const EditableTextBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={editableTextBasicPreview} {...props}>
            <EditableTextBasic />
        </CodeExample>
    );
};

export const EditableTextMultilineExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={editableTextMultilinePreview} {...props}>
            <EditableTextMultiline />
        </CodeExample>
    );
};

export const EditableTextIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={editableTextIntentPreview} {...props}>
            <EditableTextIntent />
        </CodeExample>
    );
};

export const EditableTextSelectExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample code={editableTextSelectPreview} {...props}>
            <EditableTextSelect />
        </CodeExample>
    );
};
