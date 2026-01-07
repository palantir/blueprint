/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import EditableTextBasic from "./editable-text/EditableTextBasic";
import editableTextBasicPreview from "./editable-text/EditableTextBasic.tsx.preview?raw";
import editableTextBasicCode from "./editable-text/EditableTextBasic.tsx?raw";
import EditableTextIntent from "./editable-text/EditableTextIntent";
import editableTextIntentPreview from "./editable-text/EditableTextIntent.tsx.preview?raw";
import editableTextIntentCode from "./editable-text/EditableTextIntent.tsx?raw";
import EditableTextMultiline from "./editable-text/EditableTextMultiline";
import editableTextMultilinePreview from "./editable-text/EditableTextMultiline.tsx.preview?raw";
import editableTextMultilineCode from "./editable-text/EditableTextMultiline.tsx?raw";
import EditableTextSelect from "./editable-text/EditableTextSelect";
import editableTextSelectPreview from "./editable-text/EditableTextSelect.tsx.preview?raw";
import editableTextSelectCode from "./editable-text/EditableTextSelect.tsx?raw";

export const EditableTextBasicExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={editableTextBasicPreview}
            sourceCode={editableTextBasicCode}
            {...props}
        >
            <EditableTextBasic />
        </CodeExample>
    );
};

export const EditableTextMultilineExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={editableTextMultilinePreview}
            sourceCode={editableTextMultilineCode}
            {...props}
        >
            <EditableTextMultiline />
        </CodeExample>
    );
};

export const EditableTextIntentExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={editableTextIntentPreview}
            sourceCode={editableTextIntentCode}
            {...props}
        >
            <EditableTextIntent />
        </CodeExample>
    );
};

export const EditableTextSelectExample: React.FC<ExampleProps> = props => {
    return (
        <CodeExample
            previewCode={editableTextSelectPreview}
            sourceCode={editableTextSelectCode}
            {...props}
        >
            <EditableTextSelect />
        </CodeExample>
    );
};
